/* Verify the actual packaged payload, not just build configuration.
   Usage: node scripts/verify-release.cjs [win|linux|mac]   (default: win) */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),asar=require('@electron/asar'),{getCurrentFuseWire,FuseV1Options}=require('@electron/fuses');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../deliverables'),pkg=require('../package.json'),name=pkg.build.productName,platform=process.argv[2]||'win';
const layouts={
  win:{archive:'win-unpacked/resources/app.asar',exe:`win-unpacked/${name}.exe`,installer:`Quick_Ethereum_Wallet_Explorer_Installation_Win11_${pkg.version}.exe`,magic:Buffer.from('MZ'),headerDigest:true},
  linux:{archive:'linux-unpacked/resources/app.asar',exe:`linux-unpacked/${pkg.build.linux?.executableName||'qewe'}`,installer:new RegExp(`^Quick_Ethereum_Wallet_Explorer_Linux_${pkg.version.replace(/\./g,'\\.')}_.+\\.AppImage$`),magic:Buffer.from([0x7f,0x45,0x4c,0x46]),headerDigest:false},
  mac:{archive:`mac-arm64/${name}.app/Contents/Resources/app.asar`,exe:`mac-arm64/${name}.app/Contents/MacOS/${name}`,installer:new RegExp(`^Quick_Ethereum_Wallet_Explorer_macOS_${pkg.version.replace(/\./g,'\\.')}_arm64\\.dmg$`),magic:null,headerDigest:false}
};
const layout=layouts[platform];if(!layout)throw Error('Unknown platform: '+platform);
const archive=path.join(out,layout.archive),exe=path.join(out,layout.exe),installer=layout.installer instanceof RegExp?path.join(out,fs.readdirSync(out).find(f=>layout.installer.test(f))||'missing-installer'):path.join(out,layout.installer);
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
(async()=>{
  for(const file of [...files(path.join(root,'app')),...['LICENSE','THIRD_PARTY_NOTICES.md','SECURITY.md','LISEZMOI.txt','VALIDATION.txt'].map(x=>path.join(root,x))]){
    const relative=path.relative(root,file).split(path.sep).join('/');
    assert(asar.extractFile(archive,relative).equals(fs.readFileSync(file)),relative);
  }
  const built=JSON.parse(asar.extractFile(archive,'package.json'));assert.equal(built.version,pkg.version);
  if(layout.headerDigest){
    // Windows embeds the ASAR header digest in the executable; macOS stores it in Info.plist.
    const headerHash=crypto.createHash('sha256').update(asar.getRawHeader(archive).headerString).digest('hex'),exeBytes=fs.readFileSync(exe);
    assert(exeBytes.includes(Buffer.from(headerHash))||exeBytes.includes(Buffer.from(headerHash,'utf16le')),'Embedded ASAR header digest');
  }
  if(platform==='mac'){
    const plist=fs.readFileSync(path.join(out,`mac-arm64/${name}.app/Contents/Info.plist`),'utf8');
    assert(plist.includes('ElectronAsarIntegrity'),'ASAR integrity entry in Info.plist');
  }
  const wire=await getCurrentFuseWire(exe);
  for(const [key,value] of Object.entries(pkg.build.electronFuses)){const option=key[0].toUpperCase()+key.slice(1);assert.equal(wire[FuseV1Options[option]],value?49:48,'Fuse '+key);}
  const bytes=fs.readFileSync(installer);
  if(layout.magic)assert(bytes.subarray(0,layout.magic.length).equals(layout.magic),'Installer format');
  const sha=crypto.createHash('sha256').update(bytes).digest('hex');
  console.log(`Verified ${platform} app ASAR matches source and runtime fuses.`);
  console.log(sha+'  '+path.basename(installer));
})().catch(e=>{console.error(e);process.exitCode=1;});
