# Security policy

QEWE is experimental personal-wallet software, with no independent audit or
security certification. Only the newest reviewed release candidate is maintained.
No amount of automated scanning guarantees absence of malicious or vulnerable
upstream code.

Before a public release, maintainers must enable GitHub private vulnerability
reporting. Until then, there is no published reporting endpoint; do not send
sensitive reports to guessed accounts or open public issues exposing wallet data.
Reproduce with public disposable test wallets only. Never include real keys,
phrases, RPC API tokens, unsigned personal transaction plans or signed envelopes.

For every candidate:

1. Review lockfile changes, upstream ownership, licenses and deprecations.
2. Install with `npm ci --ignore-scripts`; verify npm signatures/attestations and
   run `npm audit` across both runtime and build dependencies.
3. Rebuild vendored code; check `VENDOR_SHA256.json` and review every change.
4. Run unit, DOM and native integration tests with synthetic wallets and nodes.
5. Rebuild the installer in a clean environment, verify its embedded ASAR/fuses,
   and publish hashes plus the exact matching source commit and tool versions.
6. Independently review the code and test a real Ledger/Windows setup before
   removing the experimental status. Do not claim full binary reproducibility
   unless two independent builds have actually been compared.

Renderer/network boundary:

- Seeds, passphrases and private keys only exist in the sandboxed renderer and
  its short-lived workers, which have no network access (CSP `connect-src 'none'`
  and a session-wide request filter allowing only local application files).
- The main process performs all network calls. Every RPC URL it receives from the
  renderer must first be confirmed by the user in a native dialog, so tampered
  renderer code cannot encode a secret into an attacker-controlled URL.
- "Offline mode" is an application-level network block, not an air gap. For
  signing with a typed seed, use a computer that is physically disconnected.

Remaining boundaries:

- RPCs, token contracts and price/history services can lie, fail, or correlate
  public addresses. A successful simulation cannot guarantee future execution.
- Computer malware can observe local secrets or replace an unsigned program.
- Ledger WebHID package 6.36.0 is deprecated/unmaintained upstream. No currently
  reported vulnerability is assumed to make it trustworthy. A migration to the
  newer official device SDK requires separate protocol and physical-device tests.
- Some transitive build packages are deprecated. Updates must be reviewed and
  exercised by actual build tests rather than applied with a blind audit fix.
- JavaScript does not guarantee physical secret-memory or clipboard erasure.
- A public donation address can expose links to other transactions or identities.
- Checksums, npm signatures and registry attestations establish provenance or
  consistency, not that the upstream publisher or code is uncompromised.
