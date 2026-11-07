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
async function scan({endpoint,rows,tokens,history=false,usd=false},signal,emit,fetcher){
  endpoint=endpointUrl(endpoint);rows=validateRows(rows);tokens=tokenAddresses(tokens);
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
  let snapshot=null;
  if(usd)try{snapshot=await fetchPrices(tokens,signal,fetcher);}catch{signal.throwIfAborted();snapshot={prices:{},source:'DefiLlama',fetchedAt:new Date().toISOString()};}
  emit({type:'start',block,unique:unique.length,tokens:metadata,pricing:snapshot?{source:snapshot.source,fetchedAt:snapshot.fetchedAt,pricedAssets:Object.keys(snapshot.prices).length}:null});
  let cursor=0,done=0;
  async function runner(){
    const rpc=createRpc(endpoint,signal,fetcher);
    while(cursor<unique.length){
      signal.throwIfAborted();const address=unique[cursor++];
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
      if(snapshot){result.usd=estimateUsd(result,snapshot);if(result.usd.partial&&result.status==='ok')result.status='partial';}
      emit({type:'result',result,done:++done,total:unique.length});
    }
  }
  await Promise.all(Array.from({length:3},runner));
  emit({type:'complete',block});
}
function csv(rows,results,block){
  const q=v=>{let text=String(v??'');if(/^[\s\u0000-\u001f]*[=+@-]/u.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
  const records=[['mode','index','chemin','adresse','ETH','wei','transactions_sortantes','statut','ERC20_controles','bloc','transactions_indexees','transferts_tokens_indexes','historique_statut','historique_verifie_a','USD_estime','USD_partiel','USD_cours_date']];
  for(const row of validateRows(rows)){
    const r=results[row.address];
    records.push([row.derivations.map(a=>a.mode).join(' | '),row.derivations.map(a=>a.index??'').join(' | '),row.derivations.map(a=>a.path).join(' | '),row.address,r?.eth??'',r?.wei??'',r?.nonce??'',r?.status??'non contrôlé',r?.tokens.map(t=>`${t.address} ${t.symbol}: ${t.balance??'ERREUR'}`).join(' | ')??'',block??'',r?.activity?.transactions??'',r?.activity?.tokenTransfers??'',r?.activity?.status??'non demandé',r?.activity?.checkedAt??'',r?.usd?.value??'',r?.usd?.partial??'',r?.usd?.fetchedAt??'']);
  }
  return '\ufeff'+records.map(r=>r.map(q).join(';')).join('\r\n');
}
module.exports={validateRows,endpointUrl,tokenAddresses,createRpc,scan,csv,activityCounters,aggregateReads};
