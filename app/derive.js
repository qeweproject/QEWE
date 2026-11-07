/* Public derivation module. Never logs or persists inputs. */
(function (root) {
  const E = typeof module !== 'undefined' ? require('ethers') : root.ethers;
  const B = typeof module !== 'undefined' ? require('./address-book.js') : root.AddressBook;
  const P=typeof module!=='undefined'?require('./paths.js'):root.WalletPaths;
  const MODES=P.MODES;
  const LANGUAGES={en:'Anglais',fr:'Français',es:'Espagnol',it:'Italien',pt:'Portugais',ja:'Japonais',ko:'Coréen',zh_cn:'Chinois simplifié',zh_tw:'Chinois traditionnel',cz:'Tchèque'};
  class InputError extends Error {constructor(code,message){super(message);this.code=code;}}
  const fail=(code,message)=>{throw new InputError(code,message);};
  const fold=word=>word.normalize('NFKD').toLowerCase().replace(/\p{M}/gu,'');
  const dictionaries=new Map();
  function dictionary(lang){
    if(!dictionaries.has(lang)){
      const wl=E.wordlists[lang],words=Array.from({length:2048},(_,i)=>wl.getWord(i).normalize('NFKD'));
      const latin=['en','fr','es','it','pt','cz'].includes(lang),key=word=>latin?fold(word):word;
      const groups=new Map();for(const word of words){const k=key(word);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(word);}
      dictionaries.set(lang,{wl,words,groups,key});
    }
    return dictionaries.get(lang);
  }
  function cleanPhrase(phrase){
    return phrase.normalize('NFKD').replace(/[\u200B\uFEFF\u2060]/gu,'')
      .replace(/(^|[\s,;|])\d{1,2}[.):]\s*/gu,'$1').replace(/[,;|•]+/gu,' ').trim().replace(/\s+/gu,' ');
  }
  function resolveWords(words,lang,expand){
    const d=dictionary(lang),unknown=[],resolved=[];let changed=false,expanded=false;
    words.forEach((raw,i)=>{
      const word=raw.toLowerCase();let match=d.wl.getWordIndex(word)>=0?word:null;
      if(!match){const group=d.groups.get(d.key(word));if(group?.length===1)match=group[0];}
      if(!match&&expand&&Array.from(d.key(word)).length>=4){const matches=d.words.filter(w=>d.key(w).startsWith(d.key(word)));if(matches.length===1){match=matches[0];expanded=true;}}
      if(!match)unknown.push(i+1);resolved.push(match||word);if(match!==raw)changed=true;
    });
    const canonical=d.wl.join(resolved);return {lang,canonical,unknown,changed,expanded,valid:!unknown.length&&E.Mnemonic.isValidMnemonic(canonical,d.wl)};
  }
  function masterFromInput(phrase,password,language,options,report){
    if(typeof phrase!=='string'||!phrase.trim()||phrase.length>8192||typeof password!=='string'||password.length>2048)fail('INPUT','Saisie vide ou trop longue.');
    const format=options.format??'bip39',iterations=options.iterations??2048;
    if(!['bip39','compat','seed','xprv','private'].includes(format))fail('FORMAT','Format de récupération inconnu.');
    if(!Number.isInteger(iterations)||iterations<1||iterations>1000000)fail('ROUNDS','PBKDF2 : choisir un entier entre 1 et 1 000 000.');
    const info={format,iterations,language:'',warnings:[]};let seed;
    if(format==='xprv'||format==='private'){
      if(password||options.extraWord||options.expandWords||iterations!==2048)fail('KEY_OPTIONS','Une clé privée se lit sans passphrase, préfixes, mot supplémentaire ni réglage PBKDF2.');
      let key;try{
        if(format==='private'){const hex=phrase.trim().replace(/^0x/i,'');if(!/^[a-fA-F0-9]{64}$/.test(hex))throw Error();key=new E.Wallet('0x'+hex);}
        else{if(!phrase.trim().startsWith('xprv'))throw Error();key=E.HDNodeWallet.fromExtendedKey(phrase.trim());if(!key.privateKey)throw Error();}
      }catch{fail('PRIVATE_KEY','Clé privée invalide. Utilisez 64 caractères hexadécimaux ou une clé étendue xprv dans le format dédié.');}
      if(format==='xprv'&&key.depth!==0)fail('XPRV_ROOT','Cette clé xprv n’est pas racine. Seules les clés BIP32 racines (profondeur 0) sont acceptées pour appliquer les chemins complets.');
      info.warnings.push(format==='private'?'Clé privée brute : une seule adresse, sans dérivation. Lecture seule.':'Clé racine xprv : chemins BIP32 complets. Lecture seule.');report(info);return key;
    }
    if(format==='seed'){
      if(password||options.extraWord||iterations!==2048)fail('SEED_OPTIONS','Une seed BIP32 hexadécimale se lit sans passphrase, mot supplémentaire ni réglage PBKDF2.');
      const hex=phrase.trim().replace(/^0x/i,'');if(!/^(?:[a-fA-F0-9]{2}){16,64}$/.test(hex))fail('SEED_HEX','Seed BIP32 : 32 à 128 caractères hexadécimaux, soit 16 à 64 octets.');
      seed='0x'+hex;info.warnings.push('Seed BIP32 brute : aucun contrôle de mots BIP39.');
    }else{
      if(language!=='auto'&&!LANGUAGES[language])fail('LANGUAGE','Langue inconnue. Choisissez Détection automatique.');
      let text=format==='compat'?phrase.normalize('NFKD').trim().replace(/\s+/gu,' '):cleanPhrase(phrase);
      if(format==='bip39'&&/^[\u4E00-\u9FFF]+$/u.test(text)&&[12,15,18,21,24].includes(Array.from(text).length))text=Array.from(text).join(' ');
      let words=text.split(' ');
      if(options.extraWord){
        if(password)fail('EXTRA_WORD','Videz le champ Passphrase avant de traiter le dernier mot comme passphrase.');
        if(![13,16,19,22,25].includes(words.length))fail('EXTRA_WORD_COUNT','Dernier mot comme passphrase : attendre 13, 16, 19, 22 ou 25 mots au total.');
        password=words.pop();text=words.join(' ');info.warnings.push('Dernier mot utilisé comme passphrase séparée, avec sa casse.');
      }
      if(format==='bip39'&&![12,15,18,21,24].includes(words.length))fail('WORD_COUNT',`Nombre de mots incorrect : ${words.length}. BIP39 attend 12, 15, 18, 21 ou 24 mots. Si le dernier est une passphrase, activez l’option dédiée.`);
      if(format==='bip39'){
        const candidates=(language==='auto'?Object.keys(LANGUAGES):[language]).map(lang=>resolveWords(words,lang,options.expandWords===true));
        const valid=candidates.filter(c=>c.valid);
        if(!valid.length){
          if(candidates.some(c=>!c.unknown.length))fail('CHECKSUM','Mots reconnus, mais checksum BIP39 invalide. Vérifiez l’ordre et la transcription ; le mode PBKDF2 de compatibilité permet une lecture explicitement non validée.');
          const best=candidates.reduce((a,b)=>a.unknown.length<=b.unknown.length?a:b);
          fail('UNKNOWN_WORDS',`Mot(s) non reconnu(s), position(s) ${best.unknown.slice(0,12).join(', ')}${best.unknown.length>12?'…':''}. Vérifiez la langue, les mots complets ou activez les préfixes de 4 lettres.`);
        }
        const distinct=new Set(valid.map(c=>c.canonical.normalize('NFKD')));if(distinct.size>1)fail('AMBIGUOUS_LANGUAGE','Plusieurs langues donnent des phrases valides différentes. Choisissez la langue explicitement.');
        const chosen=valid[0];text=E.Mnemonic.fromPhrase(chosen.canonical,'',E.wordlists[chosen.lang]).phrase;
        info.language=valid.map(c=>LANGUAGES[c.lang]).join(' / ');info.checksum='valid';
        if(chosen.changed||text.normalize('NFKD')!==phrase.normalize('NFKD'))info.warnings.push('Mise en forme et orthographe canonique BIP39 normalisées.');
        if(chosen.expanded)info.warnings.push('Préfixes uniques complétés en mots entiers.');
      }else{
        info.checksum='unchecked';info.warnings.push('Compatibilité PBKDF2 : mots et checksum non validés. Des adresses générées ne prouvent pas que la phrase est correcte. Casse et ponctuation conservées ; espaces normalisés.');
      }
      if(iterations!==2048)info.warnings.push(`PBKDF2 personnalisé : ${iterations} itérations. Ce paramètre doit être identique à celui d’origine.`);
      seed=E.pbkdf2(E.toUtf8Bytes(text,'NFKD'),E.toUtf8Bytes('mnemonic'+password,'NFKD'),iterations,64,'sha512');text='';words=[];
    }
    const master=E.HDNodeWallet.fromSeed(seed);seed='';report(info);return master;
  }
  function derive(phrase, password, language, modes, progress=()=>{},custom='',limit=25,options={},report=()=>{}) {
    if(!Number.isInteger(limit)||limit<1||limit>10000)fail('LIMIT','Nombre d’adresses : entier entre 1 et 10000.');
    if(options.format==='private'){const key=masterFromInput(phrase,password,language,options,report);return B.normalizeRows([{address:key.address,mode:'Clé privée · lecture seule',index:0,path:''}]);}
    if (!Array.isArray(modes) || (!modes.length&&!custom) || modes.some(x=>!MODES[x])) fail('MODES','Sélectionnez au moins un chemin de dérivation valide.');
    if(custom)try{P.validateTemplate(custom);}catch(error){fail('PATH',error.message);}
    // Only this short-lived worker owns the seed and private HD nodes.
    let master = masterFromInput(phrase,password,language,options,report);
    phrase=''; password='';
    const rows=[];
    for (const mode of modes) {
      for(let i=0;i<limit;i++) {
        const path=MODES[mode].path(i);
        rows.push({mode:MODES[mode].name,index:i,path,address:master.derivePath(path).address});
        if(i%10===0) progress(rows.length);
      }
    }
    if(custom)for(let i=0;i<limit;i++){
      const path=custom.replace('{i}',String(i));
      rows.push({mode:'MEW personnalisé',index:i,path,address:master.derivePath(path).address});
      if(i%10===0)progress(rows.length);
    }
    master=null;
    return B.normalizeRows(rows);
  }
  function signOffline(phrase,password,language,options,plan){
    if(!options||!['bip39','xprv','private'].includes(options.format)||(options.iterations??2048)!==2048||options.extraWord||options.expandWords)fail('SIGN_FORMAT','Signature locale : BIP39 standard, xprv racine ou clé privée uniquement.');
    const C=typeof module!=='undefined'?require('./transfer-codec.js'):root.TransferCodec;const decoded=C.validatePlan(plan);
    let key=masterFromInput(phrase,password,language,options,()=>{});phrase='';password='';
    if(options.format!=='private')key=key.derivePath(plan.path);
    if(key.address!==decoded.from){key=null;fail('WRONG_SIGNER','La seed phrase ou la clé ne correspond pas à l’adresse et au chemin choisis.');}
    const signed=C.signed(plan,key.signingKey.sign(E.keccak256(plan.unsigned)));key=null;return signed;
  }
  const api={derive,signOffline,MODES,InputError};
  if(typeof module!=='undefined') module.exports=api; else root.Derivation=api;
})(globalThis);
