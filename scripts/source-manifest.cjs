const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=path.resolve(__dirname,'..');
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hashes={};for(const p of [...files(path.join(root,'app')),path.join(root,'package-lock.json'),path.join(root,'package.json')].sort())hashes[path.relative(root,p).split(path.sep).join('/')]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
console.log(JSON.stringify({version:require('../package.json').version,commit:process.env.GITHUB_SHA||null,files:hashes},null,2));
