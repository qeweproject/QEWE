'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),version=require('../package.json').version,tag=process.env.RELEASE_TAG;
assert(/^v\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(tag)&&tag==='v'+version,'Tag must exactly match package version');
assert(/^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA||''),'Exact source commit required');
const out=path.join(root,'release-files'),incoming=path.join(root,'downloaded-installers');fs.mkdirSync(out,{recursive:true});
const matrix=[['win','x64','Windows_x64_Setup.exe'],['linux','x64','Ubuntu_amd64.deb'],['mac','arm64','macOS_arm64.dmg'],['mac','x64','macOS_x64.dmg']];
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');let source;
for(const [platform,arch,suffix] of matrix){
 const directory=path.join(incoming,`qewe-${platform}-${arch}`),name=`QEWE_${version}_${suffix}`,bytes=fs.readFileSync(path.join(directory,name));assert(bytes.length>1048576,'Unexpected installer size');
 assert.equal(fs.readFileSync(path.join(directory,name+'.sha256'),'utf8').trim(),hash(bytes)+'  '+name,'Native payload checksum');
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'SOURCE_SHA256.json'),'utf8'));assert.equal(manifest.version,version);assert.equal(manifest.commit,process.env.GITHUB_SHA);
 if(source)assert.deepEqual(manifest.files,source.files,'Platform source manifests must agree');else source=manifest;
 fs.writeFileSync(path.join(out,name),bytes);
}
fs.writeFileSync(path.join(out,'SOURCE_SHA256.json'),JSON.stringify(source,null,2)+'\n');
for(const name of ['SECURITY.md','RELEASE_NOTES.md'])fs.copyFileSync(path.join(root,name),path.join(out,name));
assert(fs.existsSync(path.join(out,'SBOM.cdx.json')),'Dependency SBOM required');
const sbom=JSON.parse(fs.readFileSync(path.join(out,'SBOM.cdx.json'),'utf8'));assert.equal(sbom.bomFormat,'CycloneDX');assert(sbom.components?.length>0);
const assets=fs.readdirSync(out).filter(n=>n!=='SHA256SUMS.txt'&&n!=='RELEASE_MANIFEST.json').sort().map(name=>{const bytes=fs.readFileSync(path.join(out,name));return {name,size:bytes.length,sha256:hash(bytes)};});
fs.writeFileSync(path.join(out,'RELEASE_MANIFEST.json'),JSON.stringify({version,tag,sourceCommit:process.env.GITHUB_SHA,repository:'qeweproject/QEWE',workflow:'.github/workflows/release.yml',runId:process.env.GITHUB_RUN_ID||null,experimental:true,assets},null,2)+'\n');
const names=[...assets.map(a=>a.name),'RELEASE_MANIFEST.json'].sort();
fs.writeFileSync(path.join(out,'SHA256SUMS.txt'),names.map(n=>hash(fs.readFileSync(path.join(out,n)))+'  '+n).join('\n')+'\n');
console.log('Collected four verified installers with matching source manifests, dependency SBOM and checksums.');
