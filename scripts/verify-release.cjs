/* Verify the actual packaged Windows payload, not just build configuration. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),asar=require('@electron/asar'),{getCurrentFuseWire,FuseV1Options}=require('@electron/fuses');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../deliverables'),pkg=require('../package.json'),name=pkg.build.productName,archive=path.join(out,'win-unpacked/resources/app.asar'),exe=path.join(out,'win-unpacked',name+'.exe'),installer=path.join(out,`Quick_Ethereum_Wallet_Explorer_Installation_Win11_${pkg.version}.exe`);
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
(async()=>{
 for(const file of [...files(path.join(root,'app')),...['LICENSE','THIRD_PARTY_NOTICES.md','SECURITY.md','LISEZMOI.txt','VALIDATION.txt'].map(x=>path.join(root,x))]){const relative=path.relative(root,file).split(path.sep).join('/');assert(asar.extractFile(archive,relative).equals(fs.readFileSync(file)),relative);}
 const built=JSON.parse(asar.extractFile(archive,'package.json'));assert.equal(built.version,pkg.version);
 const rawHeader=asar.getRawHeader(archive).headerString,headerHash=crypto.createHash('sha256').update(rawHeader).digest('hex'),exeBytes=fs.readFileSync(exe);assert(exeBytes.includes(Buffer.from(headerHash))||exeBytes.includes(Buffer.from(headerHash,'utf16le')),'Embedded ASAR header digest');
 const wire=await getCurrentFuseWire(exe);for(const [key,value] of Object.entries(pkg.build.electronFuses)){const option=key[0].toUpperCase()+key.slice(1);assert.equal(wire[FuseV1Options[option]],value?49:48,'Fuse '+key);}
 assert.equal(fs.readFileSync(installer).subarray(0,2).toString(),'MZ');
 const sha=crypto.createHash('sha256').update(fs.readFileSync(installer)).digest('hex');console.log('Verified app ASAR matches source, runtime fuses and Windows installer.');console.log(sha+'  '+path.basename(installer));
})().catch(e=>{console.error(e);process.exitCode=1;});
