/* Transfer-only codec. No private key, message signing, approval or arbitrary calldata API. */
(function(root){
 const E=typeof module!=='undefined'?require('ethers'):root.ethers;
 const T=typeof module!=='undefined'?require('./vendor/ledger-tokens.json'):root.LedgerTokens;
 const P=typeof module!=='undefined'?require('./paths.js'):root.WalletPaths;
 const abi=new E.Interface(['function transfer(address,uint256) returns(bool)']);
 const asset=id=>{if(id==='ETH')return {id:'ETH',symbol:'ETH',decimals:18};const token=T[E.getAddress(id).toLowerCase()];if(!token)throw Error('Cet ERC20 ne dispose pas de métadonnées Ledger prises en charge.');return {id:token.address,...token};};
 function inspect(unsigned,id){
  if(typeof unsigned!=='string'||unsigned.length>422||!/^0x02[0-9a-f]+$/i.test(unsigned)||E.getBytes(unsigned).length>210)throw Error('Transaction de transfert invalide.');
  const tx=E.Transaction.from(unsigned),a=asset(id);
  if(tx.isSigned()||tx.type!==2||tx.chainId!==1n||!tx.to||!Number.isSafeInteger(tx.nonce)||tx.nonce<0||tx.gasLimit<21000n||tx.gasLimit>1000000n||tx.maxFeePerGas<=0n||tx.maxFeePerGas>1000000000000n||tx.maxPriorityFeePerGas<0n||tx.maxPriorityFeePerGas>50000000000n||tx.gasLimit*tx.maxFeePerGas>50000000000000000n||tx.maxPriorityFeePerGas>tx.maxFeePerGas||tx.accessList?.length||tx.authorizationList?.length||tx.unsignedSerialized.toLowerCase()!==unsigned.toLowerCase())throw Error('Seuls les transferts Ethereum mainnet EIP-1559 sont autorisés.');
  let recipient,units;
  if(a.id==='ETH'){if(tx.data!=='0x')throw Error('Les appels de contrat ETH ne sont pas autorisés.');recipient=tx.to;units=tx.value;}
  else{if(tx.to.toLowerCase()!==a.address.toLowerCase()||tx.value!==0n||E.getBytes(tx.data).length!==68)throw Error('Transfert ERC20 invalide.');const args=abi.decodeFunctionData('transfer',tx.data);recipient=E.getAddress(args[0]);units=args[1];if(abi.encodeFunctionData('transfer',[recipient,units]).toLowerCase()!==tx.data.toLowerCase())throw Error('Appel ERC20 non canonique.');}
  if(recipient===E.ZeroAddress||units<=0n)throw Error('Destinataire et montant positifs requis.');
  return {tx,asset:a,recipient,units,feeCap:tx.gasLimit*tx.maxFeePerGas};
 }
 function validatePlan(plan){
  const from=E.getAddress(plan.from);P.indexes(plan.path);if(plan.recipientPath!==null&&plan.recipientPath!==undefined)P.indexes(plan.recipientPath);const decoded=inspect(plan.unsigned,plan.asset);
  if(E.getAddress(plan.recipient)!==decoded.recipient||String(plan.units)!==decoded.units.toString())throw Error('Récapitulatif et transaction incohérents.');if(plan.feeCapWei!==undefined&&String(plan.feeCapWei)!==decoded.feeCap.toString())throw Error('Plafond de frais incohérent.');return {...decoded,from};
 }
 function signed(plan,signature){
  const d=validatePlan(plan);d.tx.signature=E.Signature.from(signature);
  if(d.tx.from!==d.from)throw Error('Le Ledger connecté ne correspond pas à l’adresse choisie.');return {serialized:d.tx.serialized,hash:d.tx.hash};
 }
 function verifySigned(plan,serialized){
  if(typeof serialized!=='string'||serialized.length>1024)throw Error('Signature invalide.');const tx=E.Transaction.from(serialized);validatePlan(plan);
  if(!tx.isSigned()||tx.unsignedSerialized!==plan.unsigned||tx.from!==E.getAddress(plan.from)||tx.serialized!==serialized)throw Error('La transaction signée diffère du récapitulatif.');return {serialized:tx.serialized,hash:tx.hash};
 }
 const api={asset,inspect,validatePlan,signed,verifySigned};if(typeof module!=='undefined')module.exports=api;else root.TransferCodec=api;
})(globalThis);
