# Third-party code and data

The root MIT license covers original QEWE code. Upstream copyright notices and
licenses remain in `app/vendor`. Do not remove those authors' names when
publishing under a pseudonym.

- ethers 6.17.0 and its wordlists: MIT, `ETHERS_LICENSE.md`. Browser files are
  rebuilt from the integrity-pinned npm package by `scripts/build-vendor.cjs`.
- Ledger WebHID transport and dependencies: see `LEDGER_LICENSES.txt` and
  `ledger-usb.js.LEGAL.txt`. The browser transport is rebuilt from pinned npm.
- Ledger Ethereum signed token descriptors: `LEDGER_TOKEN_LICENSE.txt`, MIT.
  The reviewed JSON dataset was extracted from
  `@ledgerhq/cryptoassets-evm-signatures` 13.7.1. That package and its Axios
  dependency are no longer installed or executed by this project. The build
  validates descriptor fields and regenerates JavaScript from that fixed JSON;
  signature authenticity is checked by the Ledger Ethereum application when
  the descriptor is supplied. Dataset updates require separate review.
- Ethereum Blockies: original upstream notices in `BLOCKIES_NOTICES.txt` and
  `BLOCKIES_README.md`; pinned source commit is recorded in `PROVENANCE.txt`.
- Bundled fonts: upstream licenses/copyright notices in `app/vendor/fonts`.
- Electron, Chromium, Node.js and npm package dependencies retain their upstream
  licenses; the Windows package includes the runtime's license notices.

`VENDOR_SHA256.json` records exact vendored bytes. A checksum proves consistency
with that manifest, not that a dependency is harmless. The complete runtime and
build dependency graph is recorded in `package-lock.json`.

## BitBox02 client (app/vendor/bitbox-usb.js)

- `@bitboxswiss/bitbox-api` 0.4.0 — Copyright Shift Crypto AG / BitBoxSwiss,
  Apache License 2.0 (https://github.com/BitBoxSwiss/bitbox-api-ts).
- `@noble/hashes`, `@noble/curves`, `@noble/ciphers` — Copyright Paul Miller,
  MIT License. Notices kept in `app/vendor/bitbox-usb.js.LEGAL.txt`; full upstream license texts are bundled in `app/vendor/BITBOX_LICENSES.txt`.

Bundled by `scripts/build-bitbox.cjs` (esbuild) from the versions locked in
`package-lock.json`; bytes pinned in `VENDOR_SHA256.json`.

## Trezor protocol (app/trezor-core.js)

Original QEWE code. Message numbers and fields follow the public protobuf
definitions of trezor-firmware (`common/protob`), LGPL-3.0; no Trezor code is
copied or bundled.
