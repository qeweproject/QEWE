const {test}=require('node:test'),assert=require('node:assert/strict'),{readText}=require('../app/network.cjs'),F=require('./transfer-fixture.cjs'),C=require('../app/transfer-codec.js'),D=require('../app/derive.js'),{TransferManager}=require('../app/transfers.cjs');
test('Network bodies are capped before allocation grows, including dishonest/missing Content-Length and invalid UTF8',async()=>{
 let cancelled=false;const body=new ReadableStream({start(c){c.enqueue(new Uint8Array(8));c.enqueue(new Uint8Array(8));},cancel(){cancelled=true;}});
 await assert.rejects(readText({headers:new Headers({'content-length':'1'}),body},10),/volumineuse/);assert(cancelled);
 let read=false;await assert.rejects(readText({headers:new Headers({'content-length':'1000'}),text:async()=>{read=true;return 'small';}},10),/volumineuse/);assert.equal(read,false);
 await assert.rejects(readText(new Response(Uint8Array.of(255)),10));assert.equal(await readText(new Response('éé'),4),'éé');await assert.rejects(readText(new Response('éé'),3),/volumineuse/);
});
test('Malicious RPC fees are rejected before review, and offline imports cannot bypass caps',async()=>{
 for(const [base,priority] of [[1000000000000n,1n],[1n,50000000001n]]){const net=F.network();net.state.base=base;net.state.priority=priority;const m=new TransferManager({fetcher:net.fetcher});m.register(F.source);await assert.rejects(m.prepare(F.request,new AbortController().signal),/limites de sécurité/);assert.equal(net.state.sends.length,0);}
 const net=F.network(),m=new TransferManager({fetcher:net.fetcher});m.register(F.source);const p=await m.prepare(F.request,new AbortController().signal);
 for(const [gas,fee,priority] of [[1000000n,100000000000n,1n],[21000n,1000000000001n,1n],[21000n,100000000000n,50000000001n]]){const tx=F.E.Transaction.from(p.unsigned);tx.gasLimit=gas;tx.maxFeePerGas=fee;tx.maxPriorityFeePerGas=priority;assert.throws(()=>C.inspect(tx.unsignedSerialized,p.asset));}
});
test('Offline software signing accepts only standard BIP39, root xprv and raw keys, never historical PBKDF options',()=>{
 for(const options of [{format:'compat'},{format:'seed'},{format:'bip39',iterations:1},{format:'bip39',extraWord:true},{format:'bip39',expandWords:true}])assert.throws(()=>D.signOffline(F.phrase,'','en',options,{}),e=>e.code==='SIGN_FORMAT');
});
test('RPC protocol errors and oversized streaming responses cannot be used for signing preparation',async()=>{
 const {rpcClient}=require('../app/transfers.cjs');const signal=new AbortController().signal;
 await assert.rejects(rpcClient('https://rpc.example',signal,async()=>new Response(JSON.stringify({jsonrpc:'1.0',id:1,result:'0x1'})))('eth_chainId'),/invalide/);
 let cancelled=false;const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(131073));},cancel(){cancelled=true;}});
 await assert.rejects(rpcClient('https://rpc.example',signal,async()=>({ok:true,body:stream}))('eth_chainId'),/volumineuse/);assert(cancelled);
});
test('External history/price services are opt-in, script CSP remains local and user identity is absent from package metadata',()=>{
 const fs=require('fs'),{JSDOM}=require('jsdom'),p=require('../package.json'),d=new JSDOM(fs.readFileSync('app/index.html','utf8')).window.document;
 assert.equal(d.getElementById('history').checked,true);assert.equal(d.getElementById('usd').checked,true);assert.equal(d.getElementById('discover').checked,true);assert.equal(p.author,'QEWE contributors');assert.equal(p.license,'MIT');assert(d.querySelector('[http-equiv=Content-Security-Policy]').content.includes("connect-src 'none'"));assert.equal(d.getElementById('tips-address').textContent,'0x1B8147Eb5b45Cf7a9569EF23bd8ca42b63867B50');
});

test('Offline mode cannot be unlocked while an offline signing plan is active',async()=>{
 const {OfflineManager,unsignedEnvelope}=require('../app/offline.cjs'),net=F.network(),manager=new TransferManager({fetcher:net.fetcher});manager.register(F.source);const p=await manager.prepare(F.request,new AbortController().signal),offline=new OfflineManager();const view=offline.read(JSON.stringify(unsignedEnvelope(p)));assert.equal(offline.isSigning(),false);offline.start(view.id);assert.equal(offline.isSigning(),true);offline.cancel(view.id);assert.equal(offline.isSigning(),false);
});
