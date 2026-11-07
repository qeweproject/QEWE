const {readText}=require('./network.cjs');
/* Main-process transfer preparation and exact signed-envelope validation. No signer here. */
const E=require('ethers'),{randomUUID}=require('node:crypto');
const {endpointUrl,validateRows}=require('./core.cjs'),Codec=require('./transfer-codec.js');
const PRESETS=require('./token-presets.js'),DESCRIPTORS=require('./vendor/ledger-tokens.json');
const ABI=new E.Interface(['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)','function transfer(address,uint256) returns(bool)']);
const qty=value=>{if(typeof value!=='string'||!/^0x(?:0|[1-9a-f][0-9a-f]*)$/i.test(value)||value.length>66)throw Error('Quantité RPC invalide.');return BigInt(value);};
const data=value=>{if(typeof value!=='string'||!/^0x(?:[a-f0-9]{2})*$/i.test(value)||value.length>131072)throw Error('Données RPC invalides.');return value;};
function rpcClient(endpoint,signal,fetcher=fetch){let next=0;return async(method,params=[])=>{
 const id=++next;const response=await fetcher(endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id,method,params}),signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])});
 if(!response.ok)throw Error('RPC indisponible.');const raw=await readText(response,131072);const body=JSON.parse(raw);if(!body||typeof body!=='object'||Array.isArray(body)||(body.jsonrpc!==undefined&&body.jsonrpc!=='2.0')||body.id!==id||body.error||!Object.hasOwn(body,'result'))throw Error('Requête RPC refusée ou invalide.');return body.result;
 };}
