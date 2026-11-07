# Verify that your copy of QEWE is genuine

QEWE can read recovery phrases. A modified copy could steal them, so check what
you run. It takes a few minutes and you only need to do it once per version.

## 1. Download from the right place

Only from the **Releases** page of the official GitHub repository. Not from a
search ad, a video description, a chat message or a "faster mirror". The
project never contacts users first and never asks for a recovery phrase.

## 2. Check the SHA256 sum

Each release lists the SHA256 of every installer. Compare it with your file:

- Windows (PowerShell): `Get-FileHash .\Quick_Ethereum_Wallet_Explorer_*.exe -Algorithm SHA256`
- macOS: `shasum -a 256 Quick_Ethereum_Wallet_Explorer_*.dmg`
- Linux: `sha256sum Quick_Ethereum_Wallet_Explorer_*.AppImage`

Every character must match. If it does not, delete the file.

## 3. Check the build provenance (strongest check)

Release installers are built by GitHub Actions from the public source, and
GitHub signs a provenance attestation saying which commit and workflow produced
the file. With the GitHub CLI:

```sh
gh attestation verify Quick_Ethereum_Wallet_Explorer_<file> --repo qeweproject/QEWE
```

A successful result proves the file was built by this repository's release
workflow, not uploaded by hand. It does not prove the code is free of bugs.

## 4. Or build it yourself

```sh
git clone https://github.com/qeweproject/QEWE && cd QEWE
npm ci --ignore-scripts
npm run verify:vendor && npm test
node node_modules/electron/install.js && node node_modules/esbuild/install.js
npm start
```

## What you can check in the code

- Seeds and private keys are only handled in `app/derive.js`,
  `app/worker.js` and `app/offline-sign-worker.js`, which run in sandboxed
  workers of a renderer that has **no network access**: see the
  `Content-Security-Policy` in `app/index.html` (`connect-src 'none'`) and the
  request filter in `app/main.cjs` that only allows local application files.
- All network calls happen in the main process (`app/core.cjs`,
  `app/transfers.cjs`), which only receives public addresses. Any RPC URL other
  than the built-in defaults needs your confirmation in a native dialog.
- Signing is limited to plain ETH and supported ERC20 transfers on Ethereum
  mainnet with hard fee caps (`app/transfer-codec.js`).

## Warning signs

Close the program and do not type anything if a "QEWE" copy asks for your
phrase to "sync", "validate" or "unlock" funds, shows a different version
number than the release, or opens a website by itself.
