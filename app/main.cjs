const {app,BrowserWindow,ipcMain,dialog,session,clipboard,shell,Menu}=require('electron');
const path=require('node:path');
const fs=require('node:fs/promises');
const {pathToFileURL,fileURLToPath}=require('node:url');
const {scan,validateRows,endpointUrl,tokenAddresses,csv}=require('./core.cjs');
const {TransferManager,catalog}=require('./transfers.cjs');
const appFetch=(...args)=>{if(offlineOnly)throw Error('Mode hors ligne actif : appels réseau bloqués.');return globalThis.fetch(...args);};
const {OfflineManager,unsignedEnvelope}=require('./offline.cjs');let offlineOnly=false;const offline=new OfflineManager({fetcher:appFetch,allowedAssets:()=>preferences?preferences.catalog():catalog()});
const {Preferences}=require('./preferences.cjs');let preferences;const transfers=new TransferManager({fetcher:appFetch,allowedAssets:()=>preferences?preferences.catalog():catalog()});let transferWork=null,transferWorkKind='';
app.commandLine.appendSwitch('disable-background-networking');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-breakpad');
let win,controller=null,results={},currentRows=[],block='',ledgerAllowed=false;
const entry=pathToFileURL(path.join(__dirname,'index.html')).href;
function trusted(event){if(event.sender!==win?.webContents||event.senderFrame!==win?.webContents.mainFrame||event.senderFrame?.url!==entry)throw Error('Origine refusée.');}
// Security: only one instance may hold Ledger/HID and session secrets.
const singleInstance=app.requestSingleInstanceLock();if(!singleInstance)app.quit();
app.on('second-instance',()=>{if(win&&!win.isDestroyed()){if(win.isMinimized())win.restore();win.focus();}});
// Security: defense in depth for any WebContents (future windows, dialogs, devtools).
app.on('web-contents-created',(_event,contents)=>{contents.setWindowOpenHandler(()=>({action:'deny'}));contents.on('will-navigate',e=>e.preventDefault());contents.on('will-redirect',e=>e.preventDefault());contents.on('will-attach-webview',e=>e.preventDefault());});
// Security: the renderer handles seeds; the main process is the only one allowed to reach the network.
// A compromised renderer (e.g. tampered vendored code) could otherwise smuggle a secret inside an RPC URL.
// Every new RPC URL must therefore be confirmed by the user in a native dialog the renderer cannot drive.
const approvedEndpoints=new Set([endpointUrl('https://ethereum-rpc.publicnode.com')]);let approving=false;
async function approveEndpoint(value){
  const href=endpointUrl(value);if(approvedEndpoints.has(href))return href;
  if(!win||win.isDestroyed())throw Error('Fenêtre indisponible.');
  if(approving)throw Error('Une confirmation de serveur RPC est déjà ouverte.');
  approving=true;
  try{
    const u=new URL(href);
    const {response}=await dialog.showMessageBox(win,{type:'warning',title:'Autoriser ce serveur RPC ?',message:'Autoriser QEWE à contacter ce serveur RPC pendant cette session ?',detail:`Hôte : ${u.host}\n\nURL complète envoyée :\n${href}\n\nElle doit correspondre exactement à l’URL que vous avez saisie. Refusez si elle contient un hôte, des mots ou une longue suite de caractères inattendus.`,buttons:['Refuser','Autoriser'],defaultId:0,cancelId:0,noLink:true});
    if(response!==1)throw Error('Serveur RPC refusé. Aucun appel réseau effectué.');
    approvedEndpoints.add(href);return href;
  }finally{approving=false;}
}
app.whenReady().then(async()=>{
  if(!singleInstance)return;

  preferences=new Preferences(app.getPath('userData'),{fetcher:appFetch});const preferencesReady=preferences.load();
  const isolated=session.fromPartition('ethereum-ephemeral');
  isolated.setPermissionRequestHandler((_w,_p,callback)=>callback(false));
  const ledgerFrame=(contents,details)=>ledgerAllowed&&contents===win?.webContents&&details?.isMainFrame===true&&details?.requestingUrl===entry;
  isolated.setPermissionCheckHandler((contents,permission,_origin,details)=>permission==='hid'&&ledgerFrame(contents,details));
  isolated.on('select-hid-device',async(event,details,callback)=>{
    event.preventDefault();
    if(!ledgerAllowed||details.frame!==win?.webContents.mainFrame||details.frame?.url!==entry)return callback();
    const devices=details.deviceList.filter(d=>d.vendorId===0x2c97);
    if(devices.length===1)return callback(devices[0].deviceId);
    if(!devices.length)return callback();
    try{const selection=await dialog.showMessageBox(win,{type:'question',title:'Choisir le Ledger USB',message:'Quel Ledger souhaitez-vous lire ?',buttons:[...devices.map(d=>(d.productName||'Ledger USB').slice(0,80)),'Annuler'],cancelId:devices.length,noLink:true});callback(ledgerAllowed?devices[selection.response]?.deviceId:undefined);}catch{callback();}
  });
  isolated.webRequest.onBeforeRequest((details,callback)=>{let allowed=false;try{const u=new URL(details.url),relative=path.relative(__dirname,fileURLToPath(u));allowed=u.protocol==='file:'&&!u.host&&!u.search&&!u.hash&&!/%(?:2f|5c)/i.test(u.pathname)&&relative!==''&&!path.isAbsolute(relative)&&relative!=='..'&&!relative.startsWith('..'+path.sep);}catch{}callback({cancel:!allowed});});
  isolated.on('will-download',event=>event.preventDefault());
  win=new BrowserWindow({width:1320,height:960,minWidth:960,minHeight:720,backgroundColor:'#0a0c0e',title:'Quick Ethereum Wallet Explorer',webPreferences:{preload:path.join(__dirname,'preload.cjs'),session:isolated,contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true,devTools:false,spellcheck:false}});
  win.setMenu(null);
  // Security: exclude the window from screenshots, screen sharing and recording (Windows/macOS).
  win.setContentProtection(true);
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',e=>e.preventDefault());
  win.webContents.on('will-attach-webview',event=>event.preventDefault());
  const editLabels={fr:['Couper','Copier','Coller','Tout sélectionner'],en:['Cut','Copy','Paste','Select all'],zh:['剪切','复制','粘贴','全选'],hi:['काटें','कॉपी करें','पेस्ट करें','सब चुनें'],es:['Cortar','Copiar','Pegar','Seleccionar todo'],pt:['Recortar','Copiar','Colar','Selecionar tudo'],de:['Ausschneiden','Kopieren','Einfügen','Alles auswählen'],ru:['Вырезать','Копировать','Вставить','Выделить всё'],ja:['切り取り','コピー','貼り付け','すべて選択'],ko:['잘라내기','복사','붙여넣기','모두 선택'],id:['Potong','Salin','Tempel','Pilih semua'],vi:['Cắt','Sao chép','Dán','Chọn tất cả'],tr:['Kes','Kopyala','Yapıştır','Tümünü seç'],uk:['Вирізати','Копіювати','Вставити','Вибрати все'],ar:['قص','نسخ','لصق','تحديد الكل'],bn:['কাটুন','কপি','পেস্ট','সব নির্বাচন'],ur:['کاٹیں','نقل','چسپاں','سب منتخب کریں'],fil:['Gupitin','Kopyahin','Idikit','Piliin lahat'],th:['ตัด','คัดลอก','วาง','เลือกทั้งหมด'],it:['Taglia','Copia','Incolla','Seleziona tutto']};
  win.webContents.on('context-menu',(_event,params)=>{
    const labels=editLabels[preferences.lang]||editLabels.en,flags=params.editFlags||{};
    Menu.buildFromTemplate([
      {label:labels[0],role:'cut',enabled:params.isEditable&&!!flags.canCut},
      {label:labels[1],role:'copy',enabled:!!params.selectionText||!!flags.canCopy},
      {label:labels[2],role:'paste',enabled:params.isEditable&&!!flags.canPaste},
      {type:'separator'}, {label:labels[3],role:'selectAll'}
    ]).popup({window:win});
  });
  win.webContents.on('before-input-event',(event,input)=>{
    if(input.type!=='keyDown'||input.alt||input.meta)return;const key=input.key?.toLowerCase();let action;
    if(input.control&&!input.shift)action={c:'copy',v:'paste',x:'cut',a:'selectAll',insert:'copy'}[key];
    else if(input.shift&&!input.control&&key==='insert')action='paste';
    if(action){event.preventDefault();win.webContents[action]();}
  });

  win.on('closed',()=>{ledgerAllowed=false;controller?.abort();transferWork?.abort();transfers.clear();offline.clear();controller=null;win=null;});
  ipcMain.handle('ledger-begin',e=>{trusted(e);if(controller||transferWork||ledgerAllowed)return false;ledgerAllowed=true;return true;});
  ipcMain.handle('clear-clipboard',e=>{trusted(e);clipboard.clear();return true;});
  ipcMain.handle('ledger-end',e=>{trusted(e);ledgerAllowed=false;return true;});
  ipcMain.handle('ledger-register',(e,rows)=>{trusted(e);if(!ledgerAllowed)throw Error('Lecture Ledger requise.');return {count:transfers.register(rows)};});
  ipcMain.handle('transfer-assets',async e=>{trusted(e);await preferencesReady;return preferences.catalog();});
  const transferTask=async(e,kind,fn)=>{
    trusted(e);if(offlineOnly&&['prepare','start','broadcast','status','tokens','offline-broadcast','offline-prepare'].includes(kind))return {error:'Mode hors ligne actif : appels réseau bloqués.'};if(controller||transferWork||ledgerAllowed)return {error:'Une opération est déjà en cours.'};
    const active=new AbortController();transferWork=active;transferWorkKind=kind;
    try{await preferencesReady;return await fn(active.signal);}catch(error){return {error:error.message||'Transaction impossible.'};}
    finally{if(transferWork===active){transferWork=null;transferWorkKind='';}}
  };
  ipcMain.handle('platform-info',e=>{trusted(e);return {version:require('../package.json').version,offline:offlineOnly};});
  ipcMain.handle('preferences',async e=>{trusted(e);await preferencesReady;return preferences.state();});
  ipcMain.handle('ui-language',async(e,lang)=>{trusted(e);await preferencesReady;return preferences.language(lang);});
  ipcMain.handle('token-settings',(e,request)=>transferTask(e,'tokens',async signal=>{
    transfers.invalidate();
    if(request.action==='add')return preferences.add(request.address,await approveEndpoint(request.endpoint),signal);
    if(request.action==='select')return preferences.selection(request.address,request.kind,request.enabled);
    if(request.action==='remove')return preferences.remove(request.address);
    if(request.action==='defaults')return preferences.defaults();
    throw Error('Action ERC20 invalide.');
  }));
  ipcMain.handle('offline-mode',(e,enabled)=>{trusted(e);if(typeof enabled!=='boolean'||controller||transferWork||ledgerAllowed||offline.isSigning())return {error:'Une opération est déjà en cours.'};offlineOnly=enabled;return {enabled:offlineOnly};});
  ipcMain.handle('offline-prepare',(e,request)=>transferTask(e,'offline-prepare',async signal=>offline.prepare({...request,endpoint:await approveEndpoint(request?.endpoint)},signal)));
  ipcMain.handle('offline-read',(e,text)=>transferTask(e,'offline-read',()=>offline.read(text)));
  ipcMain.handle('offline-start',(e,{id})=>transferTask(e,'offline-start',()=>{if(!offlineOnly)throw Error('Activez le mode hors ligne avant la signature.');return offline.start(id);}));
  ipcMain.handle('offline-complete',(e,{id,serialized})=>transferTask(e,'offline-complete',()=>{if(!offlineOnly)throw Error('Mode hors ligne requis.');return offline.complete(id,serialized);}));
  ipcMain.handle('offline-cancel',(e,{id})=>{trusted(e);offline.cancel(id);return {ok:true};});
  ipcMain.handle('offline-broadcast',(e,{id,endpoint})=>transferTask(e,'offline-broadcast',async signal=>offline.broadcast(id,await approveEndpoint(endpoint),signal)));
  ipcMain.handle('offline-export',(e,{kind,id})=>transferTask(e,'offline-export',async()=>{
    const value=kind==='unsigned'?unsignedEnvelope(transfers.plan(id,['prepared'])):kind==='signed'?offline.export(id):kind==='offline-unsigned'?offline.unsigned(id):null;if(!value)throw Error('Format inconnu.');
    const {canceled,filePath}=await dialog.showSaveDialog(win,{title:kind!=='signed'?'Exporter la transaction non signée':'Exporter la transaction signée',defaultPath:kind!=='signed'?'QBE_transaction_non_signee.json':'QBE_transaction_signee.json',filters:[{name:'JSON',extensions:['json']}]});if(canceled)return {cancelled:true};await fs.writeFile(filePath,JSON.stringify(value,null,2),{encoding:'utf8',mode:0o600});return {ok:true};
  }));
  ipcMain.handle('transfer-prepare',(e,request)=>transferTask(e,'prepare',async signal=>{transfers.source(request?.from,request?.path);return transfers.prepare({...request,endpoint:await approveEndpoint(request?.endpoint)},signal);}));
  ipcMain.handle('transfer-start',(e,{id})=>transferTask(e,'start',signal=>transfers.start(id,signal)));
  ipcMain.handle('transfer-broadcast',(e,{id,serialized})=>transferTask(e,'broadcast',signal=>transfers.broadcast(id,serialized,signal)));
  ipcMain.handle('transfer-status',(e,{id})=>transferTask(e,'status',signal=>transfers.status(id,signal)));
  ipcMain.handle('transfer-cancel',(e,{id})=>{trusted(e);if(transferWorkKind!=='broadcast')transferWork?.abort();transfers.cancel(id);return true;});
  ipcMain.handle('open-transaction',async(e,hash)=>{trusted(e);if(offlineOnly)return {error:'Mode hors ligne actif : appels réseau bloqués.'};if(typeof hash!=='string'||!/^0x[0-9a-f]{64}$/i.test(hash))return {error:'Hash invalide.'};await shell.openExternal('https://etherscan.io/tx/'+hash);return {ok:true};});
  ipcMain.handle('scan',async(e,request)=>{
    trusted(e);if(offlineOnly)return {error:'Mode hors ligne actif : appels réseau bloqués.'};
    if(controller||transferWork||ledgerAllowed)return {error:'Une lecture Ledger ou un contrôle est déjà en cours.'};
    let endpoint;try{endpoint=await approveEndpoint(request?.endpoint);}catch(err){return {error:err.message||'URL RPC invalide.'};}
    if(controller||transferWork||ledgerAllowed||offlineOnly)return {error:'Une lecture Ledger ou un contrôle est déjà en cours.'};
    try{
      const rows=validateRows(request.rows),tokens=tokenAddresses(request.tokens),history=request.history===true,usd=request.usd===true;
      results={};currentRows=rows;block='';controller=new AbortController();const active=controller;
      const emit=message=>{
        if(message.type==='start')block=message.block;
        if(message.type==='result')results[message.result.address]=message.result;
        if(win&&!win.isDestroyed())win.webContents.send('scan-event',message);
      };
      // Run after accepting IPC. Secrets never enter this process.
      setImmediate(async()=>{
        try{await scan({endpoint,rows,tokens,history,usd},active.signal,emit,appFetch);}catch(err){emit({type:active.signal.aborted?'cancelled':'failure',error:active.signal.aborted?'Contrôle arrêté.':err.message});}
        finally{active.abort();if(controller===active)controller=null;}
      });
      return {ok:true};
    }catch(_){return {error:'Paramètres invalides. Vérifiez le RPC, les adresses et les contrats ERC20.'};}
  });
  ipcMain.handle('cancel',e=>{trusted(e);controller?.abort();return true;});
  ipcMain.handle('forget',e=>{trusted(e);if(controller||transferWork||ledgerAllowed)return false;transfers.clear();offline.clear();results={};currentRows=[];block='';return true;});
  ipcMain.handle('copy-addresses',async(e,addresses)=>{
    trusted(e);
    try{
      if(!Array.isArray(addresses))throw Error();
      const unique=[...new Set(validateRows(addresses.map(address=>({address}))).map(row=>row.address))];
      await clipboard.writeText(unique.join('\r\n'));
      return {ok:true,count:unique.length};
    }catch{return {error:'Impossible de copier les adresses publiques.'};}
  });
  ipcMain.handle('open-explorer',async(e,address)=>{
    trusted(e);if(offlineOnly)return {error:'Mode hors ligne actif : appels réseau bloqués.'};
    try{
      const checked=validateRows([{address}])[0].address;
      await shell.openExternal('https://etherscan.io/address/'+checked);
      return {ok:true};
    }catch{return {error:'Impossible d’ouvrir Etherscan. Vous pouvez copier l’adresse puis la coller dans votre navigateur.'};}
  });
  ipcMain.handle('export',async(e,{kind,rows})=>{
    trusted(e);
    try{
      rows=validateRows(rows);
      const addresses=kind==='addresses';
      if(!addresses && JSON.stringify(rows)!==JSON.stringify(currentRows))return {error:'Relancez un contrôle avant cet export.'};
      const value=addresses?JSON.stringify({format:'ethereum-adresses-v1',network:'ethereum-mainnet',rows},null,2):csv(rows,results,block);
      const {canceled,filePath}=await dialog.showSaveDialog(win,{title:addresses?'Exporter les adresses publiques':'Exporter les résultats publics',defaultPath:addresses?'Ethereum_adresses_publiques.json':'Ethereum_soldes.csv',filters:[{name:addresses?'JSON':'CSV',extensions:[addresses?'json':'csv']}]});
      if(canceled)return {cancelled:true};
      await fs.writeFile(filePath,value,{encoding:'utf8',mode:0o600});return {ok:true};
    }catch{return {error:'Impossible d’exporter ce fichier.'};}
  });
  win.loadURL(entry);
});
app.on('window-all-closed',()=>app.quit());
