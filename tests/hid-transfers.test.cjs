const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const Ledger=require('../app/ledger-core.js'),Codec=require('../app/transfer-codec.js'),{TransferManager}=require('../app/transfers.cjs');
const {E,wallet,request,source,network,signature,token}=require('./transfer-fixture.cjs');
test('Actual bundled HID transport carries address, token descriptor and transfer signature APDUs only',async()=>{
 const framing=require('@ledgerhq/hw-transport-webhid/lib/hid-framing').default,listeners=new Map(),commands=[];let assembly,closed=0,plan,refuse=false,hang=false;
 const device={vendorId:0x2c97,productId:4,async open(){},async close(){closed++;},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k),async sendReport(_id,data){
  const packet=Buffer.from(data),channel=packet.readUInt16BE(0),sequence=packet.readUInt16BE(3);if(sequence===0)assembly={length:packet.readUInt16BE(5),parts:[packet.subarray(7)]};else assembly.parts.push(packet.subarray(5));const all=Buffer.concat(assembly.parts);if(all.length<assembly.length)return;const apdu=all.subarray(0,assembly.length),ins=apdu[1];commands.push(Array.from(apdu.subarray(0,4)));assert.equal(apdu[0],224);assert.equal(apdu[2],0);assert.equal(apdu[3],0);let response;
  if(ins===2)response=Buffer.concat([Buffer.from([65]),Buffer.from(E.getBytes(E.SigningKey.computePublicKey(wallet.publicKey,false))),Buffer.from([40]),Buffer.from(wallet.address.slice(2).toLowerCase()),Buffer.from('9000','hex')]);
  else if(ins===10)response=Buffer.from('9000','hex');
  else{assert.equal(ins,4);if(hang){assembly=null;return;}const bytes=apdu.subarray(5),pathLength=1+4*bytes[0];assert.equal(E.hexlify(bytes.subarray(pathLength)),plan.unsigned);const s=signature(plan);response=refuse?Buffer.from('6985','hex'):Buffer.from(E.getBytes(E.concat([new Uint8Array([s.yParity]),s.r,s.s,'0x9000'])));}
  for(const block of framing(channel,64).makeBlocks(response)){const bytes=Uint8Array.from(block);queueMicrotask(()=>listeners.get('inputreport')?.({data:new DataView(bytes.buffer)}));}assembly=null;
 }};
 const c=vm.createContext({navigator:{hid:{requestDevice:async()=>[device],addEventListener(){},removeEventListener(){}}},LedgerCore:Ledger,setTimeout,clearTimeout,TextEncoder,TextDecoder,console});c.window=c;vm.runInContext(fs.readFileSync('app/vendor/ledger-usb.js','utf8'),c);
 const manager=new TransferManager({fetcher:network().fetcher});manager.register(source);
 for(const asset of ['ETH',token.address]){plan=await manager.prepare({...request,asset,amount:'0.1'},new AbortController().signal);const usb=await c.LedgerUsb.connect();const signed=await usb.signTransfer(plan);assert.equal(Codec.verifySigned(plan,signed.serialized).hash,signed.hash);await usb.close();}
 assert.deepEqual(commands.map(c=>c[1]),[2,4,2,10,4]);refuse=true;const usb=await c.LedgerUsb.connect();await assert.rejects(usb.signTransfer(plan),e=>e.statusCode===0x6985);await usb.close();assert.equal(closed,3);refuse=false;hang=true;const controller=new AbortController(),waiting=await c.LedgerUsb.connect(controller.signal);const pending=waiting.signTransfer(plan);setTimeout(()=>controller.abort(),10);await assert.rejects(pending,e=>e.name==='AbortError');await waiting.close();assert.equal(closed,4);
});
