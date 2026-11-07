/* Portable transaction envelopes contain public data and signatures only. */
const E=require('ethers'),{randomUUID}=require('node:crypto'),C=require('./transfer-codec.js');
const {TransferManager}=require('./transfers.cjs'),{endpointUrl}=require('./core.cjs');
const UNSIGNED='qbe-unsigned-v1',SIGNED='qbe-signed-v1';
function keys(value,names){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!==names.slice().sort().join(','))throw Error('Fichier de transaction invalide ou champs inconnus.');}
function unsignedEnvelope(p){C.validatePlan(p);return {format:UNSIGNED,from:E.getAddress(p.from),path:p.path,asset:C.asset(p.asset).id,unsigned:p.unsigned};}
function decode(input){
 keys(input,['format','from','path','asset','unsigned']);if(input.format!==UNSIGNED)throw Error('Format de transaction non signé inconnu.');
 const from=E.getAddress(input.from),d=C.inspect(input.unsigned,input.asset);
 const p={from,path:input.path,asset:d.asset.id,unsigned:input.unsigned,recipient:d.recipient,recipientPath:null,units:d.units.toString(),amount:E.formatUnits(d.units,d.asset.decimals),symbol:d.asset.symbol,decimals:d.asset.decimals,nonce:d.tx.nonce,gasLimit:d.tx.gasLimit.toString(),maxFeePerGas:d.tx.maxFeePerGas.toString(),maxPriorityFeePerGas:d.tx.maxPriorityFeePerGas.toString(),feeCapWei:d.feeCap.toString()};C.validatePlan(p);return p;
}
class OfflineManager{
 constructor(options={}){this.options=options;this.validator=new TransferManager(options);this.plans=new Map();this.attempts=new Map();}
 isSigning(){return [...this.plans.values()].some(p=>p.state==='signing');}
 clear(){for(const p of this.plans.values())if(['review','signing'].includes(p.state))p.state='cancelled';}
 get(id,states){const p=this.plans.get(id);if(!p||!states.includes(p.state))throw Error('Relisez le fichier de transaction.');return p;}
 read(text){
  if(typeof text!=='string'||text.length>8192)throw Error('Fichier JSON de transaction trop volumineux.');let input;try{input=JSON.parse(text);}catch{throw Error('JSON de transaction invalide.');}
  let p;if(input?.format===SIGNED){keys(input,['format','request','serialized','hash']);p=decode(input.request);const signed=C.verifySigned(p,input.serialized);if(input.hash!==signed.hash)throw Error('Hash de transaction incohérent.');p={...p,...signed,kind:'signed'};}else p={...decode(input),kind:'unsigned'};
  p.id=randomUUID();p.state=p.kind==='signed'?(this.attempts.get(p.hash)?.state||'review'):'review';
  if(this.plans.size>=64){for(const [id,v] of this.plans)if(v.state!=='signing')this.plans.delete(id);if(this.plans.size>=64)throw Error('Trop de transactions ouvertes.');}
  this.plans.set(p.id,p);return this.public(p);
 }
 public(p){const {serialized,...rest}=p;return {...rest};}
 async prepare(request,signal){keys(request,['from','path','recipient','asset','amount','endpoint']);const preparer=new TransferManager(this.options);preparer.register([{address:request.from,path:request.path}]);const p=await preparer.prepare({...request,max:false},signal);return this.read(JSON.stringify(unsignedEnvelope(p)));}
 unsigned(id){return unsignedEnvelope(this.get(id,['review','signing','signed']));}
 start(id){const p=this.get(id,['review']);if(p.kind!=='unsigned')throw Error('Fichier non signé requis.');p.state='signing';return this.public(p);}
 complete(id,serialized){const p=this.get(id,['signing']),signed=C.verifySigned(p,serialized);Object.assign(p,signed,{kind:'signed',state:'signed'});return this.public(p);}
 cancel(id){const p=this.plans.get(id);if(p&&['review','signing'].includes(p.state))p.state='cancelled';}
 export(id){const p=this.get(id,['signed','review','submitted','unknown']);if(p.kind!=='signed')throw Error('Signature requise avant cet export.');const verified=C.verifySigned(p,p.serialized);return {format:SIGNED,request:unsignedEnvelope(p),...verified};}
 async broadcast(id,endpoint,signal){
  const p=this.get(id,['review','signed']);if(p.kind!=='signed')throw Error('Transaction signée requise.');C.verifySigned(p,p.serialized);
  if(this.attempts.has(p.hash))throw Error('Diffusion déjà tentée. Vérifiez le hash avant tout nouvel envoi.');
  p.state='validating';let rpc;
  try{rpc=await this.validator.revalidate({...p,endpoint:endpointUrl(endpoint)},signal);}catch(error){p.state='review';throw error;}
  signal.throwIfAborted();if(this.attempts.has(p.hash))throw Error('Diffusion déjà tentée.');p.state='sending';this.attempts.set(p.hash,p);
  try{const hash=await rpc('eth_sendRawTransaction',[p.serialized]);if(hash!==p.hash)throw Error('Hash RPC incohérent.');p.state='submitted';}catch{p.state='unknown';}
  return {state:p.state,hash:p.hash};
 }
}
module.exports={OfflineManager,unsignedEnvelope,decode};
