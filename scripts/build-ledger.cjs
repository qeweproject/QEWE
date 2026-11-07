const esbuild=require('esbuild'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
esbuild.buildSync({entryPoints:[path.join(__dirname,'ledger-usb-entry.js')],outfile:path.join(root,'app/vendor/ledger-usb.js'),inject:[path.join(__dirname,'ledger-buffer.js')],bundle:true,platform:'browser',format:'iife',minify:true,legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'}});
console.log('Built Ledger WebHID transport (addresses and explicit transfers)');
