import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import {Buffer} from 'buffer';
globalThis.LedgerUsb={
 async connect(signal){
  const transport=await TransportWebHID.request();transport.setScrambleKey('w0w');let broken=false;
  const interruptible=async(operation,timeout=30000)=>{
   let timer,onAbort,onDisconnect;
   const interrupted=new Promise((_,reject)=>{
    const fail=name=>{const error=new Error(name);error.name=name;reject(error);};
    onAbort=()=>fail('AbortError');onDisconnect=()=>fail('DisconnectedDevice');
    signal?.addEventListener('abort',onAbort,{once:true});transport.on('disconnect',onDisconnect);
    timer=setTimeout(()=>fail('LedgerReadTimeout'),timeout);
    if(signal?.aborted)onAbort();
   });
   try{return await Promise.race([interrupted,Promise.resolve().then(()=>{signal?.throwIfAborted();return operation();})]);}catch(e){broken=true;throw e;}
   finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);transport.off('disconnect',onDisconnect);}
  };
  return {
   readAddress:path=>interruptible(()=>globalThis.LedgerCore.readAddress((cla,ins,p1,p2,data)=>transport.send(cla,ins,p1,p2,Buffer.from(data)),path)),
   signTransfer:plan=>interruptible(()=>globalThis.LedgerCore.signTransfer((cla,ins,p1,p2,data)=>transport.send(cla,ins,p1,p2,Buffer.from(data)),plan),180000),
   close:async()=>{if(broken){transport.device.removeEventListener('inputreport',transport.onInputReport);await transport.device.close();}else await transport.close();}
  };
 }
};
