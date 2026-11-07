/* WebUSB glue for Trezor Model T / Safe 3 / Safe 5 (interface 0, endpoint 1). Address reads only. */
(function (root) {
  root.TrezorUsb = {
    async connect(signal) {
      if (!navigator.usb) throw Object.assign(Error('WebUSB indisponible.'), { name: 'NotFoundError' });
      signal?.throwIfAborted();
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: TrezorCore.VENDOR, productId: TrezorCore.PRODUCT }] });
      let closed = false;
      const close = async () => { if (closed) return; closed = true; try { await device.releaseInterface(0); } catch {} try { await device.close(); } catch {} };
      try{signal?.throwIfAborted();await device.open();signal?.throwIfAborted();if(device.configuration===null)await device.selectConfiguration(1);await device.claimInterface(0);signal?.throwIfAborted();}catch(error){await close();throw error;}
      const io = {
        write: async (packet) => { const r = await device.transferOut(1, packet); if (r.status !== 'ok' || r.bytesWritten !== packet.length) throw Object.assign(Error('USB'), { name: 'NetworkError' }); },
        read: async () => { const r = await device.transferIn(1, 64); if (r.status !== 'ok' || !r.data) throw Object.assign(Error('USB'), { name: 'NetworkError' }); return new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength); },
      };
      // Abort or timeout closes the device, which also rejects a pending transfer.
      const guarded = (operation, timeout) => new Promise((resolve, reject) => {
        const fail = (name) => { cleanup(); close(); reject(Object.assign(Error(name), { name })); };
        const onAbort = () => fail('AbortError'), timer = setTimeout(() => fail('LedgerReadTimeout'), timeout);
        const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); };
        if (signal?.aborted) return onAbort();
        if(closed){cleanup();return reject(Object.assign(Error('Disconnected'),{name:'DisconnectedDevice'}));}
        signal?.addEventListener('abort', onAbort, { once: true });
        operation().then((v) => { cleanup(); resolve(v); }, (e) => { cleanup(); reject(e); });
      });
      try { await guarded(() => TrezorCore.initialize(io), 120000); } catch (e) { await close(); throw e; }
      // First address may wait for PIN/passphrase on the device: generous timeout, then normal.
      let first = true;
      return {
        readAddress: (path) => { const t = first ? 180000 : 30000; first = false; return guarded(() => TrezorCore.readAddress(io, path), t); },
        close,
      };
    },
  };
})(globalThis);
