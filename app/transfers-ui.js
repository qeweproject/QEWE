/* Session-only Ledger origin and transfer UI. Public exports never carry spending permission. */
(function(){
 if(!desktop.transfersAvailable)return;
 const el=id=>document.getElementById(id),dialog=el('send-dialog'),sources=new Map(),history=new Map();
 let row=null,quote=null,controller=null,phase='closed',max=false,assets=[],generation=0;
 const response=value=>{if(value?.error)throw Error(value.error);return value;};
 const message=(text,error=false)=>{el('send-status').textContent=text;el('send-status').className=error?'error small':'muted small';};
 const showPart=part=>{for(const p of ['compose','review','result'])el('send-'+p).hidden=p!==part;};
 function lock(value){el('send-tokens').disabled=value;for(const id of ['recipient-search','recipient-select','recipient-use','send-asset','send-path','send-to','send-amount','send-max','send-prepare','send-back','send-sign','send-export-unsigned'])el(id).disabled=value;el('send-close').disabled=phase==='broadcast';}
 function balanceFor(id){const r=results[row.address];if(id==='ETH')return r?.eth??'inconnu';return r?.tokens.find(t=>t.address.toLowerCase()===id.toLowerCase())?.balance??'inconnu';}
 function resetMax(){max=false;el('send-amount').disabled=false;el('send-amount').placeholder='0,00';el('send-max').textContent='Max';}
 function selectedAsset(){const a=assets.find(a=>a.id===el('send-asset').value);el('send-balance').textContent=`Solde observé : ${balanceFor(a.id)} ${a.symbol} · le solde et les frais seront actualisés avant signature.`;resetMax();}
 function recipientState(){
  const value=el('send-to').value.trim(),badge=el('recipient-state');badge.className='recipient-state muted';
  if(!value){badge.textContent='Saisissez une adresse ou choisissez un compte Ledger.';return;}
  let address;try{address=ethers.getAddress(value);}catch{badge.className='recipient-state external';badge.textContent='Adresse Ethereum incomplète ou invalide.';return;}
  if(sources.has(address)){badge.className='recipient-state known';badge.textContent=address===row.address?'Même adresse que l’émetteur · reconnue dans la lecture du Ledger.':'Adresse reconnue dans la lecture du Ledger · revérifiée avant signature.';}
  else{badge.className='recipient-state external';badge.textContent='Adresse non reconnue dans la lecture du Ledger. Elle peut vous appartenir, mais n’a pas été vérifiée ici.';}
 }
 function recipientChoices(){
  const rowByAddress=new Map(rows.map(item=>[item.address,item]));const query=el('recipient-search').value.trim().toLowerCase();el('recipient-select').replaceChildren();let count=0;
  for(const [address,paths] of sources){if(address===row.address)continue;const item=rowByAddress.get(address),text=[address,...paths,...(item?.derivations||[]).map(d=>d.mode+' '+d.index)].join(' ').toLowerCase();if(query&&!text.includes(query))continue;
   const option=document.createElement('option');option.value=address;option.textContent=address+' · '+(results[address]?.eth??'—')+' ETH · '+paths[0];el('recipient-select').append(option);count++;
  }
  el('recipient-select').selectedIndex=-1;el('recipient-count').textContent=`${count} adresses Ledger disponibles.`;
 }
 function useRecipient(){const address=el('recipient-select').value;if(!address)return;el('send-to').value=address;recipientState();el('recipient-accounts').open=false;el('send-amount').focus();}
 el('recipient-select').dataset.noI18n='';el('send-to').addEventListener('input',recipientState);el('recipient-search').addEventListener('input',recipientChoices);el('recipient-select').addEventListener('change',useRecipient);el('recipient-use').onclick=useRecipient;
 function tableLine(label,value){const line=document.createElement('div'),term=document.createElement('dt'),definition=document.createElement('dd');term.textContent=label;definition.textContent=value;line.append(term,definition);el('send-summary').append(line);}
 function summary(p){
  el('send-summary').replaceChildren();tableLine('Réseau','Ethereum mainnet · réseau 1');tableLine('Depuis',p.from);tableLine('Vers',p.recipient);tableLine('Contrôle du destinataire',p.recipientPath?'Adresse du Ledger lu · vérification sur l’appareil avant signature.':'Adresse non reconnue dans la lecture du Ledger. Vérifiez le destinataire.');tableLine('Montant',p.amount+' '+p.symbol);if(p.asset!=='ETH')tableLine('Contrat ERC20',p.asset);
  tableLine('Frais estimés',ethers.formatEther(p.estimatedFeeWei)+' ETH');tableLine('Plafond des frais',ethers.formatEther(p.feeCapWei)+' ETH');tableLine('Débit maximal en ETH',ethers.formatEther(BigInt(p.feeCapWei)+(p.asset==='ETH'?BigInt(p.units):0n))+' ETH');tableLine('Chemin Ledger',p.path);tableLine('Préparation valable jusqu’à',new Date(p.expiresAt).toLocaleTimeString('fr-FR'));
  el('send-contract-note').hidden=!p.recipientIsContract;
 }
 const names={submitted:'Diffusée · en attente de confirmation',unknown:'Diffusion incertaine · vérifiez avant tout nouvel envoi',confirmed:'Confirmée sur Ethereum',reverted:'Échouée sur Ethereum · des frais ont pu être prélevés'};
 function drawHistory(){
  const section=el('transfer-history');section.hidden=!history.size;el('transfer-history-list').replaceChildren();
  for(const [id,item] of [...history].reverse()){
   const card=document.createElement('article');card.className='transfer-card';const title=document.createElement('strong');title.textContent=names[item.state]||item.state;const detail=document.createElement('p');detail.className='small';detail.textContent=item.amount+' '+item.symbol+' → '+item.recipient;
   const hash=document.createElement('code');hash.textContent=item.hash;const actions=document.createElement('div');actions.className='address-actions';
   const explorer=document.createElement('button');explorer.className='secondary compact';explorer.textContent='Voir sur Etherscan ↗';explorer.onclick=()=>desktop.openTransaction(item.hash);
   const refresh=document.createElement('button');refresh.className='secondary compact transfer-refresh';refresh.textContent='Actualiser le suivi';refresh.disabled=busy;refresh.onclick=async()=>{refresh.disabled=true;try{Object.assign(item,response(await desktop.transferStatus({id})));drawHistory();}catch(error){title.textContent=error.message;refresh.disabled=false;}};
   actions.append(explorer,refresh);card.append(title,detail,hash,actions);el('transfer-history-list').append(card);
  }
 }
 async function close(){
  if(phase==='broadcast')return;const pending=phase==='signing'||phase==='preparing';generation++;controller?.abort();await desktop.cancelTransfer({id:quote?.id});quote=null;phase='closed';dialog.close();if(!pending){busy=false;controls();render();}
 }
 async function open(selected){
  if(busy||!sources.has(selected.address))return;
  generation++;row=selected;quote=null;phase='compose';resetMax();el('send-from').textContent=row.address;el('send-to').value='';el('send-amount').value='';el('recipient-search').value='';el('recipient-accounts').open=false;recipientChoices();recipientState();el('send-path').replaceChildren();
  for(const path of sources.get(row.address)){const option=document.createElement('option');option.value=path;option.textContent=path;el('send-path').append(option);}
  el('send-asset').replaceChildren();for(const a of assets){const option=document.createElement('option');option.value=a.id;option.textContent=a.symbol+' · '+balanceFor(a.id);el('send-asset').append(option);}
  const r=results[row.address],funded=r?.tokens.find(t=>BigInt(t.raw||0)>0n&&assets.some(a=>a.id.toLowerCase()===t.address.toLowerCase()));if(!BigInt(r?.wei||0)&&funded)el('send-asset').value=assets.find(a=>a.id.toLowerCase()===funded.address.toLowerCase()).id;
  busy=true;controls();selectedAsset();showPart('compose');message('Choisissez le destinataire et le montant. Le Ledger sera sollicité à l’étape suivante.');lock(false);dialog.showModal();el('send-to').focus();
 }
 el('send-asset').onchange=selectedAsset;
 el('send-max').onclick=()=>{if(max){resetMax();return;}max=true;el('send-amount').value='';el('send-amount').placeholder='Solde disponible calculé à la préparation';el('send-amount').disabled=true;el('send-max').textContent='Montant libre';};
 el('send-close').onclick=close;dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 el('send-back').onclick=async()=>{if(quote)await desktop.cancelTransfer({id:quote.id});quote=null;phase='compose';showPart('compose');lock(false);el('send-amount').disabled=max;message('Modifiez le transfert puis actualisez le récapitulatif.');};
 el('send-prepare').onclick=async()=>{
  if(phase!=='compose')return;const ticket=generation;phase='preparing';lock(true);message('Actualisation des soldes, simulation du transfert et estimation des frais…');
  try{const prepared=response(await desktop.prepareTransfer({from:row.address,path:el('send-path').value,recipient:el('send-to').value.trim(),asset:el('send-asset').value,amount:el('send-amount').value.trim(),max,endpoint:el('endpoint').value.trim()}));if(ticket!==generation||phase==='closed'){await desktop.cancelTransfer({id:prepared.id});return;}quote=prepared;phase='review';summary(quote);showPart('review');lock(false);message('Comparez l’adresse et le montant avec votre intention. Vous les vérifierez ensuite sur le Ledger.');}
  catch(error){if(ticket!==generation||phase==='closed')return;phase='compose';lock(false);el('send-amount').disabled=max;message(error.message,true);}
  finally{if(ticket!==generation&&phase==='closed'){busy=false;controls();render();}}
 };
 el('send-export-unsigned').onclick=async()=>{if(phase!=='review'||!quote)return;lock(true);try{const r=response(await desktop.offlineExport({kind:'unsigned',id:quote.id}));if(r.ok)message('Fichier non signé exporté. Importez-le sur le poste hors ligne.');}catch(e){message(e.message,true);}finally{lock(false);}};
 el('send-sign').onclick=async()=>{
  if(phase!=='review'||!quote)return;const ticket=generation;phase='signing';lock(true);controller=new AbortController();const signal=controller.signal;let usb=null,permission=false;
  try{
   const plan=response(await desktop.startTransfer({id:quote.id}));signal.throwIfAborted();if(!await desktop.beginLedger())throw Error('Le Ledger est déjà utilisé.');permission=true;
   message('Déverrouillez le Ledger, ouvrez Ethereum et vérifiez le destinataire, le montant et les frais sur son écran. Confirmez uniquement si tout correspond.');
   usb=await LedgerUsb.connect(signal);const signed=await usb.signTransfer(plan);signal.throwIfAborted();
   await usb.close();usb=null;await desktop.endLedger();permission=false;signal.throwIfAborted();phase='broadcast';lock(true);message('Signature vérifiée. Diffusion de cette transaction sur Ethereum…');
   const result=response(await desktop.broadcastTransfer({id:plan.id,serialized:signed.serialized}));history.set(plan.id,{...result,amount:plan.amount,symbol:plan.symbol,recipient:plan.recipient});drawHistory();
   phase='result';showPart('result');el('send-result-title').textContent=names[result.state];el('send-result-hash').textContent=result.hash;el('send-result-link').onclick=()=>desktop.openTransaction(result.hash);message(result.message||'La transaction est envoyée. Son suivi reste disponible dans les transactions de cette session.');el('send-close').disabled=false;
  }catch(error){if(quote)await desktop.cancelTransfer({id:quote.id});if(ticket!==generation||phase==='closed')return;phase='compose';quote=null;showPart('compose');lock(false);el('send-amount').disabled=max;message(signal.aborted?'Signature annulée. Aucune diffusion n’a été lancée.':error.statusCode===0x6985?'Transaction refusée sur le Ledger. Aucun envoi.':error.statusCode===0x6a80||error.statusCode===0x6d00?'Transfert refusé par cette version de l’application Ethereum. Mettez-la à jour ; ne validez pas un écran que vous ne comprenez pas.':error.message||'Signature Ledger impossible.',true);}
  finally{try{await usb?.close();}catch{}if(permission)try{await desktop.endLedger();}catch{}controller=null;if(phase==='closed'){busy=false;controls();render();}}
 };
 window.Transfers={
  get active(){return phase!=='closed';},cancel:close,
  reset(){sources.clear();},
  async register(rows){response(await desktop.registerLedger(rows));for(const r of rows)sources.set(r.address,[...new Set(r.derivations.map(a=>a.path).filter(Boolean))]);},
  attach(actions,r){if(!sources.has(r.address))return;const send=document.createElement('button');send.type='button';send.className='compact send-address';send.textContent='Envoyer Tx';send.disabled=busy;send.addEventListener('click',()=>open(r));actions.append(send);},
  controls(value){document.querySelectorAll('.send-address,.transfer-refresh').forEach(button=>button.disabled=value);}
 };
 const updateAssets=()=>desktop.transferAssets().then(value=>{assets=value;if(phase==='compose')refreshAssets();render();});
 function refreshAssets(){const current=el('send-asset').value;el('send-asset').replaceChildren();for(const a of assets){const option=document.createElement('option');option.value=a.id;option.textContent=a.symbol+' · '+balanceFor(a.id);el('send-asset').append(option);}if(assets.some(a=>a.id===current))el('send-asset').value=current;selectedAsset();}
 document.addEventListener('token-preferences',()=>updateAssets().catch(()=>{}));el('send-tokens').onclick=()=>window.TokenPreferences?.open();
 updateAssets().catch(()=>message('Catalogue de transferts indisponible.',true));
})();
