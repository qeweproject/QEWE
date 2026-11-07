const {test}=require('node:test'),assert=require('node:assert/strict');
const {TransferManager,catalog,amountUnits}=require('../app/transfers.cjs'),C=require('../app/transfer-codec.js'),Ledger=require('../app/ledger-core.js');
const {E,path,wallet,recipient,token,abi,network,signature,source,request}=require('./transfer-fixture.cjs');
const signal=()=>new AbortController().signal;
function fixture(){const net=network(),manager=new TransferManager({fetcher:net.fetcher});manager.register(source);return {...net,manager};}
function sign(plan){return C.signed(plan,signature(plan)).serialized;}
test('Transfers require session Ledger provenance; prepare ETH with explicit capped fees and Max reserve',async()=>{
 const {manager,state}=fixture();const foreign={...request,from:recipient};await assert.rejects(manager.prepare(foreign,signal()),/réservé/);
 const p=await manager.prepare(request,signal()),d=C.validatePlan(p);assert.equal(p.recipient,recipient);assert.equal(p.units,'500000000000000000');assert.equal(d.tx.chainId,1n);assert.equal(d.tx.data,'0x');assert.equal(p.feeCapWei,'63000000000000');assert.equal(p.endpoint,undefined);assert.equal(state.sends.length,0);
 const max=await manager.prepare({...request,max:true,amount:''},signal());assert.equal(BigInt(max.units)+BigInt(max.feeCapWei),state.eth);assert.throws(()=>manager.plan(p.id));
 manager.clear();await assert.rejects(manager.prepare(request,signal()),/réservé/);assert.throws(()=>manager.plan(max.id));
 for(const value of ['0','-1','1e10','1.1.1','1,000,000'])assert.throws(()=>amountUnits(value,18));assert.equal(amountUnits('1,25',6),1250000n);
});
test('ERC20 transfers use Ledger signed metadata, exact decimals, simulation and ETH fee reserve',async()=>{
 const {manager,state}=fixture();const p=await manager.prepare({...request,asset:token.address,amount:'12,345678'},signal());const d=C.validatePlan(p);assert.equal(d.tx.to,E.getAddress(token.address));assert.equal(d.tx.value,0n);assert.equal(d.units,12345678n);assert.equal(d.asset.decimals,6);assert.equal(d.recipient,recipient);assert.equal(catalog().length,20);
 state.decimals=18;await assert.rejects(manager.prepare({...request,asset:token.address,amount:'1'},signal()),/Décimales/);state.decimals=6;state.transferFalse=true;await assert.rejects(manager.prepare({...request,asset:token.address,amount:'1'},signal()),/refuse/);state.transferFalse=false;state.eth=0n;await assert.rejects(manager.prepare({...request,asset:token.address,amount:'1'},signal()),/insuffisant/);
});
test('Wrong chain, pending nonce, contract ETH destination, unknown token and bad amounts are rejected',async()=>{
 const {manager,state}=fixture();state.chain=137n;await assert.rejects(manager.prepare(request,signal()),/mainnet/);state.chain=1n;state.nonce=1;await assert.rejects(manager.prepare(request,signal()),/attente/);state.nonce=0;state.recipientCode='0x6000';await assert.rejects(manager.prepare(request,signal()),/contrat/);state.recipientCode='0x';
 await assert.rejects(manager.prepare({...request,asset:recipient},signal()),/métadonnées/);await assert.rejects(manager.prepare({...request,recipient:E.ZeroAddress},signal()),/zéro/);await assert.rejects(manager.prepare({...request,amount:'999999'},signal()),/insuffisant/);
});
test('Only exact signed reviewed payload is broadcast once; wrong signer, recipient and unsigned payload fail',async()=>{
 const {manager,state}=fixture();const p=await manager.prepare(request,signal());await assert.rejects(manager.broadcast(p.id,sign(p),signal()),/indisponible/);await manager.start(p.id,signal());
 const changed=E.Transaction.from(p.unsigned);changed.to=wallet.address;changed.signature=wallet.signingKey.sign(changed.unsignedHash);await assert.rejects(manager.broadcast(p.id,changed.serialized,signal()),/diffère/);
 const other=E.Wallet.createRandom();const tx=E.Transaction.from(p.unsigned);tx.signature=other.signingKey.sign(tx.unsignedHash);await assert.rejects(manager.broadcast(p.id,tx.serialized,signal()),/diffère/);
 const result=await manager.broadcast(p.id,sign(p),signal());assert.equal(result.state,'submitted');assert.equal(state.sends.length,1);assert.equal(result.hash,E.keccak256(state.sends[0]));await assert.rejects(manager.broadcast(p.id,sign(p),signal()),/indisponible/);await assert.rejects(manager.prepare(request,signal()),/attend/);
 state.receipt={transactionHash:result.hash,status:'0x1',blockNumber:'0x124'};assert.equal((await manager.status(p.id,signal())).state,'confirmed');
});
test('Changed balances, nonce, expired fees and cancellation prevent sending; ambiguous RPC is never retried',async()=>{
 const {manager,state}=fixture();const p=await manager.prepare(request,signal());await manager.start(p.id,signal());state.eth=0n;await assert.rejects(manager.broadcast(p.id,sign(p),signal()),/solde/);assert.equal(state.sends.length,0);state.eth=10n**19n;
 const q=await manager.prepare(request,signal());state.nonce=1;state.latestNonce=1;await assert.rejects(manager.start(q.id,signal()),/nonce/);state.nonce=0;state.latestNonce=0;manager.cancel(q.id);await assert.rejects(manager.start(q.id,signal()),/indisponible/);
 let now=0;const timed=new TransferManager({fetcher:network().fetcher,now:()=>now});timed.register(source);const expiring=await timed.prepare(request,signal());now=300001;await assert.rejects(timed.start(expiring.id,signal()),/expiré/);
 const uncertain=await manager.prepare(request,signal());await manager.start(uncertain.id,signal());state.failSend=true;const r=await manager.broadcast(uncertain.id,sign(uncertain),signal());assert.equal(r.state,'unknown');assert.equal(state.sends.length,1);await assert.rejects(manager.broadcast(uncertain.id,sign(uncertain),signal()),/indisponible/);assert.equal(state.sends.length,1);await assert.rejects(manager.prepare(request,signal()),/attend/);
});
test('Ledger signs transfer-only payloads after checking the device address and provisioning signed token info',async()=>{
 const {manager}=fixture();for(const asset of ['ETH',token.address]){
  const p=await manager.prepare({...request,asset,amount:'0.1'},signal()),commands=[];
  const send=async(cla,ins,p1,p2,bytes)=>{commands.push({cla,ins,p1,p2,bytes});if(ins===2){const key=E.getBytes(E.SigningKey.computePublicKey(wallet.publicKey,false));return Buffer.concat([Buffer.from([65]),Buffer.from(key),Buffer.from([40]),Buffer.from(wallet.address.slice(2).toLowerCase()),Buffer.from('9000','hex')]);}if(ins===10)return Buffer.from('9000','hex');assert.equal(ins,4);const pathLength=1+4*bytes[0];assert.equal(E.hexlify(bytes.slice(pathLength)),p.unsigned);const sig=signature(p);return E.getBytes(E.concat([new Uint8Array([sig.yParity]),sig.r,sig.s,'0x9000']));};
  const signed=await Ledger.signTransfer(send,p);assert.equal(C.verifySigned(p,signed.serialized).hash,signed.hash);assert.deepEqual(commands.map(c=>c.ins),asset==='ETH'?[2,4]:[2,10,4]);assert(commands.every(c=>c.cla===224&&c.p1===0&&c.p2===0));assert(commands.at(-1).bytes.length<=255);
 }
 const p=await manager.prepare(request,signal());await assert.rejects(Ledger.signTransfer(async()=>Buffer.from('9000','hex'),p));
 const wrong=E.Wallet.createRandom();let signaturesRequested=0;
 await assert.rejects(Ledger.signTransfer(async(_cla,ins)=>{if(ins===4)signaturesRequested++;return E.getBytes(E.concat([new Uint8Array([65]),wrong.signingKey.publicKey,new Uint8Array([40]),E.toUtf8Bytes(wrong.address.slice(2).toLowerCase()),'0x9000']));},p),/correspond/);assert.equal(signaturesRequested,0);
 const erc=await manager.prepare({...request,asset:token.address,amount:'1'},signal());let signCalled=false;
 await assert.rejects(Ledger.signTransfer(async(_cla,ins)=>{if(ins===2)return E.getBytes(E.concat([new Uint8Array([65]),E.SigningKey.computePublicKey(wallet.publicKey,false),new Uint8Array([40]),E.toUtf8Bytes(wallet.address.slice(2).toLowerCase()),'0x9000']));if(ins===10)throw {statusCode:0x6d00};signCalled=true;},erc));assert.equal(signCalled,false);

 for(const method of ['approve','transferFrom']){const a=new E.Interface([method==='approve'?'function approve(address,uint256)':'function transferFrom(address,address,uint256)']);const tx=E.Transaction.from(p.unsigned);tx.to=token.address;tx.value=0;tx.data=a.encodeFunctionData(method,method==='approve'?[recipient,1n]:[wallet.address,recipient,1n]);assert.throws(()=>C.inspect(tx.unsignedSerialized,token.address));}
});
