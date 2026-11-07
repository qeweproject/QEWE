> Historical internal review notes for an earlier candidate. Not an independent audit or security certification. Current distribution status: RELEASE_NOTES.md and docs/VERIFY.md.

# Security review — QEWE 3.2.0-rc.1

Base: PR #6, commit c8f680ecece95804212ba40c194953eb36c162db. This is a release candidate, not an independently audited or certified wallet.

## Corrections

- Prices, indexed history and token/NFT discovery start disabled and are never re-enabled by changing networks. Their first use requires main-process native consent. Refusal starts no optional service request.
- Gap-limit early stopping no longer treats unknown token/network/history/discovery balances as proof of emptiness. Broken tokens can make a scan take longer. Missing prices alone are harmless; gap 0 remains the default.
- Keystore KDF costs are checked before decryption. Positive safe integer parameters only; scrypt N power of two, r <= 32, p <= 16, 128*N*r <= 256 MiB, N*r*p <= 4194304; PBKDF2 <= 2000000 rounds. Excessive settings receive a distinct refusal. Standard tested keystores still work in the isolated worker.
- Device permissions bind the selected family and main-window origin. A stale selection dialog cannot grant access to a later read session. Only Ledger can register an online signing source.
- Trezor rejects malformed continuation packets and truncated protobuf fields. Failed USB opens/claims and cancelled connections close their handles.
- BitBox selection, pairing and reads have explicit cancellation and time limits, including late completion. Its official-library bundle is loaded only when selected. Versions stay pinned.
- The magnifier/Ethereum logo is embedded in Windows resources, macOS ICNS, Ubuntu desktop/icons and the UI. Windows resource editing remains enabled while Authenticode signing is explicitly absent. NSIS handles native/cross-build paths and the actual version.
- Ubuntu uses DEB instead of requiring AppImage/FUSE. The standard scoped AppArmor profile and Chromium sandbox helper are retained. No global AppArmor/user-namespace setting is disabled and no no-sandbox launch flag is introduced.
- Packaged payloads are compared with source, fuses, icons and platform integrity metadata. Native macOS signatures and mounted DMG payloads are checked. CI actions are pinned to immutable commits. The candidate workflow uses a read-only token, private test artifacts, and no signing secrets, publication or attestation-write permissions. Public release attestations can be added in a separate release job when a signed release process is configured.

## Validation and limits

55 upstream tests passed before changes; 58 passed after initial hardening. Affected integration tests and final package checks must also pass. New tests cover KDF cost refusal, malformed USB traffic, cancellation, permission origin, explicit metadata consent and unknown-balance stopping. DOM/worker checks pass.

At review time npm audit reports zero known vulnerabilities; 349 installed packages have verified registry signatures and 51 have attestations. This is not proof against a compromised publisher or unknown flaw. The pinned Ledger WebHID transport is deprecated; migration needs separate hardware validation rather than an untested swap.

No real secrets or funded transactions are used in tests. Physical Ledger/Trezor/BitBox02 have not been tested here. Non-Ledger devices remain experimental. RPC providers can lie and link queried addresses. The offline toggle blocks application calls and does not disconnect the OS. JavaScript cannot guarantee erasure of memory or another app's clipboard history. Linux does not enforce Electron embedded ASAR integrity.

Windows installers lack Authenticode signatures. macOS candidates are ad-hoc signed, without Developer ID notarization; trusted public distribution requires the maintainer's Apple signing setup. Target compatibility: Windows 11 x64; Windows 10 x64 where OS security support remains available; recent supported macOS on Intel/Apple Silicon; Ubuntu 22.04/24.04/26.04 LTS amd64. These are packaging targets, not a physical OS/hardware test matrix.

## References

- https://www.electronjs.org/docs/latest/tutorial/security
- https://www.electronjs.org/docs/latest/api/session
- https://www.electron.build/v26/docs/mac/
- https://www.electron.build/v26/docs/features/multi-platform-build/
