importScripts('vendor/ethers.umd.min.js','vendor/wordlists-extra.js','address-book.js','paths.js','derive.js');
onmessage=({data})=>{
  try {
    let info;const rows=Derivation.derive(data.phrase,data.password,data.language,data.modes,n=>postMessage({progress:n}),data.custom,data.limit??25,data.options??{},value=>info=value);
    data.phrase='';data.password='';
    postMessage({rows,info});
  } catch (error) {
    postMessage({error:error instanceof Derivation.InputError?error.message:'La génération locale a échoué. Vérifiez les paramètres ou réinstallez l’application.',code:error instanceof Derivation.InputError?error.code:'LOCAL_FAILURE'});
  } finally {close();}
};
