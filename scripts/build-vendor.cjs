/* Recreate cryptographic browser files from the integrity-checked npm install. */
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
fs.copyFileSync(path.join(root,'node_modules/ethers/dist/ethers.umd.min.js'),path.join(root,'app/vendor/ethers.umd.min.js'));
let source=fs.readFileSync(path.join(root,'node_modules/ethers/dist/wordlists-extra.min.js'),'utf8');
const exportLine=/export\{LangCz,LangEs,LangFr,LangIt,LangJa,LangKo,LangPt,LangZh\};\s*$/;
if(!exportLine.test(source))throw Error('Unexpected upstream wordlist export. Review before upgrading ethers.');
source=source.replace(exportLine,'');
const register="Object.assign(globalThis.ethers.wordlists,{cz:LangCz.wordlist(),es:LangEs.wordlist(),fr:LangFr.wordlist(),it:LangIt.wordlist(),pt:LangPt.wordlist(),ja:LangJa.wordlist(),ko:LangKo.wordlist(),zh_cn:LangZh.wordlist('cn'),zh_tw:LangZh.wordlist('tw')});";
fs.writeFileSync(path.join(root,'app/vendor/wordlists-extra.js'),'(function(){'+source+register+'\n})();\n');
console.log('Rebuilt ethers and wordlists from pinned upstream package.');
