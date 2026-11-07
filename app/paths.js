/* Shared public path definitions for phrase derivation and Ledger address reads. */
(function(root){
 const MODES={
  live:{name:'Ledger Live / MEW',path:i=>`m/44'/60'/${i}'/0/0`},
  legacy:{name:'Ledger Legacy / MEW',path:i=>`m/44'/60'/0'/${i}`},
  standard:{name:'BIP44 / MetaMask / MEW',path:i=>`m/44'/60'/0'/0/${i}`}
 };
 function indexes(path){
  if(typeof path!=='string'||path.length>120||!/^m(?:\/\d+'?){1,8}$/.test(path))throw Error('Chemin invalide : m/… avec 1 à 8 niveaux.');
  return path.split('/').slice(1).map(part=>{const n=Number(part.replace("'",''));if(!Number.isSafeInteger(n)||n<0||n>=2147483648)throw Error('Indice de chemin invalide.');return n+(part.endsWith("'")?2147483648:0);});
 }
 function validateTemplate(custom){
  if(typeof custom!=='string'||!/^m(?:\/(?:\d+'?|\{i\}'?)){1,8}$/.test(custom)||(custom.match(/\{i\}/g)||[]).length!==1)throw Error('Chemin personnalisé invalide : utilisez m/… contenant {i} exactement une fois.');
  indexes(custom.replace('{i}','0'));
 }
 function plan(selected,custom='',limit=25){
  if(!Number.isInteger(limit)||limit<1||limit>10000)throw Error('Choisissez de 1 à 10000 adresses par chemin.');
  if(!Array.isArray(selected)||selected.some(m=>!MODES[m])||(!selected.length&&!custom))throw Error('Sélectionnez au moins un chemin.');
  if(custom)validateTemplate(custom);
  const book=new Map(),add=(mode,index,path)=>{indexes(path);if(!book.has(path))book.set(path,{path,aliases:[]});book.get(path).aliases.push({mode,index,path});};
  for(const name of selected)for(let i=0;i<limit;i++)add(MODES[name].name,i,MODES[name].path(i));
  if(custom)for(let i=0;i<limit;i++)add('MEW personnalisé',i,custom.replace('{i}',String(i)));
  return [...book.values()];
 }
 const api={MODES,indexes,validateTemplate,plan};if(typeof module!=='undefined')module.exports=api;else root.WalletPaths=api;
})(globalThis);
