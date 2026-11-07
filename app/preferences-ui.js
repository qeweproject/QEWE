/* Public ERC20 preferences. No wallet, seed or private key is stored. */
(function(){
 if(!desktop.preferences){document.getElementById('manage-tokens').hidden=true;document.getElementById('send-tokens')?.setAttribute('hidden','');return;}
 const el=id=>document.getElementById(id),dialog=el('token-dialog');let state=null,working=false;
 const response=value=>{if(value?.error)throw Error(value.error);return value;};
 function status(value,error=false){el('token-status').textContent=value;el('token-status').className=error?'small error':'small muted';}
 function controls(){for(const b of dialog.querySelectorAll('input,button'))b.disabled=working;if(!working)for(const input of dialog.querySelectorAll('[data-unavailable]'))input.disabled=true;}
 function update(next){state=next;const presets=el('token-presets');presets.replaceChildren();el('token-list').replaceChildren();
  for(const token of next.tokens){
   const label=document.createElement('label');label.className='check token-choice';label.title=token.address;const input=document.createElement('input');input.type='checkbox';input.name='token';input.value=token.address;input.checked=token.scan;label.append(input,document.createTextNode(token.symbol));input.onchange=()=>select(token,'scan',input.checked);presets.append(label);
   const line=document.createElement('div');line.className='token-manager-row';const name=document.createElement('div'),title=document.createElement('span');title.className='token-label';title.textContent=token.symbol;const address=document.createElement('code');address.textContent=token.address;name.append(title,address);line.append(name);
   for(const kind of ['scan','transfer']){const lab=document.createElement('label');lab.className='check';const choice=document.createElement('input');choice.type='checkbox';choice.checked=token[kind];choice.setAttribute('aria-label',(kind==='scan'?'Recherche':'Transaction')+' '+token.symbol);if(kind==='transfer'&&!token.signable){choice.disabled=true;choice.dataset.unavailable='';lab.title='Descriptif Ledger indisponible';}choice.onchange=()=>select(token,kind,choice.checked);lab.append(choice);line.append(lab);}
   const remove=document.createElement('button');remove.type='button';remove.className='quiet compact';remove.textContent=token.default?'·':'×';remove.disabled=token.default;if(token.default)remove.dataset.unavailable='';remove.setAttribute('aria-label','Retirer ce token');remove.onclick=()=>change({action:'remove',address:token.address});line.append(remove);el('token-list').append(line);
  }
  document.dispatchEvent(new Event('token-preferences'));window.I18n?.apply();
 }
 async function change(request){if(working)return;working=true;controls();try{const value=response(await desktop.tokenSettings(request));update(value);status(request.action==='add'?'ERC20 ajouté. Vos choix sont enregistrés.':request.action==='defaults'?'Sélection par défaut rétablie.':'Choix enregistrés.');}catch(error){status(error.message,true);if(state)update(state);}finally{working=false;controls();}}
 const select=(token,kind,enabled)=>change({action:'select',address:token.address,kind,enabled});
 function open(){if(!state)return;status('Vos choix sont enregistrés sur cet ordinateur.');dialog.showModal();}
 el('manage-tokens').onclick=open;el('token-close').onclick=()=>dialog.close();el('token-defaults').onclick=()=>change({action:'defaults'});el('token-add').onclick=async()=>{status('Ajout et vérification du contrat…');await change({action:'add',address:el('token-address').value.trim(),endpoint:el('endpoint').value.trim()});};
 window.TokenPreferences={open};desktop.preferences().then(value=>{update(response(value));window.I18n?.setLang(value.lang,false);}).catch(error=>status(error.message,true));
})();