const catalog=()=>[{id:'ETH',symbol:'ETH',decimals:18},...PRESETS.filter(t=>DESCRIPTORS[t.address.toLowerCase()]).map(t=>({id:t.address,symbol:t.symbol,decimals:t.decimals}))];
const amountUnits=(value,decimals)=>{if(typeof value!=='string'||value.length>90||!/^\d+(?:[.,]\d+)?$/.test(value))throw Error('Saisissez un montant positif, sans notation scientifique.');const units=E.parseUnits(value.replace(',','.'),decimals);if(units<=0n||units>E.MaxUint256)throw Error('Montant invalide.');return units;};
class TransferManager{
 constructor({fetcher=fetch,now=Date.now,allowedAssets=catalog}={}){this.fetcher=fetcher;this.now=now;this.allowedAssets=allowedAssets;this.sources=new Map();this.plans=new Map();}
 clear(){this.sources.clear();for(const p of this.plans.values())if(['prepared','signing'].includes(p.state))p.state='cancelled';}
 register(rows){for(const row of validateRows(rows)){const paths=row.derivations.map(d=>d.path).filter(Boolean);if(paths.length)this.sources.set(row.address,new Set(paths));}return this.sources.size;}
 source(from,path){from=E.getAddress(from);if(!this.sources.get(from)?.has(path))throw Error('Envoi réservé aux adresses lues sur le Ledger pendant cette session. Relisez le Ledger.');return from;}
 plan(id,states=['prepared','signing']){const p=this.plans.get(id);if(!p||!states.includes(p.state))throw Error('Préparation indisponible ou déjà utilisée.');if(this.now()>p.expiresAt){p.state='expired';throw Error('Les frais ont expiré. Préparez à nouveau la transaction.');}this.source(p.from,p.path);return p;}
 async network(rpc){if(qty(await rpc('eth_chainId'))!==1n)throw Error('Ethereum mainnet (réseau 1) requis.');}
 async pending(rpc,from){const pending=qty(await rpc('eth_getTransactionCount',[from,'pending'])),latest=qty(await rpc('eth_getTransactionCount',[from,'latest']));if(pending!==latest)throw Error('Cette adresse a déjà une transaction en attente. Attendez sa confirmation.');if(pending>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Nonce non pris en charge.');return Number(pending);}
 async balance(rpc,a,from){if(a.id==='ETH')return qty(await rpc('eth_getBalance',[from,'pending']));return ABI.decodeFunctionResult('balanceOf',data(await rpc('eth_call',[{to:a.address,data:ABI.encodeFunctionData('balanceOf',[from])},'pending'])))[0];}
 invalidate(){for(const p of this.plans.values())if(['prepared','signing'].includes(p.state))p.state='cancelled';}
 async prepare(request,signal){
  if(!this.allowedAssets().some(a=>a.id.toLowerCase()===String(request.asset).toLowerCase()))throw Error('Cet actif n’est pas activé pour les transactions ou ses métadonnées Ledger sont indisponibles.');
  const from=this.source(request.from,request.path),endpoint=endpointUrl(request.endpoint),a=Codec.asset(request.asset),recipient=E.getAddress(request.recipient);
  if(recipient===E.ZeroAddress)throw Error('L’adresse zéro ne peut pas recevoir ce transfert.');
  if([...this.plans.values()].some(p=>p.from===from&&['sending','submitted','unknown'].includes(p.state)))throw Error('Une transaction de cette adresse attend une confirmation. Actualisez son suivi avant un nouvel envoi.');
  const rpc=rpcClient(endpoint,signal,this.fetcher);await this.network(rpc);
  const nonce=await this.pending(rpc,from),native=qty(await rpc('eth_getBalance',[from,'pending']));let balance=native;
  if(a.id!=='ETH'){
   if(data(await rpc('eth_getCode',[a.address,'latest']))==='0x')throw Error('Contrat ERC20 absent.');
   const decimals=Number(ABI.decodeFunctionResult('decimals',data(await rpc('eth_call',[{to:a.address,data:ABI.encodeFunctionData('decimals')},'pending'])))[0]);if(decimals!==a.decimals)throw Error('Décimales ERC20 différentes du descriptif Ledger.');balance=await this.balance(rpc,a,from);
  }
  const recipientCode=data(await rpc('eth_getCode',[recipient,'latest']));if(a.id==='ETH'&&recipientCode!=='0x')throw Error('Cette V2 envoie les ETH vers des adresses simples. Les appels de contrat ne sont pas pris en charge.');
  let units=request.max===true?balance:amountUnits(request.amount,a.decimals);if(units<=0n)throw Error('Solde insuffisant.');
  const latest=await rpc('eth_getBlockByNumber',['latest',false]);if(!latest||latest.baseFeePerGas===undefined)throw Error('Frais EIP-1559 indisponibles.');const baseFee=qty(latest.baseFeePerGas);let priority;
  try{priority=qty(await rpc('eth_maxPriorityFeePerGas'));}catch{signal.throwIfAborted();priority=2000000000n;}
  const maxFee=baseFee*2n+priority;if(maxFee<=0n||maxFee>1000000000000n||priority>50000000000n)throw Error('Frais réseau hors limites de sécurité (1000 Gwei, pourboire 50 Gwei).');
  const tx={type:2,chainId:1,nonce,gasLimit:21000n,maxPriorityFeePerGas:priority,maxFeePerGas:maxFee,to:a.id==='ETH'?recipient:a.address,value:a.id==='ETH'?(request.max===true?1n:units):0n,data:a.id==='ETH'?'0x':ABI.encodeFunctionData('transfer',[recipient,units]),accessList:[]};
  const call=()=>({from,to:tx.to,value:E.toQuantity(tx.value),data:tx.data});
  const estimate=qty(await rpc('eth_estimateGas',[call()]));if(estimate<21000n||estimate>1000000n)throw Error('Estimation du gas hors limites.');tx.gasLimit=estimate===21000n?estimate:(estimate*120n+99n)/100n;if(tx.gasLimit>1000000n)throw Error('Limite de gas trop élevée.');const feeCap=tx.gasLimit*maxFee;if(feeCap>50000000000000000n)throw Error('Plafond de frais supérieur à la limite de sécurité de 0.05 ETH.');
  if(a.id==='ETH'&&request.max===true){units=native-feeCap;if(units<=0n)throw Error('Pas assez d’ETH pour les frais.');}
  if(a.id==='ETH')tx.value=units;else tx.data=ABI.encodeFunctionData('transfer',[recipient,units]);
  if(units>balance||native<feeCap+(a.id==='ETH'?units:0n))throw Error('Solde insuffisant : des ETH sont nécessaires pour les frais.');
  // A transfer that reverts (or returns false) is never offered for signing.
  const simulated=data(await rpc('eth_call',[call(),'pending']));if(a.id!=='ETH'&&simulated!=='0x'&&ABI.decodeFunctionResult('transfer',simulated)[0]!==true)throw Error('Le contrat refuse ce transfert ERC20.');
  const unsigned=E.Transaction.from(tx).unsignedSerialized;
  const p={id:randomUUID(),state:'prepared',createdAt:this.now(),expiresAt:this.now()+300000,endpoint,from,path:request.path,recipient,recipientPath:this.sources.get(recipient)?.values().next().value||null,asset:a.id,units:units.toString(),amount:E.formatUnits(units,a.decimals),symbol:a.symbol,decimals:a.decimals,unsigned,nonce,gasLimit:tx.gasLimit.toString(),maxFeePerGas:maxFee.toString(),maxPriorityFeePerGas:priority.toString(),feeCapWei:feeCap.toString(),estimatedFeeWei:(tx.gasLimit*(baseFee+priority)).toString(),balance:E.formatUnits(balance,a.decimals),recipientIsContract:recipientCode!=='0x'};
  Codec.validatePlan(p);for(const old of this.plans.values())if(['prepared','signing'].includes(old.state))old.state='cancelled';if(this.plans.size>100){for(const [id,old] of this.plans)if(!['sending','unknown','submitted'].includes(old.state))this.plans.delete(id);}
  this.plans.set(p.id,p);return this.publicPlan(p);
 }
 publicPlan(p){const {endpoint,state,...safe}=p;return {...safe,state};}
 async revalidate(p,signal){
  if(!this.allowedAssets().some(a=>a.id.toLowerCase()===p.asset.toLowerCase()))throw Error('Cet actif n’est plus activé pour les transactions.');const rpc=rpcClient(p.endpoint,signal,this.fetcher);await this.network(rpc);if(await this.pending(rpc,p.from)!==p.nonce)throw Error('Le nonce a changé. Préparez de nouveau la transaction.');
  const d=Codec.validatePlan(p),native=qty(await rpc('eth_getBalance',[p.from,'pending']));if(native<d.feeCap+d.tx.value)throw Error('Le solde ETH a changé ou ne couvre plus les frais.');if(d.asset.id!=='ETH'&&await this.balance(rpc,d.asset,p.from)<d.units)throw Error('Le solde ERC20 a changé.');
  if(d.asset.id==='ETH'&&data(await rpc('eth_getCode',[d.recipient,'latest']))!=='0x')throw Error('Le destinataire est devenu un contrat. Préparez de nouveau le transfert.');
  const simulated=data(await rpc('eth_call',[{from:p.from,to:d.tx.to,value:E.toQuantity(d.tx.value),data:d.tx.data,gas:E.toQuantity(d.tx.gasLimit)},'pending']));if(d.asset.id!=='ETH'&&simulated!=='0x'&&ABI.decodeFunctionResult('transfer',simulated)[0]!==true)throw Error('Le contrat refuse ce transfert.');
  const block=await rpc('eth_getBlockByNumber',['latest',false]);if(!block||qty(block.baseFeePerGas)>d.tx.maxFeePerGas)throw Error('Les frais réseau ont augmenté. Préparez à nouveau la transaction.');return rpc;
 }
 async start(id,signal){const p=this.plan(id,['prepared']);await this.revalidate(p,signal);this.plan(id,['prepared']);p.state='signing';return this.publicPlan(p);}
 cancel(id){const p=this.plans.get(id);if(p&&['prepared','signing'].includes(p.state))p.state='cancelled';return true;}
 async broadcast(id,serialized,signal){
  const p=this.plan(id,['signing']);const signed=Codec.verifySigned(p,serialized);p.state='validating';let rpc;
  try{rpc=await this.revalidate(p,signal);}catch(e){p.state='cancelled';throw e;}
  if(this.now()>p.expiresAt){p.state='expired';throw Error('Préparation expirée.');}
  p.state='sending';p.hash=signed.hash;
  try{const result=await rpc('eth_sendRawTransaction',[signed.serialized]);if(typeof result!=='string'||result.toLowerCase()!==p.hash.toLowerCase())throw Error('Hash RPC incohérent.');p.state='submitted';return {state:p.state,hash:p.hash};}
  catch{p.state='unknown';return {state:'unknown',hash:p.hash,message:'Réponse réseau incertaine. La transaction peut avoir été diffusée. Vérifiez son hash avant tout nouvel envoi.'};}
 }
 async status(id,signal){
  const p=this.plans.get(id);if(!p?.hash||!['submitted','unknown','confirmed','reverted'].includes(p.state))throw Error('Aucune transaction diffusée à suivre.');const rpc=rpcClient(p.endpoint,signal,this.fetcher);await this.network(rpc);const receipt=await rpc('eth_getTransactionReceipt',[p.hash]);
  if(receipt){if(receipt.transactionHash?.toLowerCase()!==p.hash.toLowerCase())throw Error('Reçu incohérent.');const status=qty(receipt.status);if(status!==0n&&status!==1n)throw Error('Statut de reçu invalide.');p.state=status===1n?'confirmed':'reverted';return {state:p.state,hash:p.hash,block:qty(receipt.blockNumber).toString()};}
  return {state:p.state,hash:p.hash};
 }
}
module.exports={TransferManager,catalog,rpcClient,amountUnits};
