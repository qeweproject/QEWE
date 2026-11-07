const {readText}=require('./network.cjs');
const {getAddress,formatEther,formatUnits,Interface,decodeBytes32String}=require('ethers');
const {normalizeRows:validateRows}=require('./address-book.js');
const PRESETS=require('./token-presets.js');
const {fetchPrices,estimateUsd}=require('./pricing.cjs');
const MULTICALL='0xcA11bde05977b3631167028862bE2a173976CA11';
const BATCH=new Interface(['function aggregate3(tuple(address target,bool allowFailure,bytes callData)[] calls) payable returns(tuple(bool success,bytes returnData)[])']);
const ABI=new Interface(['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)','function symbol() view returns(string)']);
function endpointUrl(value){
  if(typeof value!=='string'||value.length>2048)throw Error('URL RPC invalide.');
  let u;try{u=new URL(value);}catch{throw Error('URL RPC invalide.');}
  if(u.protocol!=='https:' && !(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)))throw Error('RPC HTTPS requis (HTTP autorisé sur localhost).');
  if(u.username||u.password||u.hash)throw Error('URL RPC sans identifiants HTTP ni fragment requise.');
  return u.href;
}
function tokenAddresses(list){
  if(!Array.isArray(list)||list.length>50)throw Error('50 contrats ERC20 maximum.');
  return [...new Set(list.map(a=>getAddress(a)))];
}
function createRpc(endpoint,signal,fetcher=fetch){
  let id=0;
  return async function rpc(method,params=[]){
    for(let attempt=0;attempt<3;attempt++){
      signal.throwIfAborted();
      const timeout=AbortSignal.timeout(15000);
      try{
        const response=await fetcher(endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++id,method,params}),signal:AbortSignal.any([signal,timeout])});
        if(!response.ok)throw Error('HTTP');
        const raw=await readText(response,131072);
        const result=JSON.parse(raw);
        if(!result||typeof result!=='object'||Array.isArray(result)||(result.jsonrpc!==undefined&&result.jsonrpc!=='2.0')||result.id!==id||result.error||typeof result.result!=='string'||!/^0x[0-9a-fA-F]*$/.test(result.result))throw Error('RPC');
        return result.result;
      }catch(_){
        signal.throwIfAborted();
        if(attempt===2)throw Error('Réponse RPC indisponible ou invalide après 3 essais.');
        await new Promise((resolve,reject)=>{
          const onAbort=()=>{clearTimeout(timer);reject(Error('Annulé'));};
          const timer=setTimeout(()=>{signal.removeEventListener('abort',onAbort);resolve();},600*(attempt+1));
          signal.addEventListener('abort',onAbort,{once:true});
        });
      }
    }
  };
}
function quantity(s){if(typeof s!=='string'||s.length>66||!/^0x[0-9a-fA-F]+$/.test(s))throw Error('Quantité RPC invalide.');return BigInt(s);}
async function aggregateReads(rpc,calls,block){
  const raw=await rpc('eth_call',[{to:MULTICALL,data:BATCH.encodeFunctionData('aggregate3',[calls])},block]);
  const values=BATCH.decodeFunctionResult('aggregate3',raw)[0];
  if(values.length!==calls.length)throw Error('Réponse groupée invalide.');
  return values;
}
async function activityCounters(address,signal,fetcher=fetch){
  address=validateRows([{address}])[0].address;
  const response=await fetcher('https://eth.blockscout.com/api/v2/addresses/'+address+'/counters',{method:'GET',redirect:'error',headers:{Accept:'application/json'},signal:AbortSignal.any([signal,AbortSignal.timeout(12000)])});
  if(!response.ok)throw Error('Historique indisponible.');
  const raw=await readText(response,32768);
  const data=JSON.parse(raw);
  const count=value=>{if(!/^\d{1,30}$/.test(String(value)))throw Error('Compteur invalide.');return BigInt(value).toString();};
  return {status:'ok',transactions:count(data.transactions_count),tokenTransfers:count(data.token_transfers_count),checkedAt:new Date().toISOString()};
}
const NET=require('./networks.js');
/* Optional extra EVM networks: [{id, endpoint}] from the main process. Same addresses, native asset only. */
function networkRequests(list){
  if(list===undefined||list===null)return [];
  if(!Array.isArray(list)||list.length>NET.NETWORKS.length)throw Error('Réseaux invalides.');
  const seen=new Set();
  return list.map(item=>{
    const net=NET.byId(item?.id);
    if(!net||seen.has(net.id))throw Error('Réseau inconnu.');seen.add(net.id);
    return {...net,endpoint:endpointUrl(item.endpoint||net.rpc)};
  });
}
function gapLimit(value){if(value===undefined||value===null||value===0)return 0;if(!Number.isInteger(value)||value<1||value>1000)throw Error('Limite d’adresses vides : entier entre 0 et 1000.');return value;}
const clean=(value,max=24)=>String(value??'').replace(/[^a-zA-Z0-9_.$ -]/g,'').trim().slice(0,max);
/* Blockscout discovery: every ERC20/NFT the indexer knows for this address. Untrusted, display only. */
async function discoverTokens(base,address,network,signal,fetcher=fetch){
  address=validateRows([{address}])[0].address;
  const response=await fetcher(base+'/api/v2/addresses/'+address+'/tokens?type=ERC-20%2CERC-721%2CERC-1155',{method:'GET',redirect:'error',headers:{Accept:'application/json'},signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])});
  if(response.status===404)return [];
  if(!response.ok)throw Error('Détection indisponible.');
  const data=JSON.parse(await readText(response,524288));
  if(!data||!Array.isArray(data.items))throw Error('Détection invalide.');
  const out=[];
  for(const item of data.items.slice(0,100)){
    const t=item?.token||{};let contract;
    try{contract=getAddress(t.address_hash||t.address);}catch{continue;}
    const type=['ERC-20','ERC-721','ERC-1155'].includes(t.type)?t.type:null;if(!type)continue;
    const raw=/^\d{1,78}$/.test(String(item.value??''))?String(item.value):null;if(raw===null||raw==='0')continue;
    const decimals=type==='ERC-20'&&/^\d{1,2}$/.test(String(t.decimals??''))?Number(t.decimals):0;
    let balance=raw;try{balance=formatUnits(raw,decimals);}catch{}
    out.push({network,address:contract,type,symbol:clean(t.symbol)||contract.slice(0,10),name:clean(t.name,40),raw,balance});
  }
  return out;
}
function used(r){
  // Only an unknown ETH balance or nonce counts as "used" (never skip on missing core data).
  // A token that cannot be read, a partial USD estimate or a failed extra network affects every
  // address the same way and must not disable the stop: those are ignored here.
  if(!r||r.wei===null||r.wei===undefined||r.nonce===null||r.nonce===undefined)return true;
  const pos=v=>v!==null&&v!==undefined&&BigInt(v)>0n;
  return pos(r.wei)||pos(r.nonce)||r.tokens.some(t=>pos(t.raw))||(r.networks||[]).some(n=>pos(n.wei)||pos(n.nonce))||
    (r.activity?.status==='ok'&&(pos(r.activity.transactions)||pos(r.activity.tokenTransfers)))||(r.discovered||[]).length>0;
}
async function scan({endpoint,rows,tokens,history=false,usd=false,networks=[],discover=false,gap=0},signal,emit,fetcher){
  endpoint=endpointUrl(endpoint);rows=validateRows(rows);tokens=tokenAddresses(tokens);networks=networkRequests(networks);gap=gapLimit(gap);discover=discover===true;
  const unique=[...new Set(rows.map(r=>r.address))];
  // One RPC instance per concurrent worker so IDs cannot race.
  const initial=createRpc(endpoint,signal,fetcher);
  if(quantity(await initial('eth_chainId'))!==1n)throw Error('Ce RPC ne correspond pas à Ethereum mainnet (chainId 1).');
  const block=await initial('eth_blockNumber');quantity(block);
  const metadata=[];
  let useBatch=tokens.length>4,packed=null;
  if(useBatch){
    try{packed=await aggregateReads(initial,tokens.flatMap(address=>['decimals','symbol'].map(method=>({target:address,allowFailure:true,callData:ABI.encodeFunctionData(method)}))),block);}
    catch{signal.throwIfAborted();useBatch=false;}
  }
  for(let i=0;i<tokens.length;i++){
    const address=tokens[i];
    let symbol=PRESETS.find(t=>t.address.toLowerCase()===address.toLowerCase())?.symbol||address.slice(0,10);
    try{
      const read=async(method,offset)=>{if(packed){if(!packed[2*i+offset].success)throw Error('Échec du contrat.');return packed[2*i+offset].returnData;}return initial('eth_call',[{to:address,data:ABI.encodeFunctionData(method)},block]);};
      const decimals=Number(ABI.decodeFunctionResult('decimals',await read('decimals',0))[0]);
      try{const raw=await read('symbol',1);let value;try{value=ABI.decodeFunctionResult('symbol',raw)[0];}catch{value=decodeBytes32String(raw);}symbol=String(value).replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,24)||symbol;}catch{}
      metadata.push({address,decimals,symbol,status:'ok'});
    }catch{signal.throwIfAborted();metadata.push({address,status:'error',symbol});}
  }
  // Extra networks: a wrong chain or unreachable RPC marks only that network as failed.
  const nets=[];
  for(const net of networks){
    const entry={id:net.id,name:net.name,symbol:net.symbol,chainId:net.chainId,endpoint:net.endpoint,blockscout:net.blockscout,price:net.price,status:'ok',block:null};
    try{
      const rpc=createRpc(net.endpoint,signal,fetcher);
      if(quantity(await rpc('eth_chainId'))!==BigInt(net.chainId))throw Error('chainId');
      entry.block=await rpc('eth_blockNumber');quantity(entry.block);
    }catch{signal.throwIfAborted();entry.status='error';}
    nets.push(entry);
  }
  let snapshot=null;
  if(usd)try{snapshot=await fetchPrices(tokens,signal,fetcher,Date.now(),nets.filter(n=>n.status==='ok').map(n=>n.price));}catch{signal.throwIfAborted();snapshot={prices:{},source:'DefiLlama',fetchedAt:new Date().toISOString()};}
  emit({type:'start',block,unique:unique.length,tokens:metadata,networks:nets.map(({id,name,symbol,status})=>({id,name,symbol,status})),pricing:snapshot?{source:snapshot.source,fetchedAt:snapshot.fetchedAt,pricedAssets:Object.keys(snapshot.prices).length}:null});
  const discoverySources=discover?[{id:'ethereum',base:NET.MAINNET.blockscout},...nets.filter(n=>n.status==='ok'&&n.blockscout).map(n=>({id:n.id,base:n.blockscout}))]:[];
  async function scanAddress(address,rpc,netRpcs){
    signal.throwIfAborted();
    const result={address,eth:null,wei:null,nonce:null,tokens:[],activity:null,status:'ok'};
    try{result.wei=quantity(await rpc('eth_getBalance',[address,block])).toString();result.eth=formatEther(result.wei);}catch{signal.throwIfAborted();result.status='error';}
      try{result.nonce=quantity(await rpc('eth_getTransactionCount',[address,block])).toString();}catch{signal.throwIfAborted();result.status='partial';}
      let balances=null;
      const valid=metadata.filter(t=>t.status==='ok');
      if(useBatch&&valid.length){
        try{balances=await aggregateReads(rpc,valid.map(t=>({target:t.address,allowFailure:true,callData:ABI.encodeFunctionData('balanceOf',[address])})),block);}
        catch{signal.throwIfAborted();balances=[];}
      }
      let slot=0;
      for(const t of metadata){
        if(t.status==='error'){result.tokens.push({...t,balance:null,raw:null});continue;}
        const batchItem=balances?balances[slot++]:null;
        try{
          if(balances&&!batchItem?.success)throw Error('Lecture inconnue.');
          const value=balances?batchItem.returnData:await rpc('eth_call',[{to:t.address,data:ABI.encodeFunctionData('balanceOf',[address])},block]);
          const raw=ABI.decodeFunctionResult('balanceOf',value)[0].toString();
          result.tokens.push({...t,balance:formatUnits(raw,t.decimals),raw});
        }catch{signal.throwIfAborted();result.tokens.push({...t,status:'error',balance:null,raw:null});}
      }
      if(result.tokens.some(t=>t.status==='error')&&result.status==='ok')result.status='partial';
      if(history){
        try{result.activity=await activityCounters(address,signal,fetcher);}
        catch{signal.throwIfAborted();result.activity={status:'error',transactions:null,tokenTransfers:null};if(result.status==='ok')result.status='partial';}
      }
    if(nets.length){
      result.networks=[];
      for(const n of nets){
        const entry={id:n.id,name:n.name,symbol:n.symbol,price:n.price,wei:null,balance:null,nonce:null,status:n.status};
        if(n.status==='ok'){
          try{entry.wei=quantity(await netRpcs.get(n.id)('eth_getBalance',[address,n.block])).toString();entry.balance=formatEther(entry.wei);
            entry.nonce=quantity(await netRpcs.get(n.id)('eth_getTransactionCount',[address,n.block])).toString();}
          catch{signal.throwIfAborted();entry.status='error';}
        }
        if(entry.status!=='ok'&&result.status==='ok')result.status='partial';
        result.networks.push(entry);
      }
    }
    if(discoverySources.length){
      result.discovered=[];result.discoveryStatus='ok';
      const known=new Set(metadata.map(t=>t.address.toLowerCase()));
      for(const source of discoverySources){
        try{for(const t of await discoverTokens(source.base,address,source.id,signal,fetcher))if(!(source.id==='ethereum'&&known.has(t.address.toLowerCase())))result.discovered.push(t);}
        catch{signal.throwIfAborted();result.discoveryStatus='partial';}
      }
      if(result.discoveryStatus!=='ok'&&result.status==='ok')result.status='partial';
    }
    if(snapshot){result.usd=estimateUsd(result,snapshot);if(result.usd.partial&&result.status==='ok')result.status='partial';}
    return result;
  }
  const workerRpcs=()=>[createRpc(endpoint,signal,fetcher),new Map(nets.filter(n=>n.status==='ok').map(n=>[n.id,createRpc(n.endpoint,signal,fetcher)]))];
  let done=0;
  async function pool(list,onResult){
    let cursor=0;
    await Promise.all(Array.from({length:Math.min(3,list.length)},async()=>{
      const [rpc,netRpcs]=workerRpcs();
      while(cursor<list.length){const address=list[cursor++];const result=await scanAddress(address,rpc,netRpcs);onResult?.(address,result);emit({type:'result',result,done:++done,total:unique.length});}
    }));
  }
  if(!gap){await pool(unique);emit({type:'complete',block});return;}
  // Gap limit: indexes are scanned level by level, so a stop decision always sees every lower index.
  // A path stops after `gap` consecutive unused indexes; imported addresses (no index) are always scanned.
  const byAddress=new Map(rows.map(r=>[r.address,r]));
  const level=a=>Math.min(...byAddress.get(a).derivations.map(d=>d.index??-1));
  const ordered=[...unique].sort((x,y)=>level(x)-level(y));
  const last=new Map(),stopped=d=>d.index!==null&&d.index>(last.get(d.mode)??-1)+gap;
  let skipped=[];
  const flush=()=>{if(skipped.length){done+=skipped.length;emit({type:'skipped',addresses:skipped,done,total:unique.length});skipped=[];}};
  for(let i=0;i<ordered.length;){
    signal.throwIfAborted();
    const lv=level(ordered[i]);let j=i;while(j<ordered.length&&level(ordered[j])===lv)j++;
    const todo=[];for(const a of ordered.slice(i,j))(byAddress.get(a).derivations.every(stopped)?skipped:todo).push(a);i=j;
    if(todo.length){flush();await pool(todo,(address,result)=>{if(used(result))for(const d of byAddress.get(address).derivations)if(d.index!==null)last.set(d.mode,Math.max(last.get(d.mode)??-1,d.index));});}
  }
  flush();
  emit({type:'complete',block});
}
function csv(rows,results,block){
  const q=v=>{let text=String(v??'');if(/^[\s\u0000-\u001f]*[=+@-]/u.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
  const records=[['mode','index','chemin','adresse','ETH','wei','transactions_sortantes','statut','ERC20_controles','bloc','transactions_indexees','transferts_tokens_indexes','historique_statut','historique_verifie_a','USD_estime','USD_partiel','USD_cours_date','autres_reseaux','tokens_detectes_non_verifies']];
  for(const row of validateRows(rows)){
    const r=results[row.address];
    records.push([row.derivations.map(a=>a.mode).join(' | '),row.derivations.map(a=>a.index??'').join(' | '),row.derivations.map(a=>a.path).join(' | '),row.address,r?.eth??'',r?.wei??'',r?.nonce??'',r?.status??'non contrôlé',r?.tokens.map(t=>`${t.address} ${t.symbol}: ${t.balance??'ERREUR'}`).join(' | ')??'',block??'',r?.activity?.transactions??'',r?.activity?.tokenTransfers??'',r?.activity?.status??'non demandé',r?.activity?.checkedAt??'',r?.usd?.value??'',r?.usd?.partial??'',r?.usd?.fetchedAt??'',(r?.networks||[]).map(n=>`${n.name}: ${n.status==='ok'?`${n.balance} ${n.symbol} (nonce ${n.nonce})`:'ERREUR'}`).join(' | '),(r?.discovered||[]).map(t=>`${t.network} ${t.type} ${t.address} ${t.symbol}: ${t.balance}`).join(' | ')]);
  }
  return '\ufeff'+records.map(r=>r.map(q).join(';')).join('\r\n');
}
module.exports={validateRows,endpointUrl,tokenAddresses,createRpc,scan,csv,activityCounters,aggregateReads,networkRequests,gapLimit,discoverTokens,used};
