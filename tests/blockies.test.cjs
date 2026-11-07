const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
test('Blockies: deterministic SVG icons survive cache resets without canvas, network or randomness',()=>{
 const math=Object.create(Math);math.random=()=>assert.fail('Unexpected randomness');const c=vm.createContext({document:{createElement:()=>assert.fail('Canvas must not be used')},Math:math,fetch:()=>assert.fail('Unexpected network')});c.window=c;
 for(const f of ['vendor/ethereum-blockies.js','blockies.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../app',f),'utf8'),c);
 let count=0;const render=c.blockies.render;c.blockies.render=(...args)=>{count++;return render(...args);};
 const address='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',first=c.Blockies.dataUri(address);assert(first.startsWith('data:image/svg+xml;'));assert.equal(c.Blockies.dataUri(address.toLowerCase()),first);assert.equal(count,1);assert.notEqual(c.Blockies.dataUri('0x000000000000000000000000000000000000dEaD'),first);assert.throws(()=>c.Blockies.dataUri('secret words'));c.Blockies.clear();assert.equal(c.Blockies.dataUri(address),first);assert.equal(count,3);
 const svg=decodeURIComponent(first.slice(first.indexOf(',')+1));assert(svg.includes('width="32" height="32"'));assert(svg.includes('<rect'));assert(!svg.includes('<script'));
});
