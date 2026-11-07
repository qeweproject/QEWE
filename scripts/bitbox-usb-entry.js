// Bundled by scripts/build-bitbox.cjs into app/vendor/bitbox-usb.js.
// Official BitBoxSwiss pure-TypeScript library (no WASM). WebHID only: the BitBoxBridge
// fallback would need a localhost connection, which QEWE's renderer cannot make.
import * as bitbox from '@bitboxswiss/bitbox-api';

globalThis.BitBoxUsb = {
  async connect(signal, onPairingCode = () => {}) {
    let open = true;
    const device = await bitbox.bitbox02ConnectWebHID(() => { open = false; });
    let paired = null;
    const abort = () => { try { (paired || device).close(); } catch {} };
    signal?.addEventListener('abort', abort, { once: true });
    try {
      const pairing = await device.unlockAndPair();
      const code = pairing.getPairingCode();
      if (code) onPairingCode(code);
      paired = await pairing.waitConfirm();
      onPairingCode(null);
      signal?.throwIfAborted();
      if (!paired.ethSupported()) throw Object.assign(Error('Ce BitBox02 ne prend pas en charge Ethereum (édition Bitcoin uniquement).'), { name: 'BitBoxError' });
    } catch (e) {
      onPairingCode(null);
      signal?.removeEventListener('abort', abort);
      try { (paired || device).close(); } catch {}
      throw e;
    }
    return {
      readAddress: async (path) => {
        signal?.throwIfAborted();
        if (!open) throw Object.assign(Error('Disconnected'), { name: 'DisconnectedDevice' });
        return paired.ethAddress(1n, path, false);
      },
      close: async () => { signal?.removeEventListener('abort', abort); try { paired.close(); } catch {} },
    };
  },
};
