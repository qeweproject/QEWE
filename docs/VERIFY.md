# How to verify a QEWE download

No single check proves a wallet tool is harmless. Combine source review, provenance and cautious testing. Prefer a hardware wallet or public addresses. Never enter a Ledger recovery phrase in QEWE or any computer application.

## 1. Use the official project

Download only from https://github.com/qeweproject/QEWE/releases or the linked project page at https://qeweproject.github.io/QEWE/. There is no web-based seed checker on the project site. Ignore unsolicited support messages, search ads and mirrors asking you to validate, synchronize or unlock a wallet with a recovery phrase.

## 2. Check the file hash

Download `SHA256SUMS.txt` from the same release. Compare every character with your local file:

```powershell
Get-FileHash .\QEWE_3.2.0-rc.3_Windows_x64_Setup.exe -Algorithm SHA256
```

```sh
# Ubuntu/Linux
sha256sum QEWE_3.2.0-rc.3_Ubuntu_amd64.deb
# macOS: choose arm64 for Apple Silicon or x64 for Intel
shasum -a 256 QEWE_3.2.0-rc.3_macOS_arm64.dmg
```

A matching hash detects corruption or substitution relative to that manifest. An attacker controlling both a file and its manifest can replace both.

## 3. Verify GitHub provenance

Release builds run on standard GitHub-hosted runners from a version tag. Verify the build's repository and workflow with a current official GitHub CLI:

```sh
gh attestation verify ./QEWE_3.2.0-rc.3_Windows_x64_Setup.exe --repo qeweproject/QEWE --signer-workflow qeweproject/QEWE/.github/workflows/release.yml --deny-self-hosted-runners
```

Substitute your actual downloaded file. Inspect the reported commit, source ref and workflow; they must match the release. A `provenance.sigstore.json` bundle is also attached for verification with `--bundle`. GitHub's verification tool may require authentication or network access for discovery and trust roots.

An attestation binds bytes to the build identity and source reference. It does not prove absence of malicious code, compromised dependencies or maintainer-account compromise. If release immutability is enabled, GitHub also locks the published assets/tag and supplies a release attestation; this still does not replace code review.

## 4. Inspect the exact source

Check out the release tag, not an unrelated latest branch:

```sh
git clone https://github.com/qeweproject/QEWE.git
cd QEWE
git checkout v3.2.0-rc.3
npm ci --ignore-scripts
npm audit --audit-level=low
npm audit signatures
npm run build:vendor
npm run verify:vendor
npm run verify:privacy
npm test
npm run test:dom
```

Review `package-lock.json`, `VENDOR_SHA256.json`, upstream licenses and changes. `SBOM.cdx.json` inventories development and runtime dependencies recorded in the lockfile, not only code shipped in the app. Vendored fonts and token datasets have separate notices. Hashes and registry signatures establish consistency/provenance, not that a publisher is trustworthy.

Build using the commands in README. `scripts/verify-release.cjs` compares installed ASAR/application bytes, icons and runtime fuses against that checkout. Windows/macOS embed ASAR header integrity; Electron does not support embedded ASAR integrity on Linux. Installer hashes can differ across independent builds because of timestamps, packaging and signatures. Independent reproducibility has not been demonstrated.

## 5. Inspect the network boundary safely

Use only published disposable test fixtures, never real wallet secrets while experimenting. The phrase/key input first exists in the renderer; derivation and software signing run in short-lived workers. Examine `app/derive.js`, `worker.js`, `offline-sign-worker.js`, `new-wallet-worker.js`, `main.cjs` and `preload.cjs`.

The intended UI has `connect-src 'none'`, local scripts, sandbox/context isolation and a session request filter. The main process owns HTTP calls and validates public inputs. New RPC URLs and first use of optional metadata need native consent. **This is not a formal noninterference proof:** a compromised renderer could encode a secret into otherwise valid public inputs, and a compromised computer can replace the app or observe memory.

In a disposable VM, monitor the process tree (including Electron helper processes) with your OS firewall/network tools: startup and local derivation should not require wallet RPC traffic; an intentional scan sends public addresses to the selected RPC, and explicitly enabled metadata uses the documented external services. Avoid software that decrypts real HTTPS traffic or disabling certificate checks to perform this test. An absence of traffic during one observation is not proof of absence of every leak.

For genuine software-key signing, physically disconnect networking before loading the secret and keep it disconnected. The application offline toggle is additional protection, not an operating-system air gap. A signed transaction export is sufficient to authorize its exact transfer and must remain private until broadcast is intended. Public-address exports also reveal financial relationships.

## OS warnings

Windows builds currently lack an Authenticode publisher signature. Mac builds are signed ad hoc, without Developer ID/notarization. Gatekeeper/SmartScreen warnings can therefore occur; do not disable system-wide security protections. If you are not comfortable assessing an unsigned preview, inspect/build it on a separate test computer or wait for a later audited release.

No physical Ledger/Trezor/BitBox02 or full target-OS execution matrix has been tested by the build environment. Automated mocks, payload checks and provenance are not that test.
