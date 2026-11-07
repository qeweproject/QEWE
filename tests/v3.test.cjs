const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),E=require('ethers');
const {derive}=require('../app/derive.js'),P=require('../app/paths.js'),B=require('../app/address-book.js'),{Preferences}=require('../app/preferences.cjs'),L=require('../app/languages.js');
const phrase='test test test test test test test test test test test junk';
test('QEWE defaults to 25; software and Ledger plans accept 10000 and preserve final index through exports',()=>{
 assert.equal(derive(phrase,'','en',['standard']).length,25);assert.equal(P.plan(['standard']).length,25);
 const rows=derive(phrase,'','en',['standard'],()=>{},'',10000),plan=P.plan(['standard'],'',10000);assert.equal(rows.length,10000);assert.equal(rows.at(-1).index,9999);assert.equal(rows.at(-1).path,plan.at(-1).path);assert.equal(rows.at(-1).address,E.HDNodeWallet.fromPhrase(phrase,'',plan.at(-1).path).address);
 const restored=B.normalizeRows(JSON.parse(JSON.stringify(rows)));assert.equal(restored.at(-1).index,9999);assert.equal(restored.at(-1).address,rows.at(-1).address);
 const four=P.plan(['live','legacy','standard'],"m/44'/60'/1'/0/{i}",10000);assert.equal(four.reduce((n,r)=>n+r.aliases.length,0),40000);assert.equal(four.length,39998);
 for(const bad of [0,10001,1.5,NaN])assert.throws(()=>P.plan(['standard'],'',bad));assert.throws(()=>B.normalizeRows(Array(40001).fill(rows[0])));
});
test('English is the initial and migrated language; all 20 language choices persist with token preferences retained',async()=>{
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'qewe-languages-'));try{const prefs=new Preferences(temp);await prefs.load();assert.equal(prefs.lang,'en');assert.equal(L.codes.length,20);assert.equal(new Set(L.codes).size,20);
 await fs.writeFile(prefs.file,JSON.stringify({lang:'fr',scanDisabled:[prefs.state().tokens[0].address],custom:[]}));await prefs.load();assert.equal(prefs.lang,'en');assert.equal(prefs.state().tokens[0].scan,false);
 for(const lang of L.codes){await prefs.language(lang);const second=new Preferences(temp);await second.load();assert.equal(second.lang,lang);assert.equal(second.state().tokens[0].scan,false);}
 }finally{await fs.rm(temp,{recursive:true,force:true});}
});
