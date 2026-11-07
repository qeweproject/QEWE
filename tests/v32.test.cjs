const {test}=require('node:test');
const assert=require('node:assert/strict');
const {derive}=require('../app/derive.js');
const P=require('../app/paths.js'),NET=require('../app/networks.js');
const {scan,csv,networkRequests,gapLimit,discoverTokens,used}=require('../app/core.cjs');
const {estimateUsd}=require('../app/pricing.cjs');
const phrase='test test test test test test test test test test test junk';
const signal=()=>new AbortController().signal;
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});

// Fake JSON-RPC per host. `chain` maps host -> {chainId, balances:{address->wei hex}, nonces}.
function fetcher(chain,log=[]){
  return async(url,options)=>{
    const u=new URL(url);log.push(u.host+u.pathname);
    if(u.host.endsWith('blockscout.com')){const net=chain[u.host];return json({items:net?.tokens?.[u.pathname.split('/')[4]]||[]});}
    const net=chain[u.host];if(!net)throw Error('unexpected host '+u.host);
    const b=JSON.parse(options.body);let result;
    if(b.method==='eth_chainId')result='0x'+net.chainId.toString(16);
    else if(b.method==='eth_blockNumber')result='0x10';
    else if(b.method==='eth_getBalance')result=net.balances?.[b.params[0]]||'0x0';
    else if(b.method==='eth_getTransactionCount')result=net.nonces?.[b.params[0]]||'0x0';
    else throw Error('unexpected '+b.method);
    return json({jsonrpc:'2.0',id:b.id,result});
  };
}

test('Historical MEW paths are valid, opt-in and accepted by the address book',()=>{
  for(const id of ['etc','etcLive','etcLedger','testnet','rsk']){assert.equal(P.MODES[id].extra,true);P.indexes(P.MODES[id].path(9));}
  assert.equal(P.MODES.etc.path(2),"m/44'/61'/0'/0/2");assert.equal(P.MODES.etcLedger.path(0),"m/44'/60'/160720'/0/0");
  assert.equal(P.plan(Object.keys(P.MODES),'',3).length,22);
  const rows=derive(phrase,'','en',['etc'],()=>{},'',2);assert.equal(rows.length,2);assert.equal(rows[0].derivations[0].mode,'Ethereum Classic / MEW');
  assert.notEqual(rows[0].address,derive(phrase,'','en',['standard'],()=>{},'',1)[0].address);
});

test('Network and gap inputs are strictly validated',()=>{
  assert.deepEqual(networkRequests(undefined),[]);
  const [base]=networkRequests([{id:'base'}]);assert.equal(base.chainId,8453);assert.equal(base.endpoint,'https://mainnet.base.org/');
  for(const bad of [[{id:'nope'}],[{id:'base'},{id:'base'}],[{id:'base',endpoint:'http://evil.example'}],'x'])assert.throws(()=>networkRequests(bad));
  assert.equal(gapLimit(undefined),0);assert.equal(gapLimit(20),20);for(const bad of [-1,1001,1.5,'20'])assert.throws(()=>gapLimit(bad));
  assert.equal(new Set(NET.NETWORKS.map(n=>n.chainId)).size,NET.NETWORKS.length);
});

test('Extra networks report native balances; a wrong chainId fails only that network',async()=>{
  const [a]=derive(phrase,'','en',['standard'],()=>{},'',1);
  const chain={'ethereum-rpc.publicnode.com':{chainId:1},'mainnet.base.org':{chainId:8453,balances:{[a.address]:'0xde0b6b3a7640000'},nonces:{[a.address]:'0x2'}},'arb1.arbitrum.io':{chainId:1}};
  const events=[];await scan({endpoint:'https://ethereum-rpc.publicnode.com',rows:[a],tokens:[],networks:[{id:'base'},{id:'arbitrum'}]},signal(),e=>events.push(e),fetcher(chain));
  const start=events.find(e=>e.type==='start');assert.deepEqual(start.networks.map(n=>n.status),['ok','error']);
  const r=events.find(e=>e.type==='result').result;
  assert.equal(r.networks[0].balance,'1.0');assert.equal(r.networks[0].nonce,'2');assert.equal(r.networks[1].status,'error');assert.equal(r.status,'partial');
  assert(used(r));
  const usd=estimateUsd(r,{prices:{'coingecko:ethereum':{scaled:(2000n*100000000n).toString()}},source:'t',fetchedAt:'t'});assert.equal(usd.value,'2000.0');assert(usd.partial);
  const out=csv([a],{[a.address]:r},'0x10');assert(out.includes('Base: 1.0 ETH (nonce 2)'));assert(out.includes('Arbitrum One: ERREUR'));
});

