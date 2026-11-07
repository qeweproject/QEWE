/* Use the reviewed, already signed descriptors. No network/dependency import. */
const fs=require('node:fs'),path=require('node:path'),E=require('ethers'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),file=path.join(root,'app/vendor/ledger-tokens.json'),raw=fs.readFileSync(file),tokens=JSON.parse(raw);
for(const [key,t] of Object.entries(tokens)){
 const b=E.getBytes('0x'+t.blob),n=b[0];
 if(E.getAddress(t.address).toLowerCase()!==key||t.chainId!==1||!Number.isInteger(t.decimals)||t.decimals<0||t.decimals>36||n<1||n>24||Buffer.from(b.slice(1,1+n)).toString('ascii')!==t.symbol||E.hexlify(b.slice(1+n,21+n))!==key||new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(21+n)!==t.decimals||new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(25+n)!==1)throw Error('Invalid Ledger signed descriptor.');
}
fs.writeFileSync(path.join(root,'app/vendor/ledger-tokens.js'),'/* Ledger signed token descriptors; no network access. */\nglobalThis.LedgerTokens='+JSON.stringify(tokens)+';\n');
console.log('Validated pinned descriptors',Object.keys(tokens).length,crypto.createHash('sha256').update(raw).digest('hex'));
