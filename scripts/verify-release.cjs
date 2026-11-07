/* Verify installed payloads against source and runtime protections. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),{spawnSync}=require('child_process'),asar=require('@electron/asar'),{getCurrentFuseWire,FuseV1Options}=require('@electron/fuses');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../deliverables'),pkg=require('../package.json'),name=pkg.build.productName,platform=process.argv[2]||'win',arch=process.argv[3]||'arm64';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
function run(file,args){const r=spawnSync(file,args,{encoding:'utf8',maxBuffer:8*1024*1024});assert.equal(r.status,0,file+' '+(r.stderr||r.error||''));return r.stdout;}
function sevenZip(){
 for(const executable of [process.env.SEVEN_ZIP,'C:\\Program Files\\7-Zip\\7z.exe','C:\\Program Files (x86)\\7-Zip\\7z.exe','7z','7zz'].filter(Boolean)){
  const result=spawnSync(executable,['i'],{encoding:'utf8'});if(result.status===0&&/Nsis/i.test(result.stdout))return executable;
 }
 throw Error('Full 7-Zip with NSIS support is required to verify the installer. Set SEVEN_ZIP to its executable.');
}
function verifyWindowsIcon(file){
 const R=require('resedit'),entries=R.NtExecutableResource.from(R.NtExecutable.from(fs.readFileSync(file))).entries;
 const group=R.Resource.IconGroupEntry.fromEntries(entries)[0],expected=R.Data.IconFile.from(fs.readFileSync(path.join(root,'app/qewe.ico'))).icons;
 assert(group,'Windows primary icon group missing');assert.equal(group.icons.length,expected.length,'Windows icon sizes');
 for(const frame of group.icons){const source=expected.find(i=>(i.width||256)===(frame.width||256)&&(i.height||256)===(frame.height||256));const resource=entries.find(e=>e.type===3&&e.id===frame.iconID);assert(source&&resource&&Buffer.from(resource.bin).equals(Buffer.from(source.data.bin)),'Primary QEWE icon '+frame.width);}
}
(async()=>{
 assert(['win','linux','mac'].includes(platform)&&['arm64','x64'].includes(arch));
 const dir=path.join(out,platform==='win'?'win-unpacked':platform==='linux'?'linux-unpacked':`mac${arch==='arm64'?'-arm64':''}/${name}.app`),res=platform==='mac'?path.join(dir,'Contents/Resources'):path.join(dir,'resources'),archive=path.join(res,'app.asar'),exe=platform==='mac'?path.join(dir,'Contents/MacOS',name):path.join(dir,platform==='win'?name+'.exe':'qewe');
 for(const f of [...files(path.join(root,'app')),...['LICENSE','THIRD_PARTY_NOTICES.md','SECURITY.md','LISEZMOI.txt','VALIDATION.txt','REVIEW_3.2_RC1.md'].map(n=>path.join(root,n))])assert(asar.extractFile(archive,path.relative(root,f)).equals(fs.readFileSync(f)),path.relative(root,f));
 assert.equal(JSON.parse(asar.extractFile(archive,'package.json')).version,pkg.version);
 const wire=await getCurrentFuseWire(exe);for(const [k,v] of Object.entries(pkg.build.electronFuses))assert.equal(wire[FuseV1Options[k[0].toUpperCase()+k.slice(1)]],v?49:48,k);
 const headerHash=hash(Buffer.from(asar.getRawHeader(archive).headerString));
 if(platform==='win'){
  const bytes=fs.readFileSync(exe);assert.equal(bytes.subarray(0,2).toString(),'MZ');assert(bytes.includes(Buffer.from(headerHash))||bytes.includes(Buffer.from(headerHash,'utf16le')),'ASAR header digest');
  verifyWindowsIcon(exe);
 }
 if(platform==='mac'){
  const info=require('plist').parse(fs.readFileSync(path.join(dir,'Contents/Info.plist'),'utf8'));assert.equal(info.ElectronAsarIntegrity['Resources/app.asar'].hash,headerHash);assert.equal(info.ElectronAsarIntegrity['Resources/app.asar'].algorithm,'SHA256');
  assert(fs.readFileSync(path.join(res,info.CFBundleIconFile)).equals(fs.readFileSync(path.join(root,'app/qewe.icns'))),'macOS logo');run('/usr/bin/codesign',['--verify','--deep','--strict',dir]);
 }
 const suffix=platform==='win'?'Windows_x64_Setup.exe':platform==='linux'?'Ubuntu_amd64.deb':`macOS_${arch}.dmg`,installer=path.join(out,`QEWE_${pkg.version}_${suffix}`);assert(fs.existsSync(installer),'Missing '+installer);
 const temp=fs.mkdtempSync(path.join(out,'verify-payload-'));
 try{
  let builtAsar,builtExe;
  if(platform==='win'){
   verifyWindowsIcon(installer);const seven=sevenZip();run(seven,['t',installer]);run(seven,['x',installer,'-o'+temp,'-y']);builtAsar=files(temp).find(f=>f.endsWith(path.join('resources','app.asar')));builtExe=files(temp).find(f=>path.basename(f)===name+'.exe');assert(builtAsar&&builtExe,'Installer payload');const shortcutIcon=files(temp).find(f=>path.basename(f)===`QEWE-${pkg.version}.ico`);assert(shortcutIcon&&fs.readFileSync(shortcutIcon).equals(fs.readFileSync(path.join(root,'app/qewe.ico'))),'Installed shortcut icon');const uninstaller=files(temp).find(f=>/^(?:uninstall|desinstaller)\.exe$/i.test(path.basename(f)));if(uninstaller)verifyWindowsIcon(uninstaller);
  }else if(platform==='linux'){
   assert.equal(run('dpkg-deb',['-f',installer,'Architecture']).trim(),'amd64');run('dpkg-deb',['-x',installer,temp]);builtAsar=files(path.join(temp,'opt')).find(f=>f.endsWith(path.join('resources','app.asar')));assert(builtAsar);builtExe=path.join(path.dirname(path.dirname(builtAsar)),'qewe');
   assert(files(path.join(temp,'usr/share/icons')).some(f=>f.endsWith('.png')&&fs.readFileSync(f).equals(fs.readFileSync(path.join(root,'app/qewe.png')))),'Ubuntu logo');assert(files(path.join(temp,'usr/share/applications')).some(f=>f.endsWith('.desktop')&&fs.readFileSync(f,'utf8').match(/^Icon=qewe$/m)),'Ubuntu launcher');
  }else{
   const mount=path.join(temp,'mount');fs.mkdirSync(mount);run('/usr/bin/hdiutil',['attach','-readonly','-nobrowse','-mountpoint',mount,installer]);
   try{const app=path.join(mount,name+'.app');assert(fs.readFileSync(path.join(app,'Contents/Resources/app.asar')).equals(fs.readFileSync(archive)),'DMG payload');run('/usr/bin/codesign',['--verify','--deep','--strict',app]);}finally{run('/usr/bin/hdiutil',['detach',mount]);}
  }
  if(builtAsar)assert(fs.readFileSync(builtAsar).equals(fs.readFileSync(archive)),'ASAR payload');if(builtExe)assert(fs.readFileSync(builtExe).equals(fs.readFileSync(exe)),'Executable payload');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
 const digest=hash(fs.readFileSync(installer));console.log(`PASS ${platform} ${arch}: packaged source, fuses, logo and installer payload.`);console.log(digest+'  '+path.basename(installer));fs.writeFileSync(installer+'.sha256',digest+'  '+path.basename(installer)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