test('Gap limit stops each path after N unused indexes and never skips imported addresses',async()=>{
  const rows=derive(phrase,'','en',['standard','legacy'],()=>{},'',30);
  const std=i=>rows.find(r=>r.derivations.some(d=>d.mode==='BIP44 / MetaMask / MEW'&&d.index===i)).address;
  const imported={address:'0x000000000000000000000000000000000000dEaD',mode:'Adresse importée',index:null,path:''};
  const chain={'ethereum-rpc.publicnode.com':{chainId:1,balances:{[std(2)]:'0x1'}}};
  const events=[],log=[];
  await scan({endpoint:'https://ethereum-rpc.publicnode.com',rows:[...rows,imported],tokens:[],gap:3},signal(),e=>events.push(e),fetcher(chain,log));
  const scanned=new Set(events.filter(e=>e.type==='result').map(e=>e.result.address));
  const skipped=new Set(events.filter(e=>e.type==='skipped').flatMap(e=>e.addresses));
  for(let i=0;i<=5;i++)assert(scanned.has(std(i)),'standard '+i);      // used at 2 -> scan up to 2+3
  assert(skipped.has(std(6))&&skipped.has(std(29)));
  const legacy=i=>rows.find(r=>r.derivations.some(d=>d.mode==='Ledger Legacy / MEW'&&d.index===i)).address;
  assert(scanned.has(legacy(2))&&skipped.has(legacy(3)));                   // never used -> 3 indexes
  assert(scanned.has(imported.address));
  assert.equal(scanned.size+skipped.size,rows.length+1);
  assert.equal(events.at(-1).type,'complete');assert.equal(events.filter(e=>e.type!=='start'&&e.done).at(-1).done,rows.length+1);
});

test('Blockscout discovery keeps only well-formed, non-zero, display-safe entries',async()=>{
  const [a]=derive(phrase,'','en',['standard'],()=>{},'',1);
  const items=[
    {token:{address_hash:'0x1111111111111111111111111111111111111111',type:'ERC-20',symbol:'GOOD<script>',name:'Good token',decimals:'6'},value:'2500000'},
    {token:{address_hash:'0x2222222222222222222222222222222222222222',type:'ERC-721',symbol:'NFT'},value:'1'},
    {token:{address_hash:'0x3333333333333333333333333333333333333333',type:'ERC-20',symbol:'ZERO',decimals:'18'},value:'0'},
    {token:{address_hash:'not-an-address',type:'ERC-20'},value:'1'},
    {token:{address_hash:'0x4444444444444444444444444444444444444444',type:'WEIRD'},value:'1'},
  ];
  const found=await discoverTokens('https://eth.blockscout.com',a.address,'ethereum',signal(),async()=>json({items}));
  assert.equal(found.length,2);assert.equal(found[0].symbol,'GOODscript');assert.equal(found[0].balance,'2.5');assert.equal(found[1].type,'ERC-721');
  assert.deepEqual(await discoverTokens('https://eth.blockscout.com',a.address,'ethereum',signal(),async()=>json({},404)),[]);
  await assert.rejects(discoverTokens('https://eth.blockscout.com','secret words','ethereum',signal(),async()=>json({items})));
});

test('Encrypted JSON keystores open with their password, read-only and usable for offline signing',()=>{
  const E=require('ethers'),{signOffline}=require('../app/derive.js'),C=require('../app/transfer-codec.js');
  const w=E.Wallet.fromPhrase(phrase);
  const json=E.encryptKeystoreJsonSync({address:w.address,privateKey:w.privateKey},'correct horse',{scrypt:{N:1024}});
  let info;const rows=derive(json,'correct horse','auto',[],()=>{},'',25,{format:'keystore'},i=>info=i);
  assert.equal(rows.length,1);assert.equal(rows[0].address,w.address);assert.equal(rows[0].derivations[0].mode,'Fichier keystore JSON · lecture seule');assert.equal(info.format,'keystore');
  assert.throws(()=>derive(json,'wrong','auto',[],()=>{},'',25,{format:'keystore'}),e=>e.code==='KEYSTORE_PASSWORD'&&!e.message.includes('correct horse'));
  assert.throws(()=>derive(json,'','auto',[],()=>{},'',25,{format:'keystore'}),e=>e.code==='KEYSTORE_PASSWORD');
  assert.throws(()=>derive('{"not":"a keystore"}','x','auto',[],()=>{},'',25,{format:'keystore'}),e=>e.code==='KEYSTORE_FORMAT');
  assert.throws(()=>derive(json,'correct horse','auto',[],()=>{},'',25,{format:'keystore',extraWord:true}),e=>e.code==='KEY_OPTIONS');
  // Tampered address field must not be trusted.
  const tampered=JSON.stringify({...JSON.parse(json),address:'1111111111111111111111111111111111111111'});
  assert.throws(()=>derive(tampered,'correct horse','auto',[],()=>{},'',25,{format:'keystore'}));
  const unsigned=E.Transaction.from({type:2,chainId:1,nonce:0,gasLimit:21000n,maxFeePerGas:30000000000n,maxPriorityFeePerGas:1000000000n,to:'0x70997970C51812dc3A010C7d01b50e0d17dc79C8',value:1n,data:'0x'}).unsignedSerialized;
  const plan={from:w.address,path:"m/44'/60'/0'/0/0",asset:'ETH',unsigned,recipient:'0x70997970C51812dc3A010C7d01b50e0d17dc79C8',recipientPath:null,units:'1'};
  const signed=signOffline(json,'correct horse','auto',{format:'keystore',iterations:2048},plan);
  assert.equal(C.verifySigned(plan,signed.serialized).hash,signed.hash);
});
