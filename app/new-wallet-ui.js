/* A generated phrase remains local and read-only. Never registered as a Ledger source. */
(function(){
 const el=id=>document.getElementById(id);let phrase='',language='en',generator=null;
 function clear(){generator?.terminate();generator=null;phrase='';el('new-seed-phrase').value='';el('new-seed-result').hidden=true;el('new-seed-phrase').hidden=true;el('new-seed-show').checked=false;el('new-seed-address').textContent='';}
 for(const option of el('language').options){if(option.value==='auto')continue;const clone=option.cloneNode(true);el('new-seed-language').append(clone);}el('new-seed-language').value='en';
 el('new-seed-create').onclick=async()=>{
  if(busy)return;const count=Number(el('new-seed-count').value),selected=el('new-seed-language').value;
  busy=true;controls();
  try{await reset();busy=true;controls();status('Création locale d’une nouvelle phrase BIP39…');generator=new Worker('new-wallet-worker.js');generator.onmessage=({data})=>{generator?.terminate();generator=null;busy=false;controls();if(data.error){status(data.error,true);return;}phrase=data.phrase;language=data.language;el('new-seed-phrase').value=phrase;el('new-seed-address').textContent=data.address;el('new-seed-path').textContent=data.path;el('new-seed-result').hidden=false;status('Nouvelle phrase créée localement. Notez-la avant de fermer ou de l’effacer.');};generator.onerror=()=>{clear();busy=false;controls();status('Création impossible. Le générateur aléatoire sécurisé doit être disponible.',true);};generator.postMessage({count,language:selected});}
  catch{clear();busy=false;controls();status('Création impossible. Le générateur aléatoire sécurisé doit être disponible.',true);}
 };
 el('new-seed-show').onchange=()=>{el('new-seed-phrase').hidden=!el('new-seed-show').checked;};
 window.addEventListener('blur',()=>{el('new-seed-show').checked=false;el('new-seed-phrase').hidden=true;});
 el('new-seed-select').onclick=()=>{if(!phrase)return;el('new-seed-show').checked=true;el('new-seed-phrase').hidden=false;el('new-seed-phrase').focus();el('new-seed-phrase').select();};
 el('new-seed-use').onclick=()=>{if(!phrase||busy)return;el('phrase').value=phrase;el('password').value='';el('language').value=language;el('recovery-format').value='bip39';el('pbkdf2-rounds').value='2048';el('extra-word').checked=false;el('expand-words').checked=false;el('derive').click();};
 el('new-seed-clear').onclick=()=>{clear();status('Nouvelle phrase effacée de l’interface.');};
 window.NewWallet={clear,cancel(){clear();busy=false;controls();status('Création arrêtée.');},get active(){return !!generator;},controls(value){for(const id of ['new-seed-create','new-seed-count','new-seed-language','new-seed-use','new-seed-clear','new-seed-select'])el(id).disabled=value;}};
})();
