importScripts('vendor/ethers.umd.min.js','vendor/wordlists-extra.js','wallet-generator.js');
onmessage=({data})=>{try{const result=WalletGenerator.create(data.count,data.language);postMessage(result);}catch{postMessage({error:'Création impossible. Le générateur aléatoire sécurisé doit être disponible.'});}finally{close();}};
