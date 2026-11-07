# QEWE — Quick Ethereum Wallet Explorer

**Ethereum Wallet Analysis & Offline Signing Tool**

Windows 11 x64 desktop utility for Ethereum mainnet. Ledger USB comes first:
read public addresses across Ledger Live, Legacy, BIP44 and custom paths, inspect
ETH/ERC20 balances, and prepare explicit transfers. Software phrase/key reading
and local BIP39 generation are secondary tools. Software signing is restricted
to the explicit offline transaction flow.

## Status

Version 3.1.0 is a security-hardening candidate, not an independently audited
wallet. Automated tests use published test wallets, mock Ethereum nodes and a
simulated Ledger. No physical Ledger or Windows 11 execution test has been
performed by the build environment. Do not describe this as certified or safe
for important funds. Start with public addresses and disposable test wallets.

## Main features

- 25 addresses per path initially, adjustable from 1 to 10,000; shared addresses
  retain their derivation associations. Tables show 250 rows per page.
- ETH plus 25 default ERC20 tokens; custom Ethereum token contracts supported.
- Optional indexed history and USD estimates; both are initially off. Selected
  RPC providers see public addresses when a balance check is requested. Enabled
  history and price providers see the public data needed by those requests.
- 20 UI languages, English initially; some technical messages in additional
  languages fall back to English. Local fonts and translations, no translation API.
- Day/night mode, deterministic local Blockies, copy, Etherscan links and public
  JSON/CSV export. Never share exports containing private keys or phrases.
- Online transfers require a Ledger account read during the current session.
  Destination, amount and fees must be checked and confirmed on the device.
- Offline unsigned/signed JSON envelopes work with Ledger, standard BIP39,
  root xprv and a raw Ethereum private key. Signed exports can authorize a
  broadcast; keep them private until you intend to publish that transaction.

## Security boundaries

Never type a Ledger recovery phrase into this or any computer application.
Software secrets exist in computer memory and cannot be securely erased by
JavaScript guarantees. The application offline toggle blocks its network calls;
it does not disconnect the operating system. Physically disconnect the signing
computer for the offline software-signing workflow.

Only canonical Ethereum-mainnet EIP-1559 ETH transfers and supported ERC20
`transfer` calls are accepted. No arbitrary calldata, approvals, message signing
or EIP-712. Nonce, balances, simulation, signer and the exact reviewed bytes are
checked; ambiguous broadcast responses are not automatically retried.

Absolute signing limits: **0.05 ETH total fee cap**, **1000 Gwei max fee per gas**,
**50 Gwei max priority fee**, and **1,000,000 gas**. These are upper bounds, not
recommendations or cost estimates. Transfers exceeding them are refused online
and when importing an offline envelope. The recipient and transfer amount are
still the user's responsibility. RPC data can be false or unavailable.

The renderer is sandboxed and isolated; embedded scripts are local. HTTP bodies
are capped while streaming. The packaged Windows runtime disables Node-mode,
Node options and inspector switches, enables ASAR validation and only loads the
packaged ASAR. These controls do not protect against a fully compromised computer
or an attacker who can replace the unsigned executable itself.

See [SECURITY.md](SECURITY.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## Run from source

Install Node.js **24.x** and use the committed lockfile:

```sh
npm ci --ignore-scripts
npm audit --audit-level=low
npm audit signatures
npm run build:vendor
npm run verify:vendor
npm test
npm run test:dom
```

Lifecycle scripts are disabled by `.npmrc`. For Electron execution, explicitly
install its official runtime after reviewing the dependency verification:

```sh
node node_modules/electron/install.js
node node_modules/esbuild/install.js
npm start
```

For the Linux headless integration tests, use `npm run test:native` and run
`tests/native-v22.cjs` / `tests/native-v23.cjs` through the Electron CLI. System
libraries needed by Electron must be available. No sandbox-disabling flag should
be added to make a test pass.

## Build Windows

```sh
npm run build
npm run verify:release
```

Output goes to `../deliverables`. The builder uses the pinned official Electron
runtime and NSIS tooling, which may be downloaded over HTTPS during building.
No certificate is included. The installer is per-user and provides desktop and
Start menu shortcuts. Existing application installation identity is preserved.
No executable is uploaded or published by these commands.

`VENDOR_SHA256.json` pins vendored bytes; rebuilding must reproduce them. Any
intentional update requires reviewing the upstream changes and updating this
manifest, not silently overwriting its checksums. Dependency versions, audit
results and release hashes are not permanent guarantees against compromise.

## Voluntary tips

Ethereum mainnet: `0x1B8147Eb5b45Cf7a9569EF23bd8ca42b63867B50`

The address is visible and copyable in the footer. QEWE never automatically sends
a donation, adds a hidden fee or requires payment. Ethereum transfers are public:
a donation address can link a pseudonym to earlier activity. Verify the address
against the intended project's release before sending.

## License and contributions

Original code is offered under the [MIT license](LICENSE); upstream licenses and
credits remain in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Forks may modify
the program, including its donation address. A mandatory immutable donation
address is not imposed by this MIT license. Please distinguish forks clearly.

Security reports: after publication, use GitHub private vulnerability reporting
if enabled by the repository maintainer. Never post real recovery phrases,
private keys, signed transactions or account credentials in issues.
