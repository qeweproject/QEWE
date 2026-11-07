'use strict';
const $=id=>document.getElementById(id);
let tablePage=0;const PAGE_SIZE=250;
let rows=[],results={},worker=null,busy=false,scanning=false,block='',done=0,renderTimer=null,pricing=null,ledgerController=null;
function dollars(value){if(value===null||value===undefined)return '—';const cents=(BigInt(value)+500000n)/1000000n;return (cents/100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+','+(cents%100n).toString().padStart(2,'0')+' $';}
function status(text,error=false){for(const id of ['status','generation-status']){const element=$(id);if(element){element.textContent=text;element.className=error?'error':'small';}}}
function controls(){
  window.NewWallet?.controls(busy);
  window.OfflineTransactions?.controls(busy);
  window.Transfers?.controls(busy);
  if($('ledger-read')){$('ledger-read').hidden=!desktop.ledgerAvailable;$('ledger-read').disabled=busy;$('ledger-info').hidden=!desktop.ledgerAvailable;for(const id of ['trezor-read','bitbox-read'])if($(id)){$(id).hidden=!desktop.ledgerAvailable;$(id).disabled=busy;}}
  $('derive').disabled=busy;$('import').disabled=busy;$('addresses').disabled=busy||!rows.length;
  $('copy-all').disabled=busy||!rows.length;
  $('scan').disabled=busy||!rows.length;$('refresh-block').disabled=busy||!rows.length;$('csv').disabled=busy||!done;$('stop').disabled=!busy;$('stop').hidden=!busy;
  $('clear').disabled=busy;
  for(const id of ['phrase','password','language','endpoint','tokens','custom','address-count','recovery-format','pbkdf2-rounds','expand-words','extra-word','keystore-pick','keystore-password'])$(id).disabled=busy;
  document.querySelectorAll('input[name=mode]').forEach(e=>e.disabled=busy);
  document.querySelectorAll('input[name=token],#history,#usd,#discover,#gap,input[name=network],#network-rpcs input').forEach(e=>e.disabled=busy);
}
function scheduleRender(){if(!renderTimer)renderTimer=setTimeout(()=>{renderTimer=null;render();},rows.length>1000?250:80);}
function positive(r){return r&&(BigInt(r.wei||0)>0n||r.tokens.some(t=>BigInt(t.raw||0)>0n)||(r.networks||[]).some(n=>BigInt(n.wei||0)>0n));}
function hasTransactions(r){return !!r&&(BigInt(r.nonce||0)>0n||(r.networks||[]).some(n=>BigInt(n.nonce||0)>0n)||(r.activity?.status==='ok'&&(BigInt(r.activity.transactions)>0n||BigInt(r.activity.tokenTransfers)>0n)));}
function visibleRows(){return rows.filter(row=>{const r=results[row.address];return (!$('positive').checked||positive(r))&&(!$('issues').checked||!r||!['ok','skipped'].includes(r.status))&&(!$('with-tx').checked||hasTransactions(r));});}
async function copyAddresses(addresses,button){
  try{
    const result=await desktop.copyAddresses(addresses);
    if(result.error)throw Error();
    status(`${result.count} adresse${result.count>1?'s':''} publique${result.count>1?'s':''} copiée${result.count>1?'s':''}. ${result.count===1?'Collez avec Ctrl+V dans la recherche Etherscan.':'Une adresse par ligne, à coller dans un fichier texte.'}`);
    if(button?.isConnected){const label=button.dataset.copyLabel||button.textContent;button.dataset.copyLabel=label;button.textContent='Copié !';setTimeout(()=>{if(button.isConnected)button.textContent=label;},1400);}
  }catch{status('La copie a échoué. Sélectionnez le texte de l’adresse puis faites Ctrl+C.',true);}
}
async function openExplorer(address){
  try{const result=await desktop.openExplorer(address);if(result.error)throw Error();status('Etherscan ouvert dans votre navigateur pour cette adresse publique.');}
  catch{status('Impossible d’ouvrir Etherscan. Copiez l’adresse puis collez-la sur etherscan.io.',true);}
}
function pageRows(){return visibleRows().slice(tablePage*PAGE_SIZE,(tablePage+1)*PAGE_SIZE);}
function render(){
  const unique=[...new Set(rows.map(r=>r.address))];
  $('count').textContent=unique.length;
  const values=Object.values(results);
  const valued=values.filter(r=>r.usd?.micros!==null&&r.usd?.micros!==undefined);
  $('usd-total').textContent=valued.length?'≈ '+dollars(valued.reduce((sum,r)=>sum+BigInt(r.usd.micros),0n)):'—';
  $('usd-total-label').textContent='valeur estimée en $ · '+(values.some(r=>r.usd)&&(done<unique.length||values.some(r=>!r.usd||r.usd.partial))?'partielle':'ETH + ERC20');
  $('price-info').textContent=pricing?`Cours indicatifs DefiLlama consultés le ${new Date(pricing.fetchedAt).toLocaleString('fr-FR')} · ${pricing.pricedAssets} actifs cotés.`:'Cours en dollars non consultés.';
  $('total').textContent=values.length?ethers.formatEther(values.reduce((a,r)=>a+BigInt(r.wei||0),0n)):'—';
  $('funded').textContent=values.length?values.filter(positive).length:'—';
  $('checked').textContent=`${done} / ${unique.length}`;
  $('block').textContent=block?`Bloc ${BigInt(block).toString()}`:'';
  $('progress').max=unique.length||100;$('progress').value=done;
  const body=$('rows');body.replaceChildren();
  const filtered=visibleRows(),pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));tablePage=Math.min(tablePage,pages-1);
  const selected=filtered.slice(tablePage*PAGE_SIZE,(tablePage+1)*PAGE_SIZE);$('pagination').hidden=pages===1;$('page-prev').disabled=tablePage===0;$('page-next').disabled=tablePage>=pages-1;$('page-info').textContent=`${tablePage+1} / ${pages} · ${filtered.length}`; 
  $('copy-visible').disabled=!selected.length;
  if(!selected.length){const td=document.createElement('td');td.colSpan=6;td.className='empty';td.textContent=rows.length?'Aucune ligne pour ces filtres.':'Les adresses apparaîtront ici.';const tr=document.createElement('tr');tr.append(td);body.append(tr);}
  for(const row of selected){
    const r=results[row.address],tr=document.createElement('tr');
    const add=(value,cls='')=>{const td=document.createElement('td');td.textContent=value;td.className=cls;tr.append(td);return td;};
    add(row.derivations.map(a=>`${a.mode}${a.index===null?'':` · ${a.index}`}`).join('\n'),'derivation-modes');
    const address=add('','address'),identity=document.createElement('div');identity.className='address-identity';
    if(positive(r)||hasTransactions(r)){const icon=document.createElement('img');icon.className='blockie';icon.src=Blockies.dataUri(row.address);icon.alt='';icon.setAttribute('aria-hidden','true');icon.title='Identicon Blockies · '+row.address;icon.width=32;icon.height=32;identity.append(icon);}
    const value=document.createElement('span');value.className='address-value';value.textContent=row.address;identity.append(value);address.append(identity);
    const code=document.createElement('code');code.textContent=row.derivations.map(a=>a.path).join('\n');address.append(code);
    const actions=document.createElement('div');actions.className='address-actions';
    const copy=document.createElement('button');copy.type='button';copy.className='secondary compact copy-address';copy.textContent='Copier';copy.setAttribute('aria-label','Copier l’adresse '+row.address);copy.addEventListener('click',()=>copyAddresses([row.address],copy));
    const explorer=document.createElement('button');explorer.type='button';explorer.className='secondary compact open-explorer';explorer.textContent='Etherscan ↗';explorer.setAttribute('aria-label','Ouvrir '+row.address+' sur Etherscan');explorer.addEventListener('click',()=>openExplorer(row.address));
    actions.append(copy,explorer);window.Transfers?.attach(actions,row);address.append(actions);
    const eth=add(r?.eth??'—',r?.wei&&BigInt(r.wei)>0n?'good':'');
    if(r?.usd){const usd=document.createElement('strong');usd.className='usd-value';usd.textContent=r.usd.micros!==null?'Compte ≈ '+dollars(r.usd.micros):'Compte : $ inconnu';usd.title=r.usd.missing.join('\n')||'ETH + ERC20 contrôlés, cours indicatifs.';eth.append(usd);if(r.usd.partial){const note=document.createElement('span');note.className='usd-partial';note.textContent='Estimation partielle';eth.append(note);}}
    if(r?.networks?.length){const funded=r.networks.filter(n=>n.status!=='ok'||BigInt(n.wei||0)>0n||BigInt(n.nonce||0)>0n);if(funded.length){const list=document.createElement('div');list.className='network-balances';list.dataset.noI18n='';list.textContent=funded.map(n=>n.status==='ok'?`${n.name}: ${n.balance} ${n.symbol}${BigInt(n.nonce||0)>0n?` · nonce ${n.nonce}`:''}`:`${n.name}: —`).join('\n');list.title=r.networks.map(n=>`${n.name}: ${n.status==='ok'?n.balance+' '+n.symbol:'—'}`).join('\n');eth.append(list);}}
    const tokenCell=add('','token-balances');
    if(!r||r.status==='skipped')tokenCell.textContent='—';
    else if(!r.tokens.length)tokenCell.textContent=r.discovered?.length?'':'Non demandé';
    else{
      const funded=r.tokens.filter(t=>BigInt(t.raw||0)>0n),failed=r.tokens.filter(t=>t.status==='error').length;
      const brief=document.createElement('div');brief.textContent=funded.map(t=>`${t.symbol}: ${t.balance}`).join('\n')||`${r.tokens.length-failed} ERC20 à zéro`;brief.className=funded.length?'good':'';tokenCell.append(brief);
      if(failed){const error=document.createElement('div');error.className='error';error.textContent=`${failed} lecture(s) inconnue(s)`;tokenCell.append(error);}
      const details=document.createElement('details'),summary=document.createElement('summary'),values=document.createElement('div');summary.textContent=`Détail des ${r.tokens.length} tokens`;values.textContent=r.tokens.map(t=>`${t.symbol}: ${t.balance??'ERREUR'}`).join('\n');details.append(summary,values);tokenCell.append(details);
    }
    if(r?.discovered?.length){const found=document.createElement('details'),title=document.createElement('summary'),list=document.createElement('div');found.className='discovered';title.textContent=`${r.discovered.length} tokens/NFT détectés · non vérifiés`;list.dataset.noI18n='';list.textContent=r.discovered.map(t=>`${t.network} · ${t.type} · ${t.symbol}: ${t.balance}\n${t.address}`).join('\n');found.append(title,list);tokenCell.append(found);}
    add(r?`Envois : ${r.nonce??'—'}\nTx indexées : ${r.activity?.transactions??'—'}\nTransferts : ${r.activity?.tokenTransfers??'—'}`:'—','tx-counts');
    add(!r?'Non contrôlé':r.status==='skipped'?'Ignorée · adresses vides':r.status==='ok'?'Vérifié':r.status==='partial'?'Incomplet':'Erreur',r?.status==='ok'?'good':r&&r.status!=='skipped'?'error':'muted');
    body.append(tr);
  }
}
async function reset(){
  worker?.terminate();worker=null;Blockies.clear();window.OfflineTransactions?.reset();window.Transfers?.reset();window.NewWallet?.clear();
  $('derivation-info').textContent='';$('phrase').value='';$('password').value='';$('keystore-password').value='';$('keystore-name').textContent='';$('show').checked=false;$('phrase').type='password';$('words').textContent='0 mot';
  tablePage=0;rows=[];results={};block='';done=0;busy=false;scanning=false;pricing=null;
  await desktop.forget();controls();render();
}
$('phrase').addEventListener('input',()=>{$('words').textContent=`${$('phrase').value.trim().split(/\s+/).filter(Boolean).length} mots`;});
$('phrase').addEventListener('paste',event=>{const text=event.clipboardData?.getData('text/plain');if(text){event.preventDefault();const input=$('phrase');input.setRangeText(text.replace(/[\r\n\t]+/gu,' '),input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));}});
// Security: a pasted seed/passphrase must not linger in the clipboard (Windows clipboard history, sync, other apps).
for(const id of ['phrase','password','keystore-password'])$(id).addEventListener('paste',()=>setTimeout(()=>desktop.clearClipboard?.().catch(()=>{}),0));
$('show').addEventListener('change',()=>{$('phrase').type=$('show').checked?'text':'password';});
window.addEventListener('blur',()=>{$('show').checked=false;$('phrase').type='password';});
$('clear').addEventListener('click',async()=>{await reset();status('Adresses et champs secrets effacés de l’interface.');});
$('copy-all').addEventListener('click',()=>copyAddresses(rows.map(row=>row.address),$('copy-all')));
$('copy-visible').addEventListener('click',()=>copyAddresses(pageRows().map(row=>row.address),$('copy-visible')));
$('derive').addEventListener('click',async()=>{
  const keystore=$('recovery-format').value==='keystore',phrase=$('phrase').value,password=keystore?$('keystore-password').value:$('password').value,language=$('language').value;
  const modes=[...document.querySelectorAll('input[name=mode]:checked')].map(x=>x.value),custom=$('custom').value.trim();
  const limit=Number($('address-count').value);
  const options={format:$('recovery-format').value,iterations:Number($('pbkdf2-rounds').value),expandWords:$('expand-words').checked,extraWord:$('extra-word').checked};
  if(!Number.isInteger(limit)||limit<1||limit>10000){status('Choisissez un nombre entier entre 1 et 10000 adresses par chemin.',true);return;}
  if(!phrase.trim()){status(keystore?'Choisissez d’abord le fichier keystore.':'Saisissez votre phrase ou votre seed.',true);return;}
  if(!['private','keystore'].includes(options.format)&&!modes.length&&!custom){status('Sélectionnez au moins un chemin.',true);return;}
  try {
  await reset();busy=true;controls();status('Génération locale en cours…');
  worker=new Worker('worker.js');
  worker.onmessage=({data})=>{
    if(data.progress){status(`Génération locale : ${data.progress} adresses…`);return;}
    worker?.terminate();worker=null;busy=false;
    if(data.error){status(data.error,true);controls();return;}
    const info=data.info;if(info){$('derivation-info').textContent=[info.format==='bip39'?'BIP39 validé · '+info.language:info.format==='compat'?'PBKDF2 de compatibilité · phrase non validée':info.format==='private'?'Clé privée · lecture seule':info.format==='keystore'?'Fichier keystore JSON · lecture seule':info.format==='xprv'?'Clé racine BIP32 · xprv':'Seed BIP32 hexadécimale',['seed','private','xprv','keystore'].includes(info.format)?'':info.iterations+' itérations',...info.warnings].filter(Boolean).join(' · ');$('derivation-info').className=info.format==='bip39'&&info.iterations===2048?'muted small':'notice small';}
    rows=AddressBook.normalizeRows(data.rows);status(`${rows.length} adresses uniques générées, ${rows.reduce((n,r)=>n+r.derivations.length,0)} chemins associés. Prêt pour l’export ou la vérification.`);controls();render();
  };
  worker.onerror=()=>{worker?.terminate();worker=null;busy=false;controls();status('Impossible de charger le module local de génération. Réinstallez la version 3.1.0. Aucun secret n’a été envoyé.',true);};
  worker.postMessage({phrase,password,language,modes,custom,limit,options});
  }catch(_){worker?.terminate();worker=null;busy=false;controls();status('Impossible de démarrer la génération locale. Fermez puis relancez l’application, ou réinstallez la version 3.1.0.',true);}
});
let bitboxReady;
function loadBitbox(){if(!bitboxReady)bitboxReady=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='vendor/bitbox-usb.js';script.onload=resolve;script.onerror=()=>{bitboxReady=null;script.remove();reject(Error('Module BitBox02 indisponible.'));};document.head.append(script);});return bitboxReady;}
// Hardware wallets. Ledger: addresses + signing. Trezor and BitBox02: public address reads only (experimental).
const DEVICES={
  ledger:{name:'Ledger',connect:signal=>LedgerUsb.connect(signal),explain:e=>LedgerCore.explain(e)},
  trezor:{name:'Trezor',connect:signal=>TrezorUsb.connect(signal),explain:e=>TrezorCore.explain(e)},
  bitbox:{name:'BitBox02',connect:async signal=>{await loadBitbox();signal.throwIfAborted();return BitBoxUsb.connect(signal,showPairing);},explain:e=>{
    if(e?.name==='BitBoxError')return e.message;
    if(/NotFound|NotAllowed|user-abort|abort/i.test(`${e?.name} ${e?.code} ${e?.message}`))return 'Connexion annulée ou aucun appareil autorisé.';
    return 'Lecture BitBox02 impossible. Fermez BitBoxApp, déverrouillez le BitBox02 et réessayez.';}}
};
function showPairing(code){const d=$('pairing-dialog');if(code){$('pairing-code').textContent=code;if(!d.open)d.showModal();}else{$('pairing-code').textContent='';if(d.open)d.close();}}
async function readDevice(kind){
  if(busy)return;const device=DEVICES[kind],ledger=kind==='ledger';
  let session=null,permissionOpened=false;const selected=[...document.querySelectorAll('input[name=mode]:checked')].map(e=>e.value),custom=$('custom').value.trim(),limit=Number($('address-count').value);let items;
  try{items=LedgerCore.plan(selected,custom,limit);}catch(error){status(error.message,true);return;}
  try{
    busy=true;controls();await reset();busy=true;controls();
    status(ledger?'Branchez le Ledger en USB, déverrouillez-le sur son écran et ouvrez Ethereum…':`Branchez le ${device.name} en USB et déverrouillez-le…`);
    if(!await desktop.beginLedger(kind))throw Error('Busy');permissionOpened=true;
    ledgerController=new AbortController();
    session=await device.connect(ledgerController.signal);
    const output=await LedgerCore.collect(session,items,{signal:ledgerController.signal,explain:device.explain,onProgress:({completed,total})=>status(ledger?`Lecture Ledger : ${completed} / ${total} chemins…`:`Lecture du ${device.name} : ${completed} / ${total} chemins…`)});
    rows=output.rows;if(ledger&&rows.length)await window.Transfers?.register(rows);render();
    $('derivation-info').textContent=ledger?'Adresses publiques lues sur le Ledger USB. Seed et clés privées restent sur l’appareil.':`Adresses publiques lues sur le ${device.name}. Lecture seule : les envois passent par un Ledger ou par les transactions hors ligne.`;
    status(output.complete?(ledger?`${rows.length} adresses uniques lues sur le Ledger. Prêt pour l’export ou la vérification des soldes.`:`${rows.length} adresses uniques lues sur le ${device.name}.`):`${output.error} ${rows.length} adresse(s) conservée(s) sur ${output.total} chemins demandés ; lecture incomplète.`,!output.complete);
  }catch(error){status(device.explain(error),true);}
  finally{showPairing(null);try{await session?.close();}catch{}try{if(permissionOpened)await desktop.endLedger();}catch{}ledgerController=null;busy=false;controls();}
}
for(const kind of Object.keys(DEVICES))$(kind+'-read')?.addEventListener('click',()=>readDevice(kind));
$('refresh-block').addEventListener('click',()=>{if(!busy&&rows.length)$('scan').click();});
$('scan').addEventListener('click',async()=>{
  const endpoint=$('endpoint').value.trim(),history=$('history').checked,usd=$('usd').checked,discover=$('discover').checked,gap=Number($('gap').value||0);let tokens,networks;
  if(!Number.isInteger(gap)||gap<0||gap>1000){status('Choisissez un entier entre 0 et 1000 pour l’arrêt sur adresses vides.',true);return;}
  try{
    tokens=[...new Set([...document.querySelectorAll('input[name=token]:checked')].map(e=>e.value).concat($('tokens').value.split(/[\s,;]+/).filter(Boolean)).map(a=>ethers.getAddress(a)))];
    const allowed=value=>{const url=new URL(value);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw Error();return value;};
    allowed(endpoint);
    networks=[...document.querySelectorAll('input[name=network]:checked')].map(e=>({id:e.value,endpoint:allowed($('net-rpc-'+e.value).value.trim()||EvmNetworks.byId(e.value).rpc)}));
    if(tokens.length>50||tokens.some(a=>!/^0x[0-9a-fA-F]{40}$/.test(a)))throw Error();
  }catch{status('RPC HTTPS et contrats Ethereum 0x… valides requis (50 maximum).',true);return;}
  results={};block='';done=0;pricing=null;busy=true;scanning=true;controls();render();status('Vérification du réseau Ethereum et du bloc…');
  try{const response=await desktop.scan({endpoint,rows,tokens,history,usd,networks,discover,gap});if(response.error)throw Error(response.error);}
  catch(error){busy=false;scanning=false;controls();status(error.message,true);}
});
$('stop').addEventListener('click',async()=>{
  if(window.NewWallet?.active){window.NewWallet.cancel();return;}
  if(window.OfflineTransactions?.active){window.OfflineTransactions.cancel();return;}
  if(window.Transfers?.active){await window.Transfers.cancel();return;}
  if(ledgerController){ledgerController.abort();status('Arrêt demandé. Si une confirmation reste affichée, refusez-la sur le Ledger.');}
  else if(worker){worker.terminate();worker=null;busy=false;controls();status('Génération arrêtée.');}
  else{status('Arrêt du contrôle…');await desktop.cancel();}
});
desktop.onScan(message=>{
  if(message.type==='start'){block=message.block;pricing=message.pricing;status(`Contrôle de ${message.unique} adresses uniques au bloc ${BigInt(block)}…`);render();}
  if(message.type==='skipped'){for(const address of message.addresses)results[address]={address,status:'skipped',tokens:[],wei:null,nonce:null};done=message.done;status(`Contrôle en cours : ${done} / ${message.total} adresses.`);scheduleRender();}
  if(message.type==='result'){results[message.result.address]=message.result;done=message.done;status(`Contrôle en cours : ${done} / ${message.total} adresses.`);scheduleRender();}
  if(['complete','failure','cancelled'].includes(message.type)){
    busy=false;scanning=false;controls();render();
    const errors=Object.values(results).filter(r=>!['ok','skipped'].includes(r.status)).length;
    status(message.type==='complete'?`Contrôle terminé : ${done} adresses, ${errors} avec contrôle incomplet. Les totaux portent uniquement sur les valeurs obtenues.`:message.error,message.type!=='complete'||errors>0);
  }
});
for(const id of ['positive','issues','with-tx'])$(id).addEventListener('change',()=>{tablePage=0;render();});
$('page-prev').onclick=()=>{tablePage=Math.max(0,tablePage-1);render();};$('page-next').onclick=()=>{tablePage++;render();};
for(const [id,kind] of [['addresses','addresses'],['csv','csv']])$(id).addEventListener('click',async()=>{
  const result=await desktop.export({kind,rows});if(result.error)status(result.error,true);else if(result.ok)status('Export enregistré : adresses et résultats publics uniquement.');
});
$('import').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async()=>{
  const file=$('file').files[0];if(!file)return;
  try{
    if(file.size>64*1024*1024)throw Error();
    const raw=await file.text();let imported;
    if(file.name.toLowerCase().endsWith('.json')){
      const obj=JSON.parse(raw);
      if(obj.format!=='ethereum-adresses-v1'||obj.network!=='ethereum-mainnet')throw Error();
      imported=obj.rows;
    }else imported=raw.trim().split(/\s+/).map(address=>({address,mode:'Adresse importée',index:null,path:''}));
    imported=AddressBook.normalizeRows(imported);
    await reset();rows=imported;controls();render();status(`${rows.length} adresses publiques importées. Aucun secret nécessaire pour vérifier les soldes.`);
  }catch{status('Import impossible. Utilisez un export JSON de cette application ou un fichier TXT contenant uniquement des adresses 0x… (40000 maximum).',true);}
  finally{$('file').value='';}
});
for(const net of EvmNetworks.NETWORKS){
  const label=document.createElement('label');label.className='check token-choice';label.title=`chainId ${net.chainId} · ${net.symbol}`;
  const input=document.createElement('input');input.type='checkbox';input.name='network';input.value=net.id;
  label.append(input,document.createTextNode(net.name));$('network-choices').append(label);
  const rpc=document.createElement('input');rpc.type='url';rpc.id='net-rpc-'+net.id;rpc.placeholder=net.rpc;rpc.spellcheck=false;rpc.autocomplete='off';rpc.setAttribute('aria-label',net.name+' RPC');
  const row=document.createElement('label');row.className='network-rpc';row.dataset.noI18n='';row.append(document.createTextNode(net.name),rpc);$('network-rpcs').append(row);
}
// Value, history and full token/NFT discovery are on by default for Ethereum. Checking an extra
// network switches them off (many more requests per address); unchecking every network restores them.
// The user can still tick them again by hand.
$('network-choices').addEventListener('change',()=>{
  const any=!!document.querySelector('input[name=network]:checked');
  // Service choices are opt-in and never changed by network selection.
});
const presets=$('token-presets');
for(const token of TokenPresets){
  const label=document.createElement('label');label.className='check token-choice';label.title=token.address;
  const input=document.createElement('input');input.type='checkbox';input.name='token';input.value=token.address;input.checked=true;
  label.append(input,document.createTextNode(token.symbol));presets.append(label);
}
$('address-count').addEventListener('input',()=>{$('range-note').textContent=`Nombre par chemin : ${$('address-count').value||'—'} (25 par défaut). Chaque adresse commune est regroupée sur une seule ligne, avec tous ses chemins.`;});
$('recovery-format').addEventListener('change',()=>{const format=$('recovery-format').value;$('format-help').textContent=format==='compat'?'Attention : PBKDF2 sans validation. Casse et ponctuation conservées, espaces normalisés. Une adresse produite ne prouve pas que la phrase est correcte.':format==='seed'?'Collez la seed BIP32 hexadécimale complète, avec ou sans 0x. Aucun mot, passphrase ou réglage PBKDF2 ne doit être ajouté.':'BIP39 : casse, accents latins, espaces, séparateurs et listes numérotées normalisés. Aucun mot réordonné ou deviné.';});
$('theme').addEventListener('click',()=>{
 const day=document.documentElement.dataset.theme!=='day';document.documentElement.dataset.theme=day?'day':'night';
 const label=day?'Passer en mode nuit':'Passer en mode jour';$('theme').setAttribute('aria-label',label);$('theme').title=label;$('theme').setAttribute('aria-pressed',String(day));
});
controls();

