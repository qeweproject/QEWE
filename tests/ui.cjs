const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
  const root=path.join(__dirname,'../app');
  const server=http.createServer((req,res)=>{
    const p=path.join(root,req.url==='/'?'index.html':req.url);
    if(!p.startsWith(root)){res.writeHead(403);res.end();return;}
    const ext=path.extname(p);res.setHeader('Content-Type',ext==='.html'?'text/html':ext==='.css'?'text/css':'application/javascript');
    try{res.end(fs.readFileSync(p));}catch{res.writeHead(404);res.end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:1320,height:1100}}),errors=[],external=[];
    page.on('pageerror',err=>errors.push(err.message));
    page.on('request',req=>{if(!req.url().startsWith(origin))external.push(req.url());});
    await page.addInitScript(()=>{
      window.mockEvents=[];
      window.desktop={forget:async()=>true,cancel:async()=>true,export:async value=>{window.lastExport=value;return {ok:true};},scan:async request=>{
        window.lastScan=request;
        setTimeout(()=>{
          const addresses=[...new Set(request.rows.map(r=>r.address))];
          window.receiveScan({type:'start',block:'0x123',unique:addresses.length});
          addresses.forEach((address,i)=>window.receiveScan({type:'result',done:i+1,total:addresses.length,result:{address,eth:i===0?'1.0':'0.0',wei:i===0?'1000000000000000000':'0',nonce:'0',tokens:[],status:'ok'}}));
          window.receiveScan({type:'complete',block:'0x123'});
        },5);return {ok:true};
      },onScan:cb=>window.receiveScan=cb};
    });
    await page.goto(origin);
    await page.locator('#phrase').fill('test test test test test test test test test test test junk');
    await page.locator('#derive').click();
    await page.waitForFunction(()=>document.getElementById('count').textContent==='299',{timeout:30000});
    assert.equal(await page.locator('#rows tr').count(),199);
    assert.equal(await page.locator('#phrase').inputValue(),'');
    assert.equal(await page.locator('#password').inputValue(),'');
    assert.deepEqual(external,[]);
    await page.locator('#scan').click();
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Contrôle terminé'));
    assert.equal(await page.locator('#total').textContent(),'1.0');
    assert(!JSON.stringify(await page.evaluate(()=>window.lastScan)).includes('test test'));
    await page.locator('#positive').check();assert.equal(await page.locator('#rows tr').count(),1);
    await page.locator('#positive').uncheck();
    await page.screenshot({path:path.join(__dirname,'../../qa-preview.png'),fullPage:true});
    await page.locator('#clear').click();
    await page.locator('#language').selectOption('fr');
    await page.locator('#phrase').fill('abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abaisser abeille');
    await page.locator('#derive').click();
    await page.waitForFunction(()=>document.getElementById('count').textContent==='299');
    await page.locator('#clear').click();
    const sample=JSON.stringify({format:'ethereum-adresses-v1',network:'ethereum-mainnet',rows:[{address:'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}]});
    await page.locator('#file').setInputFiles({name:'addresses.json',mimeType:'application/json',buffer:Buffer.from(sample)});
    await page.waitForFunction(()=>document.getElementById('count').textContent==='1');
    assert.equal(await page.locator('#scan').isEnabled(),true);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    console.log('UI passed: real offline worker (English and French), 300 rows/299 unique, secret fields cleared, public-only scan, totals, filters, JSON import, no network requests outside local assets.');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
