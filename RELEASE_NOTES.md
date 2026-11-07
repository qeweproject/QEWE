# QEWE 3.2.0-rc.3 — first public preview

Free, MIT-licensed Ethereum wallet analysis and explicit offline signing, with Ledger first. This pre-release combines the 3.2 feature work with the internal security review and the corrected Windows icons.

- Windows x64 installer, Ubuntu amd64 DEB, Mac Apple Silicon and Intel DMGs.
- Magnifying-glass Ethereum branding, explicit Windows shortcut/program-list icons and coherent application identity.
- Optional price/history/discovery services off initially, native metadata/RPC consent, safer gap stopping and bounded keystore costs.
- Hardware origin/session guards, stale-dialog protection and bounded Trezor/BitBox parsing/cancellation. Trezor/BitBox remain experimental readers only.
- Native installed-payload checks, full NSIS-aware 7-Zip verification, preserved runtime protections and complete bundled license texts.
- Source, checksums, SBOM and GitHub/Sigstore provenance available with the downloads.

**Experimental; no independent audit.** The build environment has not tested physical hardware wallets or a complete OS execution matrix. Windows is not Authenticode-signed; Mac builds are ad-hoc signed and not notarized. Checksums and attestations prove integrity/build provenance, not harmless code. See SECURITY.md and docs/VERIFY.md.

Start with public addresses or disposable wallets. Never enter a Ledger recovery phrase into a computer app. Physically disconnect a trusted computer for software-key signing. RPCs can correlate public addresses and provide false data; signed transaction exports authorize their exact transfer.

Only download from qeweproject/QEWE Releases and the linked project page. Tips are voluntary and no payment is required. This is a preview, not a claim of stable production readiness.
