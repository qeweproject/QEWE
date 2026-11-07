const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'VENDOR_SHA256.json'),'utf8'));
for(const [file,hash] of Object.entries(manifest)){if(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash)throw Error('Vendor checksum mismatch: '+file);}
console.log('Verified vendored files:',Object.keys(manifest).length);
