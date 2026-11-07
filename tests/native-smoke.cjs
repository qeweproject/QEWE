// Uses only a published test mnemonic. Exercises the real Electron file loader,
// preload, IPC and worker, including when main.cjs resides inside app.asar.
const {app,BrowserWindow,clipboard,shell}=require('electron');
const opened=[];shell.openExternal=async url=>{opened.push(url);};
const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs');
app.setPath('userData',path.join(__dirname,'../../native-test-profile'));
require(process.env.ETH_TEST_APP_MAIN||'../app/main.cjs');
const timeout=setTimeout(()=>{console.error('Native test timeout');app.exit(2);},45000);
const evaluate=(win,fn)=>win.webContents.executeJavaScript('('+fn.toString()+')()');
async function waitFor(win,fn){for(let i=0;i<160;i++){if(await evaluate(win,fn))return;await new Promise(r=>setTimeout(r,100));}throw Error('Renderer condition timeout');}
app.whenReady().then(()=>{
 const win=BrowserWindow.getAllWindows()[0],errors=[];
 win.webContents.on('console-message',(e,...legacy)=>{const message=e.message||legacy[1];const level=e.level??legacy[0];if(level==='error'||level===3)errors.push(message);});
 win.webContents.on('preload-error',(_e,_p,error)=>errors.push(error.message));
 win.webContents.once('did-finish-load',async()=>{
  try{
   await waitFor(win,()=>document.getElementById('offline-asset').options.length>1);await evaluate(win,()=>{I18n.setLang('fr',false);document.getElementById('address-count').value='100';});
   assert.equal(await evaluate(win,()=>typeof window.desktop),'object');await evaluate(win,()=>{document.getElementById('theme').click();});assert.equal(await evaluate(win,()=>document.documentElement.dataset.theme),'day');if(process.env.ETH_TEST_DAY_SCREENSHOT){await new Promise(r=>setTimeout(r,160));fs.writeFileSync(process.env.ETH_TEST_DAY_SCREENSHOT,(await win.webContents.capturePage()).toPNG());}await evaluate(win,()=>{document.getElementById('theme').click();});assert.equal(await evaluate(win,()=>document.documentElement.dataset.theme),'night');assert.equal(await evaluate(win,()=>document.getElementById('theme').getAttribute('aria-label')),'Passer en mode jour');if(process.env.ETH_TEST_NIGHT_HEADER_SCREENSHOT){await new Promise(r=>setTimeout(r,100));fs.writeFileSync(process.env.ETH_TEST_NIGHT_HEADER_SCREENSHOT,(await win.webContents.capturePage()).toPNG());}
   await evaluate(win,()=>{document.getElementById('phrase').value='test test test test test test test test test test test junk';document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='299');
   const en=await evaluate(win,()=>({count:document.querySelectorAll('#rows tr').length,cleared:document.getElementById('phrase').value==='',status:document.getElementById('generation-status').textContent,body:document.getElementById('rows').textContent}));
   assert.equal(en.count,250);assert.equal(en.cleared,true);assert(en.status.includes('299 adresses uniques'));assert(en.body.includes('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
   await evaluate(win,()=>document.querySelector('.copy-address').click());
   await waitFor(win,()=>document.getElementById('generation-status').textContent.includes('copiée'));
   assert.equal(await clipboard.readText(),'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
   await evaluate(win,()=>document.querySelector('.open-explorer').click());
   await waitFor(win,()=>document.getElementById('generation-status').textContent.includes('Etherscan ouvert'));
   assert.deepEqual(opened,['https://etherscan.io/address/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266']);
   await evaluate(win,()=>document.getElementById('copy-all').click());
   await waitFor(win,()=>document.getElementById('generation-status').textContent.includes('299 adresses publiques copiées'));
   const copied=(await clipboard.readText()).split(/\r?\n/);assert.equal(copied.length,299);assert.equal(new Set(copied).size,299);assert(copied.every(a=>/^0x[0-9a-fA-F]{40}$/.test(a)));
   await evaluate(win,()=>document.getElementById('clear').click());
   await waitFor(win,()=>document.getElementById('count').textContent==='0');
   await evaluate(win,()=>{document.getElementById('language').value='fr';document.getElementById('phrase').value='abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abeille';document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='299');
   assert(await evaluate(win,()=>document.getElementById('rows').textContent.includes('0x4B8EF44C122F1256580278729B695D4590A69742')));
   await evaluate(win,()=>document.querySelector('.results').scrollIntoView());
   await new Promise(resolve=>setTimeout(resolve,160));
   if(process.env.ETH_TEST_SCREENSHOT)fs.writeFileSync(process.env.ETH_TEST_SCREENSHOT,(await win.webContents.capturePage()).toPNG());
   await evaluate(win,()=>document.getElementById('clear').click());
   await waitFor(win,()=>document.getElementById('count').textContent==='0');
   await evaluate(win,()=>{document.getElementById('language').value='en';document.getElementById('phrase').value='test test test test test test test test test test test junk';document.getElementById('custom').value="m/44'/60'/1'/0/{i}";document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='398');
   assert.equal(await evaluate(win,()=>document.querySelectorAll('#rows tr').length),250);
   await evaluate(win,()=>document.getElementById('clear').click());
   await waitFor(win,()=>document.getElementById('count').textContent==='0');
   await evaluate(win,()=>{document.getElementById('phrase').value='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon';document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('generation-status').textContent.includes('invalide'));
   assert.equal(await evaluate(win,()=>document.getElementById('count').textContent),'0');
   await evaluate(win,()=>{document.getElementById('address-count').value='7';document.getElementById('phrase').value='test test test test test test test test test test test junk';document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='26');
   assert.equal(await evaluate(win,()=>document.querySelectorAll('#rows tr').length),26);
   assert.equal(await evaluate(win,()=>document.querySelectorAll('input[name=token]:checked').length),25);
   await evaluate(win,()=>document.getElementById('clear').click());await waitFor(win,()=>document.getElementById('count').textContent==='0');
   await evaluate(win,()=>{document.getElementById('custom').value='';document.getElementById('address-count').value='1';document.getElementById('language').value='auto';for(const box of document.querySelectorAll('input[name=mode]'))box.checked=box.value==='standard';document.getElementById('phrase').value='TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, JUNK';document.getElementById('derive').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='1');assert(await evaluate(win,()=>document.getElementById('rows').textContent.includes('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')));assert(await evaluate(win,()=>document.getElementById('derivation-info').textContent.includes('BIP39 validé')));
   await evaluate(win,()=>document.getElementById('clear').click());await waitFor(win,()=>document.getElementById('count').textContent==='0');
   const fixture=require('./recovery-vectors.json').custom;
   await win.webContents.executeJavaScript(`document.getElementById('phrase').value=${JSON.stringify(fixture.phrase)};document.getElementById('password').value=${JSON.stringify(fixture.password)};document.getElementById('pbkdf2-rounds').value='4096';document.getElementById('derive').click();`);
   await waitFor(win,()=>document.getElementById('count').textContent==='1');assert((await evaluate(win,()=>document.getElementById('rows').textContent)).includes(fixture.address));assert(await evaluate(win,()=>document.getElementById('derivation-info').textContent.includes('4096')));
   assert.equal(await evaluate(win,()=>document.getElementById('airdrop-check')),null);
   const icons=await evaluate(win,()=>({a:Blockies.dataUri('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),b:Blockies.dataUri('0x000000000000000000000000000000000000dEaD')}));assert.notEqual(icons.a,icons.b);assert(icons.a.startsWith('data:image/svg+xml;'));
   if(process.env.ETH_TEST_RECOVERY_SCREENSHOT){await evaluate(win,()=>{document.getElementById('recovery-options').open=true;document.getElementById('recovery-options').scrollIntoView();});await new Promise(r=>setTimeout(r,160));fs.writeFileSync(process.env.ETH_TEST_RECOVERY_SCREENSHOT,(await win.webContents.capturePage()).toPNG());}
   assert.equal(await evaluate(win,()=>typeof navigator.hid.requestDevice),'function');
   assert.equal(await evaluate(win,()=>document.getElementById('ledger-read').hidden),false);
   await evaluate(win,()=>{window.ledgerTestCalls=[];window.ledgerTestClosed=false;LedgerUsb.connect=async()=>({readAddress:async(path,display)=>{ledgerTestCalls.push({path,display});return ethers.HDNodeWallet.fromPhrase('test test test test test test test test test test test junk','',path).address;},close:async()=>{window.ledgerTestClosed=true;}});document.getElementById('address-count').value='3';document.getElementById('pbkdf2-rounds').value='2048';document.getElementById('phrase').value='test-only-unused-text';for(const box of document.querySelectorAll('input[name=mode]'))box.checked=true;document.getElementById('ledger-read').click();});
   await waitFor(win,()=>document.getElementById('count').textContent==='8'&&!document.getElementById('ledger-read').disabled);
   assert.equal(await evaluate(win,()=>window.ledgerTestCalls.length),8);
   assert.equal(await evaluate(win,()=>window.ledgerTestCalls.every(c=>!c.display)),true);
   assert.equal(await evaluate(win,()=>window.ledgerTestClosed),true);
   assert.equal(await evaluate(win,()=>document.getElementById('phrase').value),'');
   assert(await evaluate(win,()=>document.getElementById('generation-status').textContent.includes('lues sur le Ledger')));
   assert.equal(errors.length,0,JSON.stringify(errors));clearTimeout(timeout);
   console.log('PASS real Electron: local file loading, preload + IPC, real worker EN/FR, 299/398 unique rows and configurable count, correct vectors, secrets cleared, visible status and checksum errors; actual clipboard copy (single/all), Etherscan IPC (browser launch mocked), WebHID API and Ledger UI + permission IPC with simulated device reads (no physical USB tested).');
   app.exit(0);
  }catch(e){console.error('FAIL native smoke:',e.message);console.error('Renderer state:',await evaluate(win,()=>({status:document.getElementById('status').textContent,count:document.getElementById('count').textContent})));clearTimeout(timeout);app.exit(1);}
 });
});
