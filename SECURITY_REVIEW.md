> Historical internal review notes for an earlier candidate. Not an independent audit or security certification. Current distribution status: RELEASE_NOTES.md and docs/VERIFY.md.

# QEWE 3.1.0 — review record

This is a limited engineering review and security-hardening candidate. It is not
an independent audit, a malware-free certificate or a claim that every issue has
been found. The existing 3.0.0 installer does not acquire these changes until it
is replaced by the newly built candidate.

## Implemented

- Regenerated npm metadata and the lockfile from the official registry. The old
  lockfile contained an inconsistent selector-library constraint, so it was not
  reused as the basis for dependency resolution. No compromise is inferred from
  that inconsistency alone.
- Removed the build-only cryptoasset extraction dependency and its vulnerable
  Axios dependency. The fixed signed descriptor data remains licensed and pinned.
- Overrode affected minimatch 7–10 dependencies with patched 11.0.5; actual tests
  and the installer build check compatibility. No automatic audit-fix downgrade.
- Dependency lifecycle scripts are disabled. Electron/esbuild setup is an explicit
  separate step. No dependency-update script runs automatically in the app.
- Rebuild browser ethers, wordlists and Ledger transport from pinned upstream
  packages; verify vendored-file SHA256s. Standard crypto was not rewritten.
- Cap HTTP response bytes during streaming, validate JSON-RPC version/shape,
  and cap quantities and unsigned envelope input length before decoding.
- Apply hard signing fee limits to online and offline requests. Explicit exact
  payload validation, mainnet-only transaction types, signing provenance,
  simulation and one-attempt broadcast behavior remain in force.
- Require the actual application main frame for IPC; restrict file requests to
  the app directory; prevent webview attachment and application downloads.
- Gate all main-process fetches while offline and prevent unlocking that mode
  while an offline signing plan is active. Clear software signing fields when
  switching online and restrict software signer formats at the worker API.
- External history/price requests are off by default. Default ERC20 selections
  remain intact. No seed, private-key or account-address preferences are added.
- The Windows binary is packaged with Node-mode/options/inspector fuses disabled
  and ASAR-only/integrity validation enabled. The release verifier reads the
  actual fuse bytes and compares packaged application content with source.
- Original project metadata uses a generic contributor name. Distribution source
  has no pre-existing git history or private author/email paths. Third-party
  authors' required credits remain. The donation address is intentionally public.

## Verification and residual risk

Dependency audits and npm registry signature/attestation checks are point-in-time
results, not an independent source-code review. The runtime's Chromium/Electron
security cannot be reduced to npm audit output. Physical Ledger and Windows UI
execution remain untested here. The historical Ledger transport is unmaintained;
migration to the new SDK and physical-device regression tests remain follow-up
work. Keep this candidate marked experimental until those checks and an
independent review are complete. See VALIDATION.txt for the actual local results.
