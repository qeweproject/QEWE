# Unreleased — 3.2.0 features

- Optional native balance and nonce check on Arbitrum One, Base, OP Mainnet,
  Polygon PoS, BNB Smart Chain and Gnosis for every address (same address on
  every EVM network). Default public RPCs are pre-approved; custom RPCs need the
  native confirmation. Included in USD estimates when a quote is available.
  Transactions stay Ethereum mainnet only.
- Stop after N unused indexes per derivation path (gap limit, 0 = off). Indexes
  are checked level by level so a stop decision always sees every lower index;
  errors count as used; imported addresses are always checked.
- Historical MyEtherWallet/MyCrypto paths (opt-in): Ethereum Classic, Ledger Live
  ETC, Ledger ETC, testnet, RSK.
- Optional Blockscout discovery of all ERC20/ERC721/ERC1155 holdings, sanitized,
  display-only, excluded from the "positive balance" filter and USD estimate.
- CSV export: other networks and discovered tokens columns.
- USD estimate, indexed history and Blockscout discovery are now checked by
  default (maintainer choice); selecting an extra network unchecks them,
  unselecting every network checks them again. Blockscout and DefiLlama
  therefore receive the checked public addresses by default.
- Encrypted JSON keystore files (Web3 Secret Storage from MyEtherWallet, Geth,
  MetaMask, and Ethereum presale wallets) open with their password, in the
  seed-reading panel (one read-only address) and as an offline signer.
- Linux AppImage and macOS dmg build targets; release workflow builds and
  attests all three platforms; `verify-release` accepts `win|linux|mac`.
- README features/screenshots, `docs/VERIFY.md`, `docs/RELEASING.md`.

# Unreleased — security review follow-up

- RPC URLs now require a one-time native confirmation per session (main
  process). A compromised renderer can no longer exfiltrate a seed by hiding it
  inside an RPC URL passed over IPC. The default PublicNode endpoint is pre-approved.
- Clipboard is cleared right after pasting into seed/passphrase fields.
- Window content protection enabled (excluded from screenshots/screen sharing).
- Single-instance lock; global `web-contents-created` navigation/window guard.
- Transaction summary values (addresses, amounts, fees, path) are excluded from
  the translation layer so displayed values can never be rewritten.
- Offline unsigned envelopes are normalized to canonical lowercase hex, so mixed
  case files no longer fail after signing.
- Dependabot cooldown (7 days, 14 for majors); release workflow building the
  Windows installer on `v*` tags with SHA256 and build provenance attestation.

# 3.1.0 — security-hardening candidate

- Removed the cryptoasset package used only to extract a fixed descriptor
  dataset, and its Axios dependency; pinned a patched minimatch for build tools.
- Regenerated the lockfile from official package metadata after finding an
  inconsistent test dependency constraint in the previous lockfile.
- Added streaming HTTP response limits and JSON-RPC envelope checks.
- Enforced total-fee, per-gas and priority-fee limits in both online preparation
  and offline transaction validation/signing.
- Restricted IPC to the actual main frame, file resources to the application
  directory, and blocked webview attachment and renderer-initiated downloads.
- Centralized the main-process offline network gate; hid/cleared software
  signing fields when returning online; enforced software signer formats.
- Made external indexed history and USD quotes opt-in; retained the 25 default
  ERC20 scan selections and existing Ledger/offline workflows.
- Added vendor provenance checks, runtime fuses, privacy checks, minimal CI,
  contribution/security policies and a draft MIT-licensed public source tree.
