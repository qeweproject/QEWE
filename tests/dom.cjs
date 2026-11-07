// DOM and real worker-script tests when a native GUI is unavailable.
const {JSDOM}=require('jsdom'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {Worker}=require('node:worker_threads');
const assert=require('node:assert/strict');
const appDir=path.join(__dirname,'../app');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(predicate){for(let i=0;i<300;i++){if(predicate())return;await wait(50);}throw Error('Timeout: '+global.lastStatus?.());}
async function run(){
  const dom=new JSDOM(fs.readFileSync(path.join(appDir,'index.html'),'utf8'),{runScripts:'outside-only',url:'file://'+path.join(appDir,'index.html')});
  const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
  w.Worker=class {
    constructor(){
      this.node=new Worker(`
        const {parentPort,workerData}=require('node:worker_threads');
        const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
        const context=vm.createContext({console:{log(){},warn(){},error(){}},crypto:require('node:crypto').webcrypto,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,setTimeout,clearTimeout,postMessage:m=>parentPort.postMessage(m),close:()=>{}});
        context.self=context;context.importScripts=(...names)=>names.forEach(n=>vm.runInContext(fs.readFileSync(path.join(workerData,n),'utf8'),context));
        vm.runInContext(fs.readFileSync(path.join(workerData,'worker.js'),'utf8'),context);
        parentPort.on('message',data=>context.onmessage({data}));
      `,{eval:true,workerData:appDir});
      this.node.on('message',data=>this.onmessage?.({data}));this.node.on('error',e=>this.onerror?.(e));
    }
    postMessage(value){this.node.postMessage(value);}
    terminate(){this.node.terminate();}
  };
  let scanRequest,receiveScan,exportValue,copied,opened;
  w.desktop={ledgerAvailable:true,copyAddresses:async addresses=>{copied=[...new Set(addresses)];return {ok:true,count:copied.length};},openExplorer:async address=>{opened=address;return {ok:true};},forget:async()=>true,cancel:async()=>true,onScan:fn=>receiveScan=fn,export:async value=>{exportValue=value;return {ok:true};},scan:async request=>{
    scanRequest=request;
    setTimeout(()=>{
      const addresses=[...new Set(request.rows.map(r=>r.address))];receiveScan({type:'start',block:'0x123',unique:addresses.length});
      addresses.forEach((address,i)=>receiveScan({type:'result',done:i+1,total:addresses.length,result:{address,eth:i?'0.0':'1.0',wei:i?'0':'1000000000000000000',nonce:'0',tokens:[],usd:{micros:i?'0':'123450000000',value:i?'0':'1234.5',partial:false,missing:[],source:'DefiLlama',fetchedAt:new Date().toISOString()},activity:{status:'ok',transactions:i===1?'2':'0',tokenTransfers:i===2?'1':'0'},status:'ok'}}));
      receiveScan({type:'complete',block:'0x123'});
    },5);return {ok:true};
  }};
  w.HTMLCanvasElement.prototype.getContext=function(){return {fillRect(){},fillStyle:''};};w.HTMLCanvasElement.prototype.toDataURL=function(){return 'data:image/png;base64,AA==';};
  w.eval(fs.readFileSync(path.join(appDir,'vendor/ethers.umd.min.js'),'utf8'));
  w.eval(fs.readFileSync(path.join(appDir,'address-book.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'token-presets.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'vendor/ethereum-blockies.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'blockies.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'networks.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'renderer.js'),'utf8'));global.lastStatus=()=>$('status').textContent;assert.equal($('balance-settings').open,false);assert.equal($('stop').hidden,true);
  $('address-count').value='100';$('phrase').value='test test test test test test test test test test test junk';$('derive').click();
  await until(()=>$('count').textContent==='299');
  assert.equal(doc.querySelectorAll('#rows tr').length,250);assert.equal($('phrase').value,'');assert.equal($('password').value,'');assert.equal(doc.querySelectorAll('.blockie').length,0);
  doc.querySelector('.copy-address').click();await wait(10);assert.equal(copied.length,1);assert.equal(copied[0],'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  doc.querySelector('.open-explorer').click();await wait(10);assert.equal(opened,copied[0]);
  $('copy-all').click();await wait(10);assert.equal(copied.length,299);assert(!JSON.stringify(copied).includes('test test'));
  $('history').checked=true;$('usd').checked=true;$('scan').click();await until(()=>$('status').textContent.includes('Contrôle terminé'));
  assert.equal($('total').textContent,'1.0');assert($('usd-total').textContent.includes('1 234,50'));$('theme').click();assert.equal($('theme').getAttribute('aria-label'),'Passer en mode nuit');assert.equal($('theme').getAttribute('aria-pressed'),'true');assert.equal(doc.documentElement.dataset.theme,'day');$('theme').click();assert.equal($('theme').getAttribute('aria-label'),'Passer en mode jour');assert.equal(doc.documentElement.dataset.theme,'night');assert.equal($('funded').textContent,'1');
  assert(!JSON.stringify(scanRequest).includes('test test'));assert.equal(scanRequest.tokens.length,25);assert.equal(scanRequest.history,true);assert.equal(scanRequest.usd,true);assert(!('airdrops' in scanRequest));assert.equal(doc.querySelectorAll('.blockie').length,3);assert.equal($('airdrop-check'),null);assert(!doc.body.textContent.toLowerCase().includes('airdrop'));
  $('with-tx').checked=true;$('with-tx').dispatchEvent(new w.Event('change'));assert.equal(doc.querySelectorAll('#rows tr').length,2);$('copy-visible').click();await wait(10);assert.equal(copied.length,2);$('with-tx').checked=false;$('with-tx').dispatchEvent(new w.Event('change')); 
  $('positive').checked=true;$('positive').dispatchEvent(new w.Event('change'));assert.equal(doc.querySelectorAll('#rows tr').length,1);$('copy-visible').click();await wait(10);assert.equal(copied.length,1);
  $('positive').checked=false;const candidates=scanRequest.rows.slice(3,6);
  receiveScan({type:'result',done:299,total:299,result:{address:candidates[0].address,eth:'0.0',wei:'0',nonce:'0',tokens:[{address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',symbol:'USDC',raw:'1',balance:'0.000001',status:'ok'}],activity:null,status:'ok'}});
  receiveScan({type:'result',done:299,total:299,result:{address:candidates[1].address,eth:'0.0',wei:'0',nonce:'1',tokens:[],activity:null,status:'ok'}});
  receiveScan({type:'result',done:299,total:299,result:{address:candidates[2].address,eth:null,wei:null,nonce:null,tokens:[],activity:{status:'error'},status:'error'}});
  receiveScan({type:'complete'});assert.equal(doc.querySelectorAll('.blockie').length,5);
  $('addresses').click();await wait(10);assert.equal(exportValue.kind,'addresses');assert.equal(exportValue.rows.length,299);
  $('clear').click();await until(()=>$('count').textContent==='0');
  $('positive').checked=false;$('language').value='fr';
  $('phrase').value='abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abeille';
  $('derive').click();await until(()=>$('count').textContent==='299');
  assert($('rows').textContent.includes('0x4B8EF44C122F1256580278729B695D4590A69742'));
  $('clear').click();await until(()=>$('count').textContent==='0');
  $('language').value='en';$('phrase').value='test test test test test test test test test test test junk';
  $('custom').value="m/44'/60'/1'/0/{i}";$('derive').click();await until(()=>$('count').textContent==='398');
  assert.equal(doc.querySelectorAll('#rows tr').length,250);
  $('clear').click();await until(()=>$('count').textContent==='0');
  const json=JSON.stringify({format:'ethereum-adresses-v1',network:'ethereum-mainnet',rows:[{address:'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}]});
  Object.defineProperty($('file'),'files',{configurable:true,value:[{name:'addresses.json',size:json.length,text:async()=>json}]});
  $('file').dispatchEvent(new w.Event('change'));await until(()=>$('count').textContent==='1');assert.equal($('scan').disabled,false);
  $('clear').click();await until(()=>$('count').textContent==='0');
  assert.equal(doc.querySelectorAll('.blockie').length,0);
  $('custom').value='';$('address-count').value='1';for(const input of doc.querySelectorAll('input[name=mode]'))input.checked=input.value==='standard';
  const fixtures=require('./recovery-vectors.json'),languages=new Map(fixtures.vectors.map(v=>[v.language,v]));
  for(const v of languages.values()){
    $('language').value='auto';$('phrase').value=v.phrase;$('password').value=v.password;$('derive').click();await until(()=>$('count').textContent==='1');
    assert($('rows').textContent.includes(v.address),v.language);assert($('derivation-info').textContent.includes('BIP39 validé'));assert.equal($('phrase').value,'');assert.equal($('password').value,'');
    $('clear').click();await until(()=>$('count').textContent==='0');
  }
  const paste=new w.Event('paste',{cancelable:true});Object.defineProperty(paste,'clipboardData',{value:{getData:()=>fixtures.vectors[0].phrase.toUpperCase().split(' ').map((word,i)=>`${i+1}. ${word}`).join('\n')}});$('phrase').dispatchEvent(paste);$('password').value=fixtures.vectors[0].password;
  $('derive').click();await until(()=>$('count').textContent==='1');assert($('rows').textContent.includes(fixtures.vectors[0].address));
  $('clear').click();await until(()=>$('count').textContent==='0');
  $('phrase').value=fixtures.compat.phrase;$('derive').click();await until(()=>$('generation-status').textContent.includes('checksum BIP39 invalide'));assert.equal($('count').textContent,'0');assert(!$('generation-status').textContent.includes('abandon'));
  $('recovery-format').value='compat';$('recovery-format').dispatchEvent(new w.Event('change'));$('phrase').value=fixtures.compat.phrase;$('derive').click();await until(()=>$('count').textContent==='1');assert($('rows').textContent.includes(fixtures.compat.address));assert($('derivation-info').textContent.includes('phrase non validée'));assert($('derivation-info').className.includes('notice'));
  assert(!JSON.stringify(scanRequest).includes('TREZOR'));
  w.eval(fs.readFileSync(path.join(appDir,'paths.js'),'utf8'));w.eval(fs.readFileSync(path.join(appDir,'ledger-core.js'),'utf8'));
  const hd=require('ethers').HDNodeWallet.fromPhrase('test test test test test test test test test test test junk','','m');let closed=0,ended=0;const ledgerCalls=[];
  w.desktop.ledgerAvailable=true;w.desktop.beginLedger=async()=>true;w.desktop.endLedger=async()=>{ended++;return true;};w.LedgerUsb={connect:async()=>({readAddress:async(path,display)=>{ledgerCalls.push({path,display});return hd.derivePath(path).address;},close:async()=>closed++})};
  $('address-count').value='3';for(const input of doc.querySelectorAll('input[name=mode]'))input.checked=true;
  $('phrase').value='this must be cleared';$('password').value='not a Ledger PIN';$('ledger-read').click();await until(()=>$('generation-status').textContent.includes('adresses uniques lues sur le Ledger'));await until(()=>$('ledger-read').disabled===false);
  assert.equal($('count').textContent,'22');assert.equal($('phrase').value,'');assert.equal($('password').value,'');assert.equal(closed,1);assert.equal(ended,1);assert.equal(ledgerCalls.length,22);assert(ledgerCalls.every(c=>!c.display));assert($('derivation-info').textContent.includes('restent sur l’appareil'));
  w.LedgerUsb.connect=async()=>({readAddress:async(path,display)=>{throw {statusCode:0x6985};},close:async()=>closed++});
  $('ledger-read').click();await until(()=>$('generation-status').textContent.includes('refusée'));await until(()=>$('ledger-read').disabled===false);assert.equal($('count').textContent,'0');assert.equal(closed,2);
  dom.window.close();
  console.log('PASS DOM + bundled worker: EN/FR derivation, all modes and MEW custom, fields cleared, deduplicated totals, public-only scan, filters, exports and JSON import. Native window/rendering not tested.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
