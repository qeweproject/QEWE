const {test}=require('node:test'),assert=require('node:assert/strict'),{TransferManager}=require('../app/transfers.cjs'),Ledger=require('../app/ledger-core.js'),Codec=require('../app/transfer-codec.js'),F=require('./transfer-fixture.cjs');
const master=F.E.HDNodeWallet.fromPhrase(F.phrase,'','m'),targetPath="m/44'/60'/0'/0/1",target=master.derivePath(targetPath);
const addressResponse=node=>F.E.getBytes(F.E.concat([new Uint8Array([65]),F.E.SigningKey.computePublicKey(node.publicKey,false),new Uint8Array([40]),F.E.toUtf8Bytes(node.address.slice(2).toLowerCase()),'0x9000']));
const decode=bytes=>'m/'+Array.from({length:bytes[0]},(_,i)=>{const n=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(1+4*i,false);return n>=0x80000000?(n-0x80000000)+"'":String(n);}).join('/');
test('Known recipient paths are selected by main process and checked on Ledger before any signature',async()=>{
 const net=F.network(),fetcher=async(url,options)=>{const q=JSON.parse(options.body);if(q.method==='eth_getCode'&&q.params[0].toLowerCase()===target.address.toLowerCase())return {ok:true,text:async()=>JSON.stringify({id:q.id,result:'0x'})};return net.fetcher(url,options);};
 const manager=new TransferManager({fetcher});manager.register([...F.source,{address:target.address,path:targetPath,mode:'BIP44 / MetaMask / MEW',index:1}]);
 const plan=await manager.prepare({...F.request,recipient:target.address,recipientPath:'m/123'},new AbortController().signal);assert.equal(plan.recipientPath,targetPath);
 const calls=[];const signature=await Ledger.signTransfer(async(_cla,ins,_p1,_p2,bytes)=>{calls.push(ins);if(ins===2)return addressResponse(master.derivePath(decode(bytes)));assert.equal(ins,4);const s=F.signature(plan);return F.E.getBytes(F.E.concat([new Uint8Array([s.yParity]),s.r,s.s,'0x9000']));},plan);assert.deepEqual(calls,[2,2,4]);assert.equal(Codec.verifySigned(plan,signature.serialized).hash,signature.hash);
 const wrongCalls=[];await assert.rejects(Ledger.signTransfer(async(_cla,ins)=>{wrongCalls.push(ins);return addressResponse(F.wallet);},plan),/destinataire/);assert.deepEqual(wrongCalls,[2,2]);
 const unknown=await manager.prepare({...F.request,recipientPath:targetPath},new AbortController().signal);assert.equal(unknown.recipientPath,null);assert.equal(net.state.sends.length,0);
});
