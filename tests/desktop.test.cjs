const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
test('Desktop bridge: sandbox, origin checks, external requests blocked, public-only exports',async()=>{
  const contentEvents=new Map(),editCalls=[],menus=[];const sessionEvents=new Map();let permissionCheck;const handlers=new Map(),events=[],writes=[],copies=[],opened=[];let instance,requestFilter,permission,exportPath='/virtual/public.json';
  class Window{
    constructor(options){instance=this;this.options=options;this.webContents={send:(...args)=>events.push(args),setWindowOpenHandler:fn=>this.open=fn,on:(name,fn)=>contentEvents.set(name,fn),copy:()=>editCalls.push('copy'),paste:()=>editCalls.push('paste'),cut:()=>editCalls.push('cut'),selectAll:()=>editCalls.push('selectAll')};}
    setMenu(){}on(){}loadURL(url){this.url=url;}isDestroyed(){return false;}
  }
  const fakeElectron={Menu:{buildFromTemplate:items=>({popup:()=>menus.push(items)})},app:{commandLine:{appendSwitch(){}},getPath:()=>'/virtual/profile',whenReady:()=>Promise.resolve(),on(){},quit(){}},BrowserWindow:Window,
    clipboard:{writeText:async text=>copies.push(text)},shell:{openExternal:async url=>opened.push(url)},
    ipcMain:{handle:(name,fn)=>handlers.set(name,fn)},dialog:{showSaveDialog:async()=>({canceled:false,filePath:exportPath})},
    session:{fromPartition:()=>({setPermissionRequestHandler:fn=>permission=fn,setPermissionCheckHandler:fn=>permissionCheck=fn,on:(name,fn)=>sessionEvents.set(name,fn),webRequest:{onBeforeRequest:fn=>requestFilter=fn}})}};
  const appDir=path.join(__dirname,'../app');
  const context=vm.createContext({require:name=>name==='electron'?fakeElectron:name==='node:fs/promises'?{writeFile:async(...args)=>writes.push(args)}:name.startsWith('./')?require(path.join(appDir,name)):require(name),__dirname:appDir,URL,setImmediate,AbortController,console});
  vm.runInContext(fs.readFileSync(path.join(appDir,'main.cjs'),'utf8'),context);await new Promise(r=>setImmediate(r));
  assert.equal(instance.options.webPreferences.sandbox,true);assert.equal(instance.options.webPreferences.contextIsolation,true);assert.equal(instance.options.webPreferences.nodeIntegration,false);
  let cancelled;requestFilter({url:'https://example.org'},r=>cancelled=r.cancel);assert.equal(cancelled,true);
  requestFilter({url:require('node:url').pathToFileURL(path.join(appDir,'worker.js')).href},r=>cancelled=r.cancel);assert.equal(cancelled,false);for(const suffix of ['/%2e%2e/package.json','/sub%2f..%2f..%2fpackage.json','/sub%5c..%5c..%5cpackage.json']){requestFilter({url:require('node:url').pathToFileURL(appDir).href+suffix},r=>cancelled=r.cancel);assert.equal(cancelled,true);}requestFilter({url:'file:///etc/passwd'},r=>cancelled=r.cancel);assert.equal(cancelled,true);requestFilter({url:require('node:url').pathToFileURL(path.join(appDir,'../package.json')).href},r=>cancelled=r.cancel);assert.equal(cancelled,true);
  permission(null,'clipboard-read',allowed=>assert.equal(allowed,false));assert.equal(instance.open().action,'deny');
  instance.webContents.mainFrame={url:instance.url};const event={sender:instance.webContents,senderFrame:instance.webContents.mainFrame};
  const rows=[{address:'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}];
  const saved=await handlers.get('export')(event,{kind:'addresses',rows});assert.equal(saved.ok,true);
  assert.equal(JSON.parse(writes[0][1]).rows[0].address,rows[0].address);
  const invalid=await handlers.get('export')(event,{kind:'addresses',rows:[{address:'secret words'}]});assert(invalid.error);assert.equal(writes.length,1);
  await assert.rejects(handlers.get('export')({...event,senderFrame:{url:'https://example.org'}},{kind:'addresses',rows}),/Origine refusée/);
  assert.equal((await handlers.get('scan')(event,{endpoint:'http://example.org',rows,tokens:[]})).error.length>0,true);
  await assert.rejects(handlers.get('copy-addresses')({...event,senderFrame:{url:instance.url}},[rows[0].address]),/Origine refusée/);const publicAddress=rows[0].address;
  const copied=await handlers.get('copy-addresses')(event,[publicAddress,publicAddress]);
  assert.equal(copied.count,1);assert.equal(copies[0],publicAddress);
  const secretCopy=await handlers.get('copy-addresses')(event,['seed words']);assert(secretCopy.error);assert.equal(copies.length,1);
  const oversized=await handlers.get('copy-addresses')(event,Array(40001).fill(publicAddress));assert(oversized.error);
  const explorer=await handlers.get('open-explorer')(event,publicAddress);assert.equal(explorer.ok,true);assert.deepEqual(opened,['https://etherscan.io/address/'+publicAddress]);
  const arbitrary=await handlers.get('open-explorer')(event,'https://example.org');assert(arbitrary.error);assert.equal(opened.length,1);
  await assert.rejects(handlers.get('copy-addresses')({...event,senderFrame:{url:'https://example.org'}},[publicAddress]),/Origine refusée/);
  assert.equal(handlers.has('airdrop-source'),false);
  let prevented=false;contentEvents.get('before-input-event')({preventDefault:()=>prevented=true},{type:'keyDown',key:'C',control:true});assert(prevented);assert.equal(editCalls.at(-1),'copy');
  contentEvents.get('before-input-event')({preventDefault(){}},{type:'keyDown',key:'v',control:true});assert.equal(editCalls.at(-1),'paste');
  contentEvents.get('before-input-event')({preventDefault(){}},{type:'keyDown',key:'a',control:true});assert.equal(editCalls.at(-1),'selectAll');
  contentEvents.get('context-menu')({}, {isEditable:true,selectionText:'0x123',editFlags:{canCopy:true,canCut:true,canPaste:true}});assert.equal(menus[0][1].role,'copy');assert.equal(menus[0][2].enabled,true);
  contentEvents.get('context-menu')({}, {isEditable:false,selectionText:'text',editFlags:{canCopy:true}});assert.equal(menus[1][2].enabled,false);

  assert.equal(permissionCheck(instance.webContents,'hid','file://',{requestingUrl:instance.url,isMainFrame:true}),false);
  assert.equal(await handlers.get('ledger-begin')(event),true);
  assert.equal(permissionCheck(instance.webContents,'hid','file://',{requestingUrl:instance.url,isMainFrame:true}),true);
  assert.equal(permissionCheck(instance.webContents,'usb','file://',{requestingUrl:instance.url,isMainFrame:true}),false);
  assert.equal(permissionCheck(instance.webContents,'hid','https://example.org',{requestingUrl:'https://example.org',isMainFrame:true}),false);
  assert.equal(permissionCheck(instance.webContents,'hid','file://',{requestingUrl:instance.url,isMainFrame:false}),false);
  let selected='unset';const deviceEvent={preventDefault(){}};
  await sessionEvents.get('select-hid-device')(deviceEvent,{frame:instance.webContents.mainFrame,deviceList:[{vendorId:1,deviceId:'other'},{vendorId:0x2c97,deviceId:'ledger'}]},id=>selected=id);assert.equal(selected,'ledger');await sessionEvents.get('select-hid-device')(deviceEvent,{frame:{url:instance.url},deviceList:[{vendorId:0x2c97,deviceId:'ledger'}]},id=>selected=id);assert.equal(selected,undefined);
  await sessionEvents.get('select-hid-device')(deviceEvent,{frame:{url:'https://example.org'},deviceList:[{vendorId:0x2c97,deviceId:'ledger'}]},id=>selected=id);assert.equal(selected,undefined);
  await handlers.get('ledger-end')(event);assert.equal(permissionCheck(instance.webContents,'hid','file://',{requestingUrl:instance.url,isMainFrame:true}),false);
  assert.equal(await handlers.get('forget')(event),true);
  assert.throws(()=>handlers.get('ledger-register')(event,rows),/Lecture Ledger/);
  const blocked=await handlers.get('transfer-prepare')(event,{from:publicAddress,path:"m/44'/60'/0'/0/0",recipient:publicAddress,amount:'1',asset:'ETH',endpoint:'https://rpc.example.org'});assert(blocked.error.includes('réservé'));
  await assert.rejects(handlers.get('transfer-prepare')({...event,senderFrame:{url:'https://example.org'}},{}),/Origine refusée/);
  assert((await handlers.get('open-transaction')(event,'secret text')).error);
  assert.equal((await handlers.get('offline-mode')(event,true)).enabled,true);
  for(const name of ['scan','transfer-prepare','transfer-start','transfer-broadcast','transfer-status','token-settings','offline-prepare','offline-broadcast']){const result=await handlers.get(name)(event,{id:'none'});assert(result.error.includes('hors ligne'),name);}
  assert((await handlers.get('open-explorer')(event,publicAddress)).error.includes('hors ligne'));
  assert((await handlers.get('open-transaction')(event,'0x'+'11'.repeat(32))).error.includes('hors ligne'));
  assert.throws(()=>handlers.get('offline-mode')({...event,senderFrame:{url:'https://example.org'}},false),/Origine refusée/);
  assert((await handlers.get('offline-read')(event,'{"secret":"not a transaction"}')).error);
  assert.equal((await handlers.get('offline-mode')(event,false)).enabled,false);


});
