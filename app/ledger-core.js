/* Ledger Ethereum: public address reads, and explicit transfer signing on device. */
(function(root){
 const E=typeof module!=='undefined'?require('ethers'):root.ethers,B=typeof module!=='undefined'?require('./address-book.js'):root.AddressBook;
 const P=typeof module!=='undefined'?require('./paths.js'):root.WalletPaths;
 const plan=P.plan;
 function encodePath(path){
  const parts=P.indexes(path),data=new Uint8Array(1+4*parts.length);data[0]=parts.length;
  parts.forEach((n,i)=>new DataView(data.buffer).setUint32(1+4*i,n,false));return data;
 }
 async function readAddress(send,path){
  const response=new Uint8Array(await send(0xe0,0x02,0,0,encodePath(path)));
  const keyLength=response[0],addressLength=response[1+keyLength];
  if(keyLength!==65||response[1]!==4||addressLength!==40||response.length!==1+keyLength+1+addressLength+2||response.at(-2)!==0x90||response.at(-1)!==0)throw Error('Réponse Ledger Ethereum invalide.');
  const publicKey=E.hexlify(response.slice(1,66)),ascii=Array.from(response.slice(67,107),b=>String.fromCharCode(b)).join('');
  if(!/^[a-fA-F0-9]{40}$/.test(ascii))throw Error('Adresse Ledger illisible.');
  const address=E.getAddress('0x'+ascii);if(E.computeAddress(publicKey).toLowerCase()!==address.toLowerCase())throw Error('Clé publique et adresse Ledger incohérentes.');return address;
 }
 function explain(error){
  if(error?.name==='LedgerReadTimeout')return 'Le Ledger ne répond pas. Refusez toute demande en attente sur son écran, puis rebranchez-le.';
  if(error?.statusCode===0x6985)return 'Lecture refusée par le Ledger.';
  if(error?.statusCode===0x5515||/locked/i.test(error?.name||''))return 'Déverrouillez le Ledger sur son écran, puis ouvrez Ethereum.';
  if([0x6e00,0x6d00,0x6a80,0x6b00].includes(error?.statusCode))return 'Application Ethereum non ouverte ou chemin refusé par cette version du Ledger. Essayez le chemin standard ou Ledger Live.';
  if(/NotAllowed|NotFound|UserCancelled|UserGesture/.test(error?.name||''))return 'Connexion annulée ou aucun Ledger USB autorisé.';
  if(/Disconnected|DisconnectedDevice|NetworkError/.test(error?.name||''))return 'Ledger débranché. Rebranchez-le, déverrouillez-le et ouvrez Ethereum.';
  return 'Lecture Ledger impossible. Vérifiez le câble USB, ouvrez Ethereum et fermez Ledger Live ou les autres logiciels utilisant le Ledger.';
 }
 async function collect(session,items,options={}){const {signal,onProgress=()=>{}}=options;
  const collected=[];let completed=0;
  try{
   for(let i=0;i<items.length;i++){
    signal?.throwIfAborted();const item=items[i],address=await session.readAddress(item.path);signal?.throwIfAborted();
    for(const alias of item.aliases)collected.push({address,...alias});completed++;onProgress({completed,total:items.length});
   }
   return {rows:B.normalizeRows(collected),completed,total:items.length,complete:true};
  }catch(error){return {rows:collected.length?B.normalizeRows(collected):[],completed,total:items.length,complete:false,stopped:!!signal?.aborted,error:signal?.aborted?'Lecture Ledger arrêtée.':(options.explain||explain)(error)};}
 }
 async function signTransfer(send,request){
  const C=typeof module!=='undefined'?require('./transfer-codec.js'):root.TransferCodec,d=C.validatePlan(request);
  const address=await readAddress(send,request.path);if(address!==d.from)throw Error('Le Ledger connecté ne correspond pas à l’adresse choisie.');
  if(request.recipientPath){const target=request.recipientPath===request.path?address:await readAddress(send,request.recipientPath);if(target!==d.recipient)throw Error('Le destinataire choisi ne correspond pas à cette adresse du Ledger connecté. Aucun envoi.');}
  if(d.asset.id!=='ETH'){
   const blob=E.getBytes('0x'+d.asset.blob);if(blob.length>255)throw Error('Descriptif ERC20 trop long.');
   const accepted=new Uint8Array(await send(0xe0,0x0a,0,0,blob));if(accepted.length!==2||accepted[0]!==0x90||accepted[1]!==0)throw Error('Métadonnées ERC20 refusées par le Ledger.');
  }
  const payload=E.getBytes(E.concat([encodePath(request.path),E.getBytes(request.unsigned)]));if(payload.length>255)throw Error('Transfert trop long pour ce mode de signature.');
  const response=new Uint8Array(await send(0xe0,0x04,0,0,payload));if(response.length!==67||response[65]!==0x90||response[66]!==0)throw Error('Réponse de signature Ledger invalide.');
  let parity=response[0];if(parity===27||parity===28)parity-=27;if(parity!==0&&parity!==1)throw Error('Signature Ethereum invalide.');
  return C.signed(request,{r:E.hexlify(response.slice(1,33)),s:E.hexlify(response.slice(33,65)),yParity:parity});
 }
 const api={plan,encodePath,readAddress,collect,explain,signTransfer};if(typeof module!=='undefined')module.exports=api;else root.LedgerCore=api;
})(globalThis);
