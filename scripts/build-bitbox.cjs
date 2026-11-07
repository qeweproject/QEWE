const esbuild=require('esbuild'),path=require('path');const root=path.resolve(__dirname,'..');
esbuild.buildSync({entryPoints:[path.join(__dirname,'bitbox-usb-entry.js')],outfile:path.join(root,'app/vendor/bitbox-usb.js'),bundle:true,platform:'browser',format:'iife',target:'es2022',minify:true,legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'}});
console.log('Built BitBox02 WebHID client (address reads)');
