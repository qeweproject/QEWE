/* No network, file, IPC or storage API. Only an exact, reviewed transfer is signed. */
importScripts('vendor/ethers.umd.min.js','vendor/wordlists-extra.js','address-book.js','paths.js','derive.js','vendor/ledger-tokens.js','transfer-codec.js');
onmessage=({data})=>{
 try{const signed=Derivation.signOffline(data.phrase,data.password,data.language,data.options,data.plan);data.phrase='';data.password='';postMessage({signed});}
 catch(error){postMessage({error:error instanceof Derivation.InputError?error.message:'Signature locale impossible. Vérifiez le format, la clé, la passphrase et le chemin.'});}
 finally{data.phrase='';data.password='';close();}
};
