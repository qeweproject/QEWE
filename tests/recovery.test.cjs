const {test}=require('node:test'),assert=require('node:assert/strict');
const {derive,InputError}=require('../app/derive.js');
const fixtures=require('./recovery-vectors.json');
function one(phrase,password='',language='auto',options={}){let info;const rows=derive(phrase,password,language,['standard'],()=>{},'',1,options,value=>info=value);return {address:rows[0].address,info};}
test('Recovery: 47 independent vectors cover ten languages, five word counts and auto detection',()=>{
  for(const v of fixtures.vectors){const result=one(v.phrase,v.password);assert.equal(result.address,v.address,v.language);assert.equal(result.info.checksum,'valid');assert(result.info.language);}
  assert.equal(new Set(fixtures.vectors.map(v=>v.language)).size,10);
});
test('Recovery: numbered clipboard, Unicode, Latin accents and unique four-letter prefixes preserve canonical addresses',()=>{
  const english=fixtures.vectors.find(v=>v.language==='en');
  const numbered=english.phrase.toUpperCase().split(' ').map((w,i)=>`${i+1}. ${w}`).join(';\n');
  assert.equal(one('\uFEFF'+numbered,english.password).address,english.address);
  const french=fixtures.vectors.find(v=>v.language==='fr');const bare=french.phrase.normalize('NFKD').replace(/\p{M}/gu,'').toUpperCase();assert.equal(one(bare,french.password).address,french.address);
  const abbreviated=english.phrase.split(' ').map(w=>w.slice(0,4)).join(' ');
  assert.equal(one(abbreviated,english.password,'en',{expandWords:true}).address,english.address);
  assert.throws(()=>one(abbreviated,english.password,'en'),e=>e.code==='UNKNOWN_WORDS');
  const chinese=fixtures.vectors.find(v=>v.language==='zh_cn');assert.equal(one(chinese.phrase.replace(/\s/gu,''),chinese.password).address,chinese.address);
});
test('Recovery: extra word is a case-sensitive passphrase and custom Ian Coleman rounds match independent PBKDF2',()=>{
  const v=fixtures.vectors[0];assert.equal(one(v.phrase+' TREZOR','','auto',{extraWord:true}).address,v.address);
  assert.notEqual(one(v.phrase+' trezor','','auto',{extraWord:true}).address,v.address);
  assert.throws(()=>one(v.phrase+' TREZOR','other','auto',{extraWord:true}),e=>e.code==='EXTRA_WORD');
  const custom=fixtures.custom;assert.equal(one(custom.phrase,custom.password,'auto',{iterations:custom.iterations}).address,custom.address);
  assert.notEqual(one(custom.phrase,custom.password).address,custom.address);
  for(const rounds of [0,1.5,1000001])assert.throws(()=>one(v.phrase,'','auto',{iterations:rounds}),e=>e.code==='ROUNDS');
});
test('Recovery: non-checksummed PBKDF2 and raw BIP32 seeds are explicit and warn, strict errors expose no secret',()=>{
  const {compat,seed}=fixtures;
  assert.throws(()=>one(compat.phrase),e=>e instanceof InputError&&e.code==='CHECKSUM'&&!e.message.includes('abandon'));
  const unchecked=one(compat.phrase,'','auto',{format:'compat'});assert.equal(unchecked.address,compat.address);assert.equal(unchecked.info.checksum,'unchecked');assert(unchecked.info.warnings.some(w=>w.includes('non validés')));
  assert.equal(one(seed.hex,'','auto',{format:'seed'}).address,seed.address);
  assert.throws(()=>one(seed.hex,'secret','auto',{format:'seed'}),e=>e.code==='SEED_OPTIONS'&&!e.message.includes('secret'));
  assert.throws(()=>one(seed.hex+'q','','auto',{format:'seed'}),e=>e.code==='SEED_HEX');
  assert.throws(()=>one('private-missing-word '+fixtures.vectors[0].phrase.split(' ').slice(1).join(' ')),e=>e.code==='UNKNOWN_WORDS'&&e.message.includes('1')&&!e.message.includes('private-missing-word'));
  assert.throws(()=>one('word '.repeat(13)),e=>e.code==='WORD_COUNT');
});
