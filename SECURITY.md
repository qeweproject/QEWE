# Security policy

QEWE is experimental software, not an independently audited or certified wallet. The public preview is for review and cautious testing, preferably with public addresses or disposable test wallets. Never type a Ledger recovery phrase into a computer application.

## Report privately

Use the repository Security tab's private vulnerability reporting feature when enabled. If it is unavailable, contact the project through its published repository contact channels without sending real secrets. Never post recovery phrases, keys, RPC API tokens, personal signed transactions or wallet exports in public issues. Reproduce with public test fixtures only. No reporting SLA or bounty is promised.

## Intended boundaries

- The renderer and short-lived derivation/signing workers use sandbox, context isolation, local scripts and `connect-src 'none'`; a request filter permits local application files. Main-process IPC validates the sender and public fields.
- Native confirmation is required for a new RPC URL and first use of optional metadata providers. Optional USD prices, indexed activity and discovery start off. Providers see public data and may correlate it or lie.
- Software signing requires the application offline mode; use a trusted physically disconnected computer as well. Only explicit Ethereum-mainnet EIP-1559 ETH/ERC20 transfers with existing fee/gas limits are supported. No approvals, arbitrary calls or message signing.
- Ledger confirmations and the device screen remain required for signing. Trezor/BitBox02 are experimental address readers only, not signing paths. PINs are entered on the device.

These are defenses, not proof of complete isolation. A compromised dependency, renderer, OS or unsigned executable can defeat them. In particular, a malicious renderer may encode private data into apparently valid public requests. JavaScript cannot guarantee RAM or external clipboard-history erasure. A simulation cannot guarantee future execution. Treat signed exports as authorizations and public exports as privacy-sensitive.

## Release checks

Pinned dependencies/actions, registry signature verification, `npm audit`, vendor rebuild checks, tests, native packaging and installed-payload comparison run before a tagged public release. Native builds preserve Electron fuses and sandbox protections. Windows/macOS support embedded ASAR validation; Linux Electron does not.

Downloads include checksums, source metadata, SBOM and GitHub/Sigstore build provenance. These do not replace an independent audit or publisher certificates. Windows is currently unsigned Authenticode; Mac signing is ad hoc, without notarization. Physical wallet testing and an independent reproducibility comparison remain outstanding.

The legacy Ledger WebHID library is deprecated upstream; no absence of known CVEs makes it safe. Migrating to a newer SDK requires separately reviewed protocol and physical-device tests. Dependency updates should not be applied with a blind audit fix.

See [verification instructions](docs/VERIFY.md), [upstream notices](THIRD_PARTY_NOTICES.md) and the release's exact workflow/commit.
