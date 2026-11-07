const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('ethers'),fs=require('node:fs'),vm=require('node:vm');
const {derive}=require('../app/derive.js');
test('Untrusted keystore KDF costs are refused before work or allocation, while normal keystores remain usable',()=>{
 const wallet=E.Wallet.fromPhrase('test test test test test test test test test test test junk');
 const original=JSON.parse(E.encryptKeystoreJsonSync({address:wallet.address,privateKey:wallet.privateKey},'test-only',{scrypt:{N:1024}}));
 for(const params of [{n:2**30},{n:1024,r:2**30},{n:1024,p:2**30},{n:-1},{n:1.5},{n:1023},{dklen:999}]){
  const data=structuredClone(original),crypto=data.crypto||data.Crypto;Object.assign(crypto.kdfparams,params);
  assert.throws(()=>derive(JSON.stringify(data),'test-only','auto',[],()=>{},'',1,{format:'keystore'}),e=>e.code==='KEYSTORE_COST');
 }
 for(const c of [0,-1,2**32]){
  const data=structuredClone(original),crypto=data.crypto||data.Crypto;crypto.kdf='pbkdf2';crypto.kdfparams={c,dklen:32,prf:'hmac-sha256',salt:'00'.repeat(32)};
  assert.throws(()=>derive(JSON.stringify(data),'test-only','auto',[],()=>{},'',1,{format:'keystore'}),e=>e.code==='KEYSTORE_COST');
 }
 assert.equal(derive(JSON.stringify(original),'test-only','auto',[],()=>{},'',1,{format:'keystore'})[0].address,wallet.address);
});
test('Malformed Trezor continuations and truncated protobuf fields are rejected rather than looping',async()=>{
 const T=require('../app/trezor-core.js');
 for(const bytes of [[0],[13,1],[9,1],[10,255,255,255,255,127]])assert.throws(()=>T.parse(Uint8Array.from(bytes)));
 const packets=T.frame(57,new Uint8Array(100));let i=0;
 await assert.rejects(T.receive(async()=>i++===0?packets[0]:Uint8Array.of(0x3f)),/invalide/);
});
function bitboxContext(bitbox,setTimer=setTimeout){
 const context={bitbox,AbortController,console,Promise,setTimeout:setTimer,clearTimeout};
 vm.runInNewContext(fs.readFileSync('scripts/bitbox-usb-entry.js','utf8').replace(/^import .*?;$/m,''),context);return context.BitBoxUsb;
}
test('Cancelled BitBox selection closes a late device without pairing; pairing and reads are bounded',async()=>{
 let resolve,closed=0,paired=0;
 const api=bitboxContext({bitbox02ConnectWebHID:()=>new Promise(r=>resolve=r)}),abort=new AbortController();
 const pending=api.connect(abort.signal);await Promise.resolve();abort.abort();await assert.rejects(pending,e=>e.name==='AbortError');
 resolve({close(){closed++;},unlockAndPair(){paired++;}});await new Promise(r=>setImmediate(r));assert.equal(closed,1);assert.equal(paired,0);
 const codes=[],timeoutApi=bitboxContext({bitbox02ConnectWebHID:async()=>({close(){closed++;},unlockAndPair:async()=>({getPairingCode:()=> 'ABCD',waitConfirm:()=>new Promise(()=>{})})})},fn=>setTimeout(fn,10));
 await assert.rejects(timeoutApi.connect(new AbortController().signal,c=>codes.push(c)),e=>e.name==='AbortError');assert.equal(codes.at(-1),null);assert.equal(closed,2);
 const readings=bitboxContext({bitbox02ConnectWebHID:async()=>({close(){closed++;},unlockAndPair:async()=>({getPairingCode:()=>null,waitConfirm:async()=>({close(){closed++;},ethSupported:()=>true,ethAddress:()=>new Promise(()=>{})})})})},fn=>setTimeout(fn,10));
 const device=await readings.connect(new AbortController().signal);await assert.rejects(device.readAddress("m/44'/60'/0'/0/0"),e=>e.name==='AbortError');assert.equal(closed,3);
});
