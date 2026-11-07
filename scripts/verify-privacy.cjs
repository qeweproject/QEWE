/* Scan first-party publishable material; third-party author credits must remain. */
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const excluded=new Set(['node_modules','.git','app/vendor']);
function files(dir,relative=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const name=relative?relative+'/'+e.name:e.name;if(excluded.has(name)||e.name==='.DS_Store')return [];return e.isDirectory()?files(path.join(dir,e.name),name):[name];});}
const rules=[/[a-z0-9._%+-]+@(?:gmail|msn|hotmail|outlook|yahoo)\.[a-z]{2,}/i,/\/(?:workspace|home\/agent|Users)\//];
const bad=[];for(const file of files(root)){if(!/\.(?:js|cjs|json|md|txt|yml|yaml|nsi|html|css)$/.test(file)||file==='scripts/verify-privacy.cjs')continue;const text=fs.readFileSync(path.join(root,file),'utf8');if(rules.some(r=>r.test(text)))bad.push(file);}
if(bad.length)throw Error('Potential private author/path metadata in: '+bad.join(', '));
console.log('Checked first-party files for personal email and absolute-path patterns. Donation-address linkability and unknown personal data require human review.');
