/* Bound untrusted HTTP bodies while streaming, before JSON/ABI decoding. */
async function readText(response,limit){
 if(!Number.isSafeInteger(limit)||limit<1)throw Error('Invalid response limit.');
 const declared=response.headers?.get?.('content-length');
 if(declared&&/^\d+$/.test(declared)&&BigInt(declared)>BigInt(limit)){void response.body?.cancel?.().catch(()=>{});throw Error('Réponse trop volumineuse.');}
 if(!response.body?.getReader){const value=await response.text();if(typeof value!=='string'||new TextEncoder().encode(value).byteLength>limit)throw Error('Réponse trop volumineuse.');return value;}
 const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true});let size=0,value='';
 try{while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>limit)throw Error('Réponse trop volumineuse.');value+=decoder.decode(chunk.value,{stream:true});}return value+decoder.decode();}
 catch(error){void reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
}
module.exports={readText};
