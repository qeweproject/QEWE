const {test}=require('node:test'),assert=require('node:assert/strict');const {scan,csv}=require('../app/core.cjs');
test('Balances complete without campaign downloads or claims even when obsolete airdrops parameters are supplied',async()=>{
 const events=[],urls=[],address='0x000000000000000000000000000000000000dEaD';
 await scan({endpoint:'https://example.org/',rows:[{address}],tokens:[],usd:true,history:false,airdrops:true,cacheDir:'/must-not-write'},new AbortController().signal,e=>events.push(e),async(url,options)=>{
  urls.push(url);if(options.method==='GET'){assert(url.startsWith('https://coins.llama.fi/'));return new Response(JSON.stringify({coins:{'coingecko:ethereum':{price:2000,timestamp:Math.floor(Date.now()/1000),confidence:0.99}}}));}
  const r=JSON.parse(options.body);return new Response(JSON.stringify({id:r.id,result:r.method==='eth_chainId'?'0x1':r.method==='eth_blockNumber'?'0x123':'0x0'}));
 });
 assert.deepEqual(events.map(e=>e.type),['start','result','complete']);assert.equal(urls.length,5);const r=events[1].result;assert.equal(r.usd.value,'0.0');assert(!('airdrops' in r));assert(!csv([{address}],{[address]:r},'0x123').includes('airdrops_historiques'));
});
