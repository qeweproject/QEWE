// Bundled by scripts/build-bitbox.cjs into app/vendor/bitbox-usb.js.
// Official BitBoxSwiss pure-TypeScript library (no WASM). WebHID only: the BitBoxBridge
// fallback would need a localhost connection, which QEWE's renderer cannot make.
import * as bitbox from '@bitboxswiss/bitbox-api';

globalThis.BitBoxUsb = {
  async connect(signal, onPairingCode = () => {}) {
    let device=null,paired=null,open=true,closed=false;
    const close=()=>{if(closed)return;closed=true;open=false;try{Promise.resolve((paired||device)?.close()).catch(()=>{});}catch{}};
    const cancelled=()=>Object.assign(Error('Connection cancelled'),{name:'AbortError'});
    // Even a late device selection is closed after cancellation; never start pairing on it.
    const guard=(operation,timeout)=>new Promise((resolve,reject)=>{
      let settled=false;
      const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
      const fail=error=>{if(settled)return;settled=true;cleanup();close();reject(error);};
      const abort=()=>fail(cancelled()),timer=setTimeout(()=>fail(Object.assign(Error('Hardware timeout'),{name:'AbortError'})),timeout);
      if(signal?.aborted)return abort();
      signal?.addEventListener('abort',abort,{once:true});
      Promise.resolve().then(()=>{if(settled)throw cancelled();return operation();}).then(value=>{if(settled)return;settled=true;cleanup();resolve(value);},fail);
    });
    try{
      await guard(async()=>{
        device=await bitbox.bitbox02ConnectWebHID(()=>{open=false;});
        if(closed||signal?.aborted){try{await device.close();}catch{}throw cancelled();}
        const pairing=await device.unlockAndPair();
        if(closed||signal?.aborted)throw cancelled();
        const code=pairing.getPairingCode();
        if(code){if(typeof code!=='string'||code.length>256)throw Error('Invalid pairing code');onPairingCode(code);}
        paired=await pairing.waitConfirm();
        if(closed||signal?.aborted){try{await paired.close();}catch{}throw cancelled();}
        if(!paired.ethSupported())throw Object.assign(Error('Ce BitBox02 ne prend pas en charge Ethereum (édition Bitcoin uniquement).'),{name:'BitBoxError'});
      },180000);
    }catch(error){close();throw error;}finally{onPairingCode(null);}
    return {
      readAddress:async path=>{if(!open||closed)throw Object.assign(Error('Disconnected'),{name:'DisconnectedDevice'});return guard(()=>paired.ethAddress(1n,path,false),30000);},
      close:async()=>close()
    };
  }
};
