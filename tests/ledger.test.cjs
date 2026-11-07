const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const E=require('ethers'),Ledger=require('../app/ledger-core.js');
const master=E.HDNodeWallet.fromPhrase('test test test test test test test test test test test junk','','m');
function responseFor(derivation){const node=master.derivePath(derivation);return Buffer.concat([Buffer.from([65]),Buffer.from(E.SigningKey.computePublicKey(node.publicKey,false).slice(2),'hex'),Buffer.from([40]),Buffer.from(node.address.slice(2).toLowerCase(),'ascii'),Buffer.from('9000','hex')]);}
test('Ledger reads only E0/02 address APDUs with no chain code and verifies public key/address consistency',async()=>{
 const p="m/44'/60'/0'/0/0",calls=[];const send=async(...args)=>{calls.push(args);return responseFor(p);};
 assert.equal(Buffer.from(Ledger.encodePath(p)).toString('hex'),'058000002c8000003c800000000000000000000000');
 assert.equal(await Ledger.readAddress(send,p,true),master.derivePath(p).address);assert.deepEqual(calls[0].slice(0,4),[0xe0,0x02,0,0]);
 for(const bad of ["m/44'/60'/2147483648","m/1/2/3/4/5/6/7/8/9",'m','secret words'])assert.throws(()=>Ledger.encodePath(bad));
 const bad=responseFor(p);bad[67]=bad[67]===48?49:48;await assert.rejects(Ledger.readAddress(async()=>bad,p));
 await assert.rejects(Ledger.readAddress(async()=>Buffer.concat([responseFor(p),Buffer.alloc(32)]),p));
});
test('Ledger collection reads all shared paths silently, merges aliases and preserves partial/cancelled reads',async()=>{
 const plan=Ledger.plan(['live','legacy','standard'],'',3),calls=[],events=[];assert.equal(plan.length,8);assert.equal(Ledger.plan(['live','legacy','standard']).length,74);
 const session={readAddress:async(p,display)=>{calls.push({p,display});return master.derivePath(p).address;}};
 const r=await Ledger.collect(session,plan);assert.equal(r.rows.length,8);assert.equal(r.rows.reduce((n,x)=>n+x.derivations.length,0),9);assert.equal(r.complete,true);assert.equal(calls.length,8);assert(calls.every(c=>!c.display));
 let n=0;const failed=await Ledger.collect({readAddress:async(p,display)=>{if(++n===4)throw {name:'DisconnectedDevice'};return session.readAddress(p,display);}},plan);assert.equal(failed.complete,false);assert.equal(failed.rows.length,3);assert(failed.error.includes('débranché'));
 const rejected=await Ledger.collect({readAddress:async(p,display)=>{throw {statusCode:0x6985};}},plan);assert.equal(rejected.rows.length,0);assert(rejected.error.includes('refusée'));
 const control=new AbortController();const stopped=await Ledger.collect(session,plan,{signal:control.signal,onProgress:()=>control.abort()});assert.equal(stopped.stopped,true);assert.equal(stopped.rows.length,1);
});
test('Bundled official WebHID transport exchanges address requests with a simulated HID Ledger and closes cleanly',async()=>{
 const hidFraming=require('@ledgerhq/hw-transport-webhid/lib/hid-framing').default;const listeners=new Map(),commands=[];let opened=0,closed=0,assembly=null,respond=true;
 const device={vendorId:0x2c97,productId:0x0004,async open(){opened++;},async close(){closed++;},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k),async sendReport(id,data){
  assert.equal(id,0);if(!respond)return;const packet=Buffer.from(data),channel=packet.readUInt16BE(0),sequence=packet.readUInt16BE(3);assert.equal(packet[2],5);
  if(sequence===0)assembly={length:packet.readUInt16BE(5),parts:[packet.subarray(7)],channel};else assembly.parts.push(packet.subarray(5));
  const all=Buffer.concat(assembly.parts);if(all.length<assembly.length)return;const apdu=all.subarray(0,assembly.length);commands.push(Array.from(apdu.subarray(0,4)));assert.equal(apdu[0],0xe0);assert.equal(apdu[1],2);assert.equal(apdu[3],0);
  const payload=apdu.subarray(5);const indexes=Array.from({length:payload[0]},(_,i)=>payload.readUInt32BE(1+4*i));const derivation='m/'+indexes.map(n=>n>=0x80000000?(n-0x80000000)+"'":String(n)).join('/');
  const blocks=hidFraming(channel,64).makeBlocks(responseFor(derivation));for(const block of blocks){const copied=Uint8Array.from(block);queueMicrotask(()=>listeners.get('inputreport')?.({data:new DataView(copied.buffer)}));}assembly=null;
 }};
 const hid={async requestDevice(options){assert.equal(options.filters[0].vendorId,0x2c97);return [device];},addEventListener(){},removeEventListener(){}};
 const c=vm.createContext({navigator:{hid},LedgerCore:Ledger,setTimeout,clearTimeout,TextEncoder,TextDecoder,console,fetch:()=>assert.fail('No network for Ledger address reads')});c.window=c;
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../app/vendor/ledger-usb.js'),'utf8'),c);
 const connection=await c.LedgerUsb.connect(),p="m/44'/60'/0'/0/0";assert.equal(await connection.readAddress(p,false),master.derivePath(p).address);assert.equal(await connection.readAddress(p,true),master.derivePath(p).address);await connection.close();assert.equal(opened,1);assert.equal(closed,1);assert.deepEqual(commands,[[224,2,0,0],[224,2,0,0]]);
 respond=false;const controller=new AbortController(),pending=await c.LedgerUsb.connect(controller.signal);const reading=pending.readAddress(p,false);setTimeout(()=>controller.abort(),5);await assert.rejects(reading,e=>e.name==='AbortError');await pending.close();assert.equal(closed,2);
});

test('Ledger and phrases produce identical BIP44, Live, Legacy and custom path selections',async()=>{
 const {derive,MODES}=require('../app/derive.js'),P=require('../app/paths.js');assert.equal(MODES,P.MODES);assert(MODES.standard.name.includes('BIP44'));
 for(const custom of ["m/44'/60'/1'/0/{i}","m/44'/0'/0'/0/{i}'","m/0/{i}"]){
  const choices=['live','legacy','standard'],count=4,expected=derive('test test test test test test test test test test test junk','','en',choices,()=>{},custom,count),calls=[];
  const actual=await Ledger.collect({readAddress:async path=>{calls.push(path);return Ledger.readAddress(async(cla,ins,p1,p2,data)=>{assert.deepEqual([cla,ins,p1,p2],[224,2,0,0]);return responseFor(path);},path);}},Ledger.plan(choices,custom,count));
  assert.equal(actual.complete,true);assert.deepEqual(actual.rows,expected);assert.equal(calls.length,new Set(calls).size);
 }
 for(const bad of ["m/2147483648/{i}","m/1/2/3/4/5/6/7/8/{i}","m/1/{i}/{i}","m/1/0"]){assert.throws(()=>Ledger.plan([],bad,2));assert.throws(()=>derive('test test test test test test test test test test test junk','','en',[],()=>{},bad,2));}
});
