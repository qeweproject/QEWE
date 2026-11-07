const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('ethers'),T=require('../app/trezor-core.js');
const hd=E.HDNodeWallet.fromPhrase('test test test test test test test test test test test junk','','m');

// Simulated Trezor speaking Codec v1: decodes host frames, answers with scripted replies.
function device(script){
  const out=[],sent=[];let pending=[];
  const reply=(type,payload)=>out.push(...T.frame(type,payload));
  const str=s=>{const b=new TextEncoder().encode(s);return [...T.varint(b.length),...b];};
  return {sent,io:{
    write:async packet=>{
      assert.equal(packet.length,64);pending.push(packet);
      const msg=await T.receive(async()=>pending.shift()).catch(()=>null);if(!msg)return;pending=[];
      sent.push(msg.type);script(msg,{reply,str});
    },
    read:async()=>{if(!out.length)throw Error('no reply');return out.shift();}
  }};
}
const pathOf=data=>'m/'+T.parse(data)[1].map(n=>{n=Number(n);return n>=0x80000000?(n-0x80000000)+"'":String(n);}).join('/');

test('Codec v1 framing round-trips short and multi-packet messages',async()=>{
  for(const size of [0,10,55,56,57,200]){
    const payload=Uint8Array.from({length:size},(_,i)=>i&255),packets=T.frame(56,payload);
    assert(packets.every(p=>p.length===64&&p[0]===0x3f));
    const got=await T.receive(async()=>packets.shift());assert.equal(got.type,56);assert.deepEqual([...got.data],[...payload]);
  }
  assert.deepEqual([...T.encodeGetAddress("m/44'/60'/0'/0/1")].slice(0,6),[0x08,0xac,0x80,0x80,0x80,0x08]);
});

test('Initialize then public address reads, answering button and on-device passphrase requests',async()=>{
  let asked=0;
  const d=device((msg,{reply,str})=>{
    if(msg.type===T.MSG.Initialize)return reply(T.MSG.Features,Uint8Array.from([0x52,...str('My Trezor')]));
    if(msg.type===T.MSG.EthereumGetAddress){if(asked++===0)return reply(T.MSG.PassphraseRequest,new Uint8Array(0));return reply(T.MSG.ButtonRequest,new Uint8Array(0));}
    if(msg.type===T.MSG.PassphraseAck){assert.deepEqual([...msg.data],[0x18,0x01]);return reply(T.MSG.ButtonRequest,new Uint8Array(0));}
    if(msg.type===T.MSG.ButtonAck)return reply(T.MSG.EthereumAddress,Uint8Array.from([0x12,...str(hd.derivePath("m/44'/60'/0'/0/3").address.toLowerCase())]));
  });
  assert.equal((await T.initialize(d.io)).label,'My Trezor');
  assert.equal(await T.readAddress(d.io,"m/44'/60'/0'/0/3"),hd.derivePath("m/44'/60'/0'/0/3").address);
  assert.deepEqual(d.sent,[T.MSG.Initialize,T.MSG.EthereumGetAddress,T.MSG.PassphraseAck,T.MSG.ButtonAck]);
});

test('Requested path is encoded exactly; failures, Model One PIN matrix and bad addresses are errors',async()=>{
  let seen;const ok=device((msg,{reply,str})=>{seen=pathOf(msg.data);reply(T.MSG.EthereumAddress,Uint8Array.from([0x12,...str(hd.derivePath(seen).address)]));});
  for(const p of ["m/44'/60'/7'/0/0","m/44'/60'/0'/12","m/44'/61'/0'/0/2"]){assert.equal(await T.readAddress(ok.io,p),hd.derivePath(p).address);assert.equal(seen,p);}
  const fail=device((msg,{reply,str})=>reply(T.MSG.Failure,Uint8Array.from([0x08,0x04,0x12,...str('Forbidden key path')])));
  await assert.rejects(T.readAddress(fail.io,"m/44'/60'/0'/0/0"),e=>e.name==='TrezorError'&&e.message==='Forbidden key path'&&T.explain(e).includes('Forbidden'));
  const pin=device((msg,{reply})=>reply(T.MSG.PinMatrixRequest,new Uint8Array(0)));
  await assert.rejects(T.readAddress(pin.io,"m/44'/60'/0'/0/0"),e=>e.code==='PIN_MATRIX');
  const bad=device((msg,{reply,str})=>reply(T.MSG.EthereumAddress,Uint8Array.from([0x12,...str('not an address')])));
  await assert.rejects(T.readAddress(bad.io,"m/44'/60'/0'/0/0"),e=>e.code==='ADDRESS');
  assert.throws(()=>T.encodeGetAddress('m/bad'));
  await assert.rejects(T.receive(async()=>{const p=new Uint8Array(64);p.set([0x3f,0x23,0x23,0,57,0xff,0xff,0xff,0xff]);return p;}),/volumineuse/);
});
