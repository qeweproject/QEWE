/* Trezor "Codec v1" over WebUSB (Model T, Safe 3, Safe 5): public Ethereum address reads only.
   Minimal protobuf for Initialize, EthereumGetAddress and the interaction messages. No signing.
   Message numbers and fields: trezor-firmware common/protob/messages*.proto. */
(function (root) {
  const P = typeof module !== 'undefined' ? require('./paths.js') : root.WalletPaths;
  const E = typeof module !== 'undefined' ? require('ethers') : root.ethers;
  const MSG = { Initialize: 0, Success: 2, Failure: 3, Features: 17, PinMatrixRequest: 18, Cancel: 20, ButtonRequest: 26, ButtonAck: 27, PassphraseRequest: 41, PassphraseAck: 42, EthereumGetAddress: 56, EthereumAddress: 57 };
  const VENDOR = 0x1209, PRODUCT = 0x53c1, PACKET = 64, MAX_MESSAGE = 1 << 16;

  function varint(n) { const out = []; n = BigInt(n); do { let b = Number(n & 0x7fn); n >>= 7n; if (n) b |= 0x80; out.push(b); } while (n); return out; }
  function encodeGetAddress(path) {
    const bytes = [];
    for (const n of P.indexes(path)) bytes.push(0x08, ...varint(n)); // repeated uint32 address_n = 1 (not packed)
    return Uint8Array.from(bytes); // show_display omitted = false
  }
  function encodePassphraseAck() { return Uint8Array.from([0x18, 0x01]); } // on_device = 3: passphrase typed on the Trezor only
  /* Parse a protobuf message into {field: [values]} (varint as BigInt, length-delimited as Uint8Array). */
  function parse(bytes) {
    const out = {}; let i = 0;
    const read = () => { let shift = 0n, v = 0n, b; do { if (i >= bytes.length || shift > 63n) throw Error('Réponse Trezor invalide.'); b = bytes[i++]; v |= BigInt(b & 0x7f) << shift; shift += 7n; } while (b & 0x80); return v; };
    while (i < bytes.length) {
      const key = read(), field = Number(key >> 3n), type = Number(key & 7n); let value;
      if (type === 0) value = read();
      else if (type === 2) { const len = Number(read()); if (i + len > bytes.length) throw Error('Réponse Trezor invalide.'); value = bytes.slice(i, i + len); i += len; }
      else if (type === 5) { i += 4; continue; } else if (type === 1) { i += 8; continue; }
      else throw Error('Réponse Trezor invalide.');
      (out[field] ||= []).push(value);
    }
    return out;
  }
  const text = (b) => new TextDecoder('utf-8', { fatal: true }).decode(b);
  /* Codec v1 framing: "?##" + type(u16 BE) + length(u32 BE) + payload, then "?" + 63-byte continuations. */
  function frame(type, payload) {
    const header = new Uint8Array(8 + payload.length), view = new DataView(header.buffer);
    header.set([0x23, 0x23]); view.setUint16(2, type); view.setUint32(4, payload.length); header.set(payload, 8);
    const packets = [];
    for (let i = 0; i < header.length || i === 0; i += PACKET - 1) { const p = new Uint8Array(PACKET); p[0] = 0x3f; p.set(header.slice(i, i + PACKET - 1), 1); packets.push(p); }
    return packets;
  }
  async function receive(readPacket) {
    const first = await readPacket();
    if (first.length < 9 || first[0] !== 0x3f || first[1] !== 0x23 || first[2] !== 0x23) throw Error('Réponse Trezor invalide.');
    const view = new DataView(first.buffer, first.byteOffset, first.byteLength), type = view.getUint16(3), length = view.getUint32(5);
    if (length > MAX_MESSAGE) throw Error('Réponse Trezor trop volumineuse.');
    const data = new Uint8Array(length); data.set(first.slice(9, 9 + length));
    let filled = Math.min(length, first.length - 9);
    while (filled < length) { const p = await readPacket(); if (p[0] !== 0x3f) throw Error('Réponse Trezor invalide.'); const chunk = p.slice(1, 1 + length - filled); data.set(chunk, filled); filled += chunk.length; }
    return { type, data };
  }
  class TrezorError extends Error { constructor(message, code) { super(message); this.name = 'TrezorError'; this.code = code; } }
  /* One request/response exchange, answering device-side interaction requests. */
  async function call(io, type, payload, expected) {
    let next = [type, payload];
    for (let round = 0; round < 8; round++) {
      for (const packet of frame(...next)) await io.write(packet);
      const reply = await receive(io.read);
      if (reply.type === expected) return parse(reply.data);
      if (reply.type === MSG.ButtonRequest) { next = [MSG.ButtonAck, new Uint8Array(0)]; continue; }
      if (reply.type === MSG.PassphraseRequest) { next = [MSG.PassphraseAck, encodePassphraseAck()]; continue; }
      if (reply.type === MSG.PinMatrixRequest) throw new TrezorError('Ce Trezor demande le PIN sur l’ordinateur (Model One) : modèle non pris en charge. Utilisez un Trezor Model T, Safe 3 ou Safe 5.', 'PIN_MATRIX');
      if (reply.type === MSG.Failure) { const f = parse(reply.data); let message = ''; try { message = f[2] ? text(f[2][0]).slice(0, 200) : ''; } catch {} throw new TrezorError(message || 'Le Trezor a refusé la demande.', Number(f[1]?.[0] ?? 0)); }
      throw new TrezorError('Réponse Trezor inattendue.', 'UNEXPECTED');
    }
    throw new TrezorError('Trop d’échanges avec le Trezor.', 'LOOP');
  }
  async function initialize(io) { const features = await call(io, MSG.Initialize, new Uint8Array(0), MSG.Features); let label = ''; try { label = features[10] ? text(features[10][0]).slice(0, 40) : ''; } catch {} return { label }; }
  async function readAddress(io, path) {
    const reply = await call(io, MSG.EthereumGetAddress, encodeGetAddress(path), MSG.EthereumAddress);
    let address;
    if (reply[2]) address = text(reply[2][0]);
    else if (reply[1] && reply[1][0].length === 20) address = E.hexlify(reply[1][0]); // firmware < 2.1 raw bytes
    if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address)) throw new TrezorError('Adresse Trezor illisible.', 'ADDRESS');
    return E.getAddress(address);
  }
  function explain(error) {
    if (error?.code === 'PIN_MATRIX') return error.message;
    if (/NotFound|NotAllowed|AbortError/.test(error?.name || '') || /No device selected/i.test(error?.message || '')) return 'Connexion annulée ou aucun appareil autorisé.';
    if (error?.name === 'TrezorError' && !['UNEXPECTED', 'LOOP', 'ADDRESS'].includes(error.code)) return 'Trezor : ' + error.message;
    return 'Lecture Trezor impossible. Fermez Trezor Suite, déverrouillez le Trezor et réessayez.';
  }
  const api = { MSG, VENDOR, PRODUCT, encodeGetAddress, encodePassphraseAck, parse, frame, receive, call, initialize, readAddress, explain, TrezorError, varint };
  if (typeof module !== 'undefined') module.exports = api;
  else root.TrezorCore = api;
})(globalThis);
