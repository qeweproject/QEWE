const {test}=require('node:test'),assert=require('node:assert/strict');
const {fetchPrices,estimateUsd}=require('../app/pricing.cjs');
const address='0x000000000000000000000000000000000000dEaD',token='0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
test('USD valuation preserves balances, refuses stale/weak quotes and marks missing prices partial',async()=>{
  const now=Date.now(),snapshot=await fetchPrices([token],new AbortController().signal,async(url,request)=>{
    assert(url.startsWith('https://coins.llama.fi/prices/current/'));assert(!url.includes(address));assert.equal(request.redirect,'error');
    return new Response(JSON.stringify({coins:{'coingecko:ethereum':{price:2000,timestamp:Math.floor(now/1000),confidence:0.99},['ethereum:'+token]:{price:0.99,timestamp:Math.floor(now/1000),confidence:0.99}}}));
  },now);
  const row={wei:'1500000000000000000',tokens:[{address:token,symbol:'USDC',raw:'2500000',decimals:6}]};
  const value=estimateUsd(row,snapshot);assert.equal(value.value,'3002.475');assert.equal(value.partial,false);
  delete snapshot.prices['ethereum:'+token];const partial=estimateUsd(row,snapshot);assert.equal(partial.value,'3000.0');assert.equal(partial.partial,true);
  const weak=await fetchPrices([],new AbortController().signal,async()=>new Response(JSON.stringify({coins:{'coingecko:ethereum':{price:2000,timestamp:Math.floor(now/1000)-86400,confidence:0.99}}})),now);assert.equal(Object.keys(weak.prices).length,0);
  const unknown=estimateUsd({wei:null,tokens:[]},weak);assert.equal(unknown.value,null);assert.equal(unknown.partial,true);
});
