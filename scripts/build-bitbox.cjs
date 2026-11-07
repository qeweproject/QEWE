const esbuild=require('esbuild'),path=require('path'),fs=require('fs');const root=path.resolve(__dirname,'..');
esbuild.buildSync({entryPoints:[path.join(__dirname,'bitbox-usb-entry.js')],outfile:path.join(root,'app/vendor/bitbox-usb.js'),bundle:true,platform:'browser',format:'iife',target:'es2022',minify:true,legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'}});
console.log('Built BitBox02 WebHID client (address reads)');

// Retain full upstream license texts as well as the minified bundle's notices.
const licenses=['@bitboxswiss/bitbox-api','@noble/hashes','@noble/curves','@noble/ciphers'].map(name=>name+'\n'+fs.readFileSync(path.join(root,'node_modules',name,'LICENSE'),'utf8'));
fs.writeFileSync(path.join(root,'app/vendor/BITBOX_LICENSES.txt'),licenses.join('\n\n---\n\n')+'\n');
