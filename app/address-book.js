/* Public data only: normalize, merge and retain every derivation association. */
(function(root){
  const E=typeof module!=='undefined'?require('ethers'):root.ethers;
  const MODES=['Clé privée · lecture seule', 'Ledger Live / MEW','Ledger Legacy / MEW','Standard / MetaMask / MEW','BIP44 / MetaMask / MEW','MEW personnalisé'];
  function association(r){
    if(!r||typeof r!=='object')throw Error('Association invalide.');
    const path=r.path||'';
    if(typeof path!=='string'||path.length>120||(path&&(!/^m(?:\/\d+'?){1,8}$/.test(path)||path.split('/').slice(1).some(x=>Number(x.replace("'",''))>=2147483648))))throw Error('Chemin invalide.');
    return {mode:MODES.includes(r.mode)?r.mode:'Adresse importée',index:Number.isInteger(r.index)&&r.index>=0&&r.index<10000?r.index:null,path};
  }
  function normalizeRows(rows){
    if(!Array.isArray(rows)||!rows.length||rows.length>40000)throw Error('Liste de 1 à 40000 adresses requise.');
    const book=new Map();
    for(const r of rows){
      if(!r||typeof r.address!=='string'||!/^0x[0-9a-fA-F]{40}$/.test(r.address))throw Error('Adresse invalide.');
      const address=E.getAddress(r.address),primary=association(r);
      if(r.derivations!==undefined&&(!Array.isArray(r.derivations)||r.derivations.length>16))throw Error('Associations invalides.');
      const aliases=[primary,...(r.derivations||[]).map(association)];
      if(!book.has(address))book.set(address,{address,...primary,derivations:[]});
      const row=book.get(address);
      for(const alias of aliases)if(!row.derivations.some(a=>a.mode===alias.mode&&a.index===alias.index&&a.path===alias.path)){
        if(row.derivations.length>=16)throw Error('Trop de chemins associés.');
        row.derivations.push(alias);
      }
    }
    return [...book.values()];
  }
  if(typeof module!=='undefined')module.exports={normalizeRows};else root.AddressBook={normalizeRows};
})(globalThis);
