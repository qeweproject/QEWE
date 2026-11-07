const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Mnemonic,wordlists,Interface}=require('ethers');
const {derive}=require('../app/derive.js');
const {scan,validateRows,endpointUrl,csv,createRpc,activityCounters}=require('../app/core.cjs');
const phrase='test test test test test test test test test test test junk';
const vectors=require('./public-vectors.json');
let generated;
test('Configurable counts and merged aliases retain different Ledger and standard sequences',()=>{
  const rows=derive(phrase,'','en',['live','legacy','standard'],()=>{},'',3);
  assert.equal(rows.length,8);assert.equal(rows.reduce((n,r)=>n+r.derivations.length,0),9);
  const first=rows.find(r=>r.address===vectors["m/44'/60'/0'/0/0"]);assert.equal(first.derivations.length,2);
  assert(first.derivations.some(a=>a.mode==='BIP44 / MetaMask / MEW'&&a.index===0));
  assert.notEqual(rows.find(r=>r.path==="m/44'/60'/1'/0/0").address,rows.find(r=>r.path==="m/44'/60'/0'/0/1").address);
  for(const count of [0,10001,1.5,NaN])assert.throws(()=>derive(phrase,'','en',['standard'],()=>{},'',count));
  const large=derive(phrase,'','en',['standard'],()=>{},'',1000);assert.equal(large.length,1000);assert.equal(large.at(-1).index,999);assert.equal(validateRows(large).length,1000);
  const out=csv([first],{},'');assert(out.includes('Ledger Live / MEW | BIP44 / MetaMask / MEW'));
});
test('25-token reads are batched; individual reverted balances stay unknown',async()=>{
  const presets=require('../app/token-presets.js');assert.equal(presets.length,25);assert.equal(new Set(presets.map(t=>t.address)).size,25);
  const abi=new Interface(['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)','function symbol() view returns(string)']);
  const multi=new Interface(['function aggregate3(tuple(address target,bool allowFailure,bytes callData)[] calls) payable returns(tuple(bool success,bytes returnData)[])']);
  let batches=0;const events=[];
  const fake=mockRpc(b=>{
    if(b.method==='eth_chainId')return '0x1';if(b.method==='eth_blockNumber')return '0x123';if(b.method==='eth_getBalance'||b.method==='eth_getTransactionCount')return '0x0';
    assert.equal(b.params[0].to,'0xcA11bde05977b3631167028862bE2a173976CA11');
    const calls=multi.decodeFunctionData('aggregate3',b.params[0].data)[0];batches++;
    const results=calls.map(c=>{
      const t=presets.find(t=>t.address.toLowerCase()===c.target.toLowerCase());assert(t);assert.equal(c.allowFailure,true);
      const parsed=abi.parseTransaction({data:c.callData});
      if(parsed.name==='balanceOf')return [t.symbol!=='USDT',t.symbol==='USDT'?'0x':abi.encodeFunctionResult('balanceOf',[123n])];
      return [true,abi.encodeFunctionResult(parsed.name,[parsed.name==='decimals'?t.decimals:t.symbol])];
    });return multi.encodeFunctionResult('aggregate3',[results]);
  });
  await scan({endpoint:'https://example.org',rows:[{address:'0x000000000000000000000000000000000000dEaD'}],tokens:presets.map(t=>t.address)},new AbortController().signal,e=>events.push(e),fake);
  assert.equal(batches,2);const r=events.find(e=>e.type==='result').result;assert.equal(r.tokens.length,25);assert.equal(r.tokens[0].balance,null);assert.equal(r.tokens[1].raw,'123');assert.equal(r.status,'partial');
});
test('Indexed history includes incoming-only and token activity; invalid counts remain errors',async()=>{
  const address='0x000000000000000000000000000000000000dEaD';
  const requests=[];
  const activity=await activityCounters(address,new AbortController().signal,async(url,request)=>{
    requests.push({url,request});return {ok:true,text:async()=>JSON.stringify({transactions_count:'7',token_transfers_count:'2'})};
  });
  assert.equal(activity.transactions,'7');assert.equal(activity.tokenTransfers,'2');assert.equal(activity.status,'ok');
  assert.equal(requests[0].url,'https://eth.blockscout.com/api/v2/addresses/'+address+'/counters');assert.equal(requests[0].request.redirect,'error');
  await assert.rejects(activityCounters(address,new AbortController().signal,async()=>({ok:true,text:async()=>JSON.stringify({transactions_count:null,token_transfers_count:'2'})})));
  const events=[];
  const publicRpc=mockRpc(b=>b.method==='eth_chainId'?'0x1':b.method==='eth_blockNumber'?'0x123':'0x0');
  await scan({endpoint:'https://example.org',rows:[{address}],tokens:[],history:true},new AbortController().signal,e=>events.push(e),async(url,request)=>{
    if(request.method==='GET')throw Error('unavailable');return publicRpc(url,request);
  });
  const result=events.find(e=>e.type==='result').result;assert.equal(result.activity.transactions,null);assert.equal(result.activity.status,'error');assert.equal(result.status,'partial');assert.equal(result.eth,'0.0');
});
test('300 addresses: independent bip_utils vectors, all three modes through index 99',()=>{
  generated=derive(phrase,'','en',['live','legacy','standard'],()=>{},'',100);
  assert.equal(generated.length,299);assert.equal(new Set(generated.map(x=>x.address)).size,299);
  for(const [path,address] of Object.entries(vectors).slice(0,7))assert.equal(generated.find(x=>x.path===path).address,address);
  assert.equal(validateRows(generated).length,299);
});
test('MEW custom path and validation',()=>{
  const rows=derive(phrase,'','en',[],()=>{},"m/44'/60'/1'/0/{i}",100);
  assert.equal(rows.length,100);assert.equal(rows[99].address,vectors["m/44'/60'/1'/0/99"]);
  assert.throws(()=>derive(phrase,'','en',[],()=>{},"m/44'/60'/1'/0/0"));
  assert.throws(()=>derive(phrase,'','en',[],()=>{},"m/2147483648/{i}"));
});
test('BIP39 checksum, French support, exact passphrase distinction',()=>{
  assert.throws(()=>derive('abandon '.repeat(12),'','en',['standard']));
  const french=Mnemonic.fromEntropy('0x00000000000000000000000000000000','',wordlists.fr).phrase;
  assert.equal(derive(french,'','fr',['standard'])[0].address,'0x4B8EF44C122F1256580278729B695D4590A69742');
  assert.notEqual(derive(phrase,' abc ','en',['standard'])[0].address,derive(phrase,'abc','en',['standard'])[0].address);
});
function mockRpc(handler,requests=[]){return async(_url,request)=>{
  const body=JSON.parse(request.body);requests.push(body);
  const result=await handler(body);
  return {ok:true,text:async()=>JSON.stringify({jsonrpc:'2.0',id:body.id,result})};
};}
test('RPC deduplication, block pinning, ERC20 balances and public data only',async()=>{
  const requests=[],events=[],abi=new Interface(['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)','function symbol() view returns(string)']);
  const token='0x0000000000000000000000000000000000000001';
  const mock=mockRpc(body=>{
    if(body.method==='eth_chainId')return '0x1';
    if(body.method==='eth_blockNumber')return '0x123';
    if(body.method==='eth_getBalance')return '0xde0b6b3a7640000';
    if(body.method==='eth_getTransactionCount')return '0x2';
    if(body.method==='eth_call'){
      const selector=body.params[0].data.slice(0,10);
      if(selector===abi.getFunction('decimals').selector)return abi.encodeFunctionResult('decimals',[6]);
      if(selector===abi.getFunction('symbol').selector)return abi.encodeFunctionResult('symbol',['TEST']);
      return abi.encodeFunctionResult('balanceOf',[2000000]);
    }
    throw Error('Unexpected method');
  },requests);
  await scan({endpoint:'https://example.org',rows:[generated[0],generated[0],generated[1]],tokens:[token]},new AbortController().signal,e=>events.push(e),mock);
  const found=events.filter(e=>e.type==='result');assert.equal(found.length,2);
  assert.equal(found[0].result.eth,'1.0');assert.equal(found[0].result.tokens[0].balance,'2.0');assert.equal(found[0].result.nonce,'2');
  assert(requests.filter(r=>['eth_getBalance','eth_getTransactionCount','eth_call'].includes(r.method)).every(r=>r.params[1]==='0x123'));
  assert(!JSON.stringify(requests).includes('test test'));assert.equal(events.at(-1).type,'complete');
});
test('Wrong chain is refused before any balance lookup',async()=>{
  const calls=[];
  await assert.rejects(scan({endpoint:'https://example.org',rows:[generated[0]],tokens:[]},new AbortController().signal,()=>{},mockRpc(()=> '0x89',calls)),/mainnet/);
  assert.deepEqual(calls.map(x=>x.method),['eth_chainId']);
});
test('RPC failure is unknown, never zero; retries stop at three',async()=>{
  let attempts=0;const events=[];
  await scan({endpoint:'https://example.org',rows:[generated[0]],tokens:[]},new AbortController().signal,e=>events.push(e),mockRpc(b=>{
    if(b.method==='eth_chainId')return '0x1';if(b.method==='eth_blockNumber')return '0x123';
    if(b.method==='eth_getBalance'){attempts++;throw Error('unavailable');}return '0x0';
  }));
  const r=events.find(e=>e.type==='result').result;
  assert.equal(attempts,3);assert.equal(r.eth,null);assert.equal(r.wei,null);assert.equal(r.status,'error');
  const out=csv([generated[0]],{[r.address]:r},'0x123');assert(!out.includes('test test'));assert(out.includes('"error"'));
});
test('Endpoint validation, input cap, request cancellation and redirects',async()=>{
  assert.throws(()=>endpointUrl('http://example.org'));assert.throws(()=>endpointUrl('file:///tmp/file'));
  assert.equal(endpointUrl('http://127.0.0.1:8545'),'http://127.0.0.1:8545/');
  assert.throws(()=>validateRows(Array(40001).fill(generated[0])));
  const controller=new AbortController();controller.abort();
  await assert.rejects(createRpc('https://example.org',controller.signal,()=>assert.fail())('eth_chainId'));
  await createRpc('https://example.org',new AbortController().signal,async(_u,r)=>{
    assert.equal(r.redirect,'error');return {ok:true,text:async()=>JSON.stringify({id:JSON.parse(r.body).id,result:'0x1'})};
  })('eth_chainId');
});
