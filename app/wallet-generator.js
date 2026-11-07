/* Fresh BIP39 wallets: OS-backed Web Crypto entropy; no network, persistence or signer. */
(function(root){
 const E=typeof module!=='undefined'?require('ethers'):root.ethers;
 const PATH="m/44'/60'/0'/0/0";
 function fromEntropy(entropy,language='en'){
  if(!(entropy instanceof Uint8Array)||![16,32].includes(entropy.length)||!E.wordlists[language])throw Error('Paramètres BIP39 invalides.');
  const mnemonic=E.Mnemonic.fromEntropy(entropy,'',E.wordlists[language]);
  return {phrase:mnemonic.phrase,language,count:entropy.length===16?12:24,bits:entropy.length*8,path:PATH,address:E.HDNodeWallet.fromMnemonic(mnemonic,PATH).address};
 }
 function create(count=24,language='en'){
  if(![12,24].includes(count)||!E.wordlists[language])throw Error('Choisissez 12 ou 24 mots et une langue BIP39.');
  if(typeof root.crypto?.getRandomValues!=='function')throw Error('Générateur aléatoire sécurisé indisponible. Aucune phrase créée.');
  const entropy=new Uint8Array(count===12?16:32);
  try{root.crypto.getRandomValues(entropy);return fromEntropy(entropy,language);}finally{entropy.fill(0);}
 }
 const api={create,fromEntropy,PATH};if(typeof module!=='undefined')module.exports=api;else root.WalletGenerator=api;
})(globalThis);
