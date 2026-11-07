const {readText}=require('./network.cjs');
const {formatUnits}=require('ethers');
const SCALE=100000000n;
async function fetchPrices(tokens,signal,fetcher=fetch,now=Date.now()){
  const ids=['coingecko:ethereum',...tokens.map(a=>'ethereum:'+a.toLowerCase())];
  const response=await fetcher('https://coins.llama.fi/prices/current/'+ids.join(','),{method:'GET',redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])});
  if(!response.ok)throw Error('Cours indisponibles.');
  const raw=await readText(response,262144);
  const data=JSON.parse(raw);if(!data.coins||typeof data.coins!=='object')throw Error('Cours invalides.');
  const prices={};
  for(const id of ids){
    const value=data.coins[id];if(!value)continue;
    if(typeof value.price!=='number'||!Number.isFinite(value.price)||value.price<=0||value.price>1e12||!Number.isFinite(value.timestamp)||value.timestamp*1000<now-6*3600000||value.timestamp*1000>now+300000||!Number.isFinite(value.confidence)||value.confidence<0.9)continue;
    const scaled=BigInt(Math.round(value.price*Number(SCALE)));if(scaled<=0n)continue;
    prices[id]={scaled:scaled.toString(),price:value.price,timestamp:value.timestamp,confidence:value.confidence};
  }
  return {prices,source:'DefiLlama',fetchedAt:new Date(now).toISOString()};
}
function estimateUsd(result,snapshot){
  let sum=0n,known=0,missing=[];
  const add=(raw,decimals,key,label)=>{
    if(raw===null||raw===undefined){missing.push(label+' : solde inconnu');return;}
    const amount=BigInt(raw);if(amount===0n){known++;return;}
    const quote=snapshot.prices[key];if(!quote){missing.push(label+' : cours absent/périmé');return;}
    sum+=amount*BigInt(quote.scaled)/(10n**BigInt(decimals));known++;
  };
  add(result.wei,18,'coingecko:ethereum','ETH');
  for(const token of result.tokens)add(token.raw,token.decimals??18,'ethereum:'+token.address.toLowerCase(),token.symbol);
  return {micros:known?sum.toString():null,value:known?formatUnits(sum,8):null,partial:missing.length>0,missing,source:snapshot.source,fetchedAt:snapshot.fetchedAt};
}
module.exports={fetchPrices,estimateUsd,SCALE};
