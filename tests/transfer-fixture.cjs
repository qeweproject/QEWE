// Published Hardhat test seed only. The production app never imports this fixture.
const E=require('ethers');
const phrase='test test test test test test test test test test test junk',path="m/44'/60'/0'/0/0",wallet=E.HDNodeWallet.fromPhrase(phrase,'',path),recipient='0x000000000000000000000000000000000000dEaD';
const token=require('../app/token-presets.js').find(t=>t.symbol==='USDC');
const abi=new E.Interface(['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)','function transfer(address,uint256) returns(bool)']);
function network(){const state={block:'0x123',chain:1n,nonce:0,latestNonce:0,eth:10n**19n,token:100000000n,base:1000000000n,priority:1000000000n,estimate:65000n,receipt:null,sends:[],calls:[],failSend:false,wrongHash:false,transferFalse:false,recipientCode:'0x',decimals:6};
 const fetcher=async(_url,options)=>{options.signal?.throwIfAborted();const q=JSON.parse(options.body);state.calls.push(q);let result;
 switch(q.method){
 case 'eth_blockNumber':result=state.block;break;
 case 'eth_chainId':result=E.toQuantity(state.chain);break;
 case 'eth_getTransactionCount':result=E.toQuantity(q.params[1]==='pending'?state.nonce:state.latestNonce);break;
 case 'eth_getBalance':result=E.toQuantity(state.eth);break;
 case 'eth_getCode':result=q.params[0].toLowerCase()===recipient.toLowerCase()?state.recipientCode:'0x6000';break;
 case 'eth_getBlockByNumber':result={number:'0x123',baseFeePerGas:E.toQuantity(state.base)};break;
 case 'eth_maxPriorityFeePerGas':result=E.toQuantity(state.priority);break;
 case 'eth_estimateGas':result=q.params[0].data==='0x'?'0x5208':E.toQuantity(state.estimate);break;
 case 'eth_call':{if(q.params[0].data==='0x'){result='0x';break;}const decoded=abi.parseTransaction({data:q.params[0].data});result=abi.encodeFunctionResult(decoded.name,[decoded.name==='balanceOf'?state.token:decoded.name==='decimals'?state.decimals:!state.transferFalse]);break;}
 case 'eth_sendRawTransaction':state.sends.push(q.params[0]);if(state.failSend)throw Error('timeout after submission');result=state.wrongHash?'0x'+'11'.repeat(32):E.keccak256(q.params[0]);break;
 case 'eth_getTransactionReceipt':result=state.receipt;break;
 default:throw Error('Unexpected RPC '+q.method);
 }return {ok:true,text:async()=>JSON.stringify({jsonrpc:'2.0',id:q.id,result})};};return {state,fetcher};}
function signature(plan){return wallet.signingKey.sign(E.keccak256(plan.unsigned));}
const source=[{address:wallet.address,path,mode:'BIP44 / MetaMask / MEW',index:0}];
const request={from:wallet.address,path,recipient,asset:'ETH',amount:'0.5',endpoint:'https://rpc.example.org'};
module.exports={E,phrase,path,wallet,recipient,token,abi,network,signature,source,request};
