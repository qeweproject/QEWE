const {test}=require('node:test'),assert=require('node:assert/strict'),F=require('./transfer-fixture.cjs'),D=require('../app/derive.js'),{OfflineManager,unsignedEnvelope}=require('../app/offline.cjs'),{TransferManager}=require('../app/transfers.cjs'),C=require('../app/transfer-codec.js');
const signal=()=>new AbortController().signal;
async function fixture(asset='ETH'){const net=F.network(),m=new TransferManager({fetcher:net.fetcher});m.register(F.source);const p=await m.prepare({...F.request,asset},signal());return {net,p,bundle:unsignedEnvelope(p)};}
test('Legacy raw keys and root xprv read canonical addresses, never export secrets; reject child xprv, invalid scalars and wrong options',()=>{
 const master=F.E.HDNodeWallet.fromPhrase(F.phrase,'','m');let info;const root=D.derive(master.extendedKey,'','auto',['standard'],()=>{},'',2,{format:'xprv'},v=>info=v);assert.equal(root[0].address,F.wallet.address);assert.equal(info.format,'xprv');
 const direct=D.derive(F.wallet.privateKey,'','auto',[],()=>{},'',100,{format:'private'});assert.equal(direct.length,1);assert.equal(direct[0].address,F.wallet.address);assert(!JSON.stringify(direct).includes(F.wallet.privateKey));
 for(const input of ['00'.repeat(32),'ff'.repeat(32),'bad',master.neuter().extendedKey])assert.throws(()=>D.derive(input,'','auto',[],()=>{},'',1,{format:'private'}),e=>e.code==='PRIVATE_KEY'&&!e.message.includes(input));
 assert.throws(()=>D.derive(F.wallet.extendedKey,'','auto',['standard'],()=>{},'',1,{format:'xprv'}),e=>e.code==='XPRV_ROOT');
 assert.throws(()=>D.derive(F.wallet.privateKey,'secret','auto',[],()=>{},'',1,{format:'private'}),e=>e.code==='KEY_OPTIONS');
});
test('Offline seed, root key and raw key signatures match exactly, bind sender/path and refuse arbitrary contract calls',async()=>{
 const {p}=await fixture(),master=F.E.HDNodeWallet.fromPhrase(F.phrase,'','m');
 for(const [input,format] of [[F.phrase,'bip39'],[master.extendedKey,'xprv'],[F.wallet.privateKey,'private']]){const signed=D.signOffline(input,'','auto',{format},p);assert.equal(C.verifySigned(p,signed.serialized).hash,signed.hash);}
 assert.throws(()=>D.signOffline(F.phrase,'wrong','auto',{format:'bip39'},p),e=>e.code==='WRONG_SIGNER');
 assert.throws(()=>D.signOffline(F.phrase,'','auto',{format:'bip39'},{...p,path:"m/44'/60'/9'/0/0"}),e=>e.code==='WRONG_SIGNER');
 const tx=F.E.Transaction.from(p.unsigned);tx.data='0x095ea7b3';assert.throws(()=>D.signOffline(F.phrase,'','auto',{format:'bip39'},{...p,unsigned:tx.unsignedSerialized}));
});
test('Unsigned and signed files are reconstructed from bytes; offline import/sign/export makes zero requests; tampering is rejected',async()=>{
 const {bundle,p}=await fixture(F.token.address);let requests=0;const offline=new OfflineManager({fetcher:async()=>{requests++;throw Error('NETWORK FORBIDDEN');}});
 const view=offline.read(JSON.stringify(bundle));assert.equal(view.symbol,'USDC');assert.equal(view.amount,p.amount);assert.equal(view.recipient,p.recipient);assert.equal(requests,0);const locked=offline.start(view.id);const signed=D.signOffline(F.phrase,'','auto',{format:'bip39'},locked);offline.complete(view.id,signed.serialized);const exported=offline.export(view.id);assert.equal(requests,0);assert.equal(exported.hash,signed.hash);assert(!JSON.stringify(exported).includes(F.phrase));
 const read=offline.read(JSON.stringify(exported));assert.equal(read.hash,signed.hash);assert.equal(read.kind,'signed');
 for(const bad of [{...bundle,secret:'bad'},{...bundle,path:'m/evil'},{...bundle,unsigned:'0x02'},{...exported,hash:'0x'+'00'.repeat(32)},{...exported,request:{...bundle,from:F.recipient}}])assert.throws(()=>offline.read(JSON.stringify(bad)));
 assert.throws(()=>offline.read(' '.repeat(8193)));offline.cancel(locked.id);assert.throws(()=>offline.start(locked.id));
});
test('Broadcast rechecks current nonce, chain and fees, verifies signatures and never retries an uncertain submission, including reimport',async()=>{
 const {bundle}=await fixture(),net=F.network(),m=new OfflineManager({fetcher:net.fetcher});const p=m.read(JSON.stringify(bundle));m.start(p.id);m.complete(p.id,D.signOffline(F.phrase,'','auto',{format:'bip39'},p).serialized);const saved=m.export(p.id);
 net.state.nonce=net.state.latestNonce=1;await assert.rejects(m.broadcast(p.id,F.request.endpoint,signal()),/nonce/);assert.equal(net.state.sends.length,0);
 net.state.nonce=net.state.latestNonce=0;net.state.chain=2n;await assert.rejects(m.broadcast(p.id,F.request.endpoint,signal()),/mainnet/);net.state.chain=1n;
 net.state.failSend=true;const result=await m.broadcast(p.id,F.request.endpoint,signal());assert.equal(result.state,'unknown');assert.equal(net.state.sends.length,1);await assert.rejects(m.broadcast(p.id,F.request.endpoint,signal()));const reimport=m.read(JSON.stringify(saved));assert.equal(reimport.state,'unknown');await assert.rejects(m.broadcast(reimport.id,F.request.endpoint,signal()));assert.equal(net.state.sends.length,1);
});