$('recovery-format').addEventListener('change',()=>{const format=$('recovery-format').value,key=['private','xprv'].includes(format);$('phrase').placeholder=format==='private'?'64 caractères hexadécimaux, avec ou sans 0x':format==='xprv'?'xprv…':'12, 15, 18, 21 ou 24 mots';if(key)$('format-help').textContent=format==='private'?'Clé privée brute : une seule adresse, sans dérivation. Lecture seule.':'Clé racine xprv : chemins BIP32 complets. Lecture seule.';keystoreMode();});
// Encrypted JSON keystore: the file content goes into the (hidden) secret field, its password into a dedicated field.
function keystoreMode(){
  const on=$('recovery-format').value==='keystore';
  $('keystore-fields').hidden=!on;$('phrase').hidden=on;document.querySelector('label[for=phrase]').hidden=on;$('show').closest('.inline').hidden=on;
  $('language').closest('div').hidden=on;$('passphrase-options').hidden=on;
  if(on){$('format-help').textContent='Fichier keystore chiffré (MyEtherWallet, Geth, MetaMask, presale) : choisissez le fichier puis saisissez son mot de passe. Une seule adresse, lecture seule.';$('phrase').value='';$('show').checked=false;$('phrase').type='password';}
  else{$('keystore-password').value='';$('keystore-name').textContent='';if($('phrase').value.trim().startsWith('{'))$('phrase').value='';}
}
$('keystore-pick').addEventListener('click',()=>$('keystore-file').click());
$('keystore-file').addEventListener('change',async()=>{
  const file=$('keystore-file').files[0];$('keystore-file').value='';if(!file)return;
  try{if(file.size>8192)throw Error();const text=await file.text();if(!text.trim().startsWith('{'))throw Error();$('phrase').value=text;$('keystore-name').textContent=file.name.slice(0,120);$('keystore-password').focus();}
  catch{$('phrase').value='';$('keystore-name').textContent='';status('Fichier keystore illisible ou trop volumineux.',true);}
});
keystoreMode();

$('copy-tips').addEventListener('click',()=>copyAddresses([$('tips-address').textContent],$('copy-tips')));
