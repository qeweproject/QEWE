# Releasing QEWE

## Checklist

1. Merge to `main` only after `Source checks` is green.
2. Update `version` in `package.json`, the badge in `app/index.html`,
   `DisplayVersion` in `installer.nsi` and `CHANGELOG.md`.
3. Test on a real Windows machine with a real Ledger (address read, one small
   transfer, offline signing).
4. Tag: `git tag -s v3.2.0 && git push origin v3.2.0`. The `Release build`
   workflow builds Windows, Linux and macOS installers, prints their SHA256 and
   creates GitHub build-provenance attestations.
5. Create the GitHub Release, attach the three installers from the workflow
   artifacts, and paste the SHA256 sums into the release notes.

## Code signing (recommended before public promotion)

Unsigned installers trigger Windows SmartScreen and macOS Gatekeeper warnings,
and above all make it easy for an attacker to distribute a look-alike build.

- **Windows, free for open source:** [SignPath Foundation](https://signpath.org)
  signs releases of eligible OSS projects from GitHub Actions artifacts. Apply
  with the repository URL; once accepted, add their signing step after the build
  job and verify the signature with `Get-AuthenticodeSignature`.
- **Windows, paid:** Azure Trusted Signing (low monthly cost, requires an
  identity-verified Azure account). electron-builder supports it through
  `win.azureSignOptions`; keep credentials in GitHub encrypted secrets, never in
  the repository. `signAndEditExecutable` must then be set to `true`.
- **macOS:** an Apple Developer ID (yearly fee) plus notarization. Without it,
  the ad-hoc signed dmg opens only after *right-click → Open*.

After enabling signing, keep the attestation step: signature and provenance
answer different questions (who signed it / what source produced it).

## Before the first public release

- Pin `actions/attest-build-provenance` and `actions/upload-artifact` in
  `release.yml` to full commit SHAs.
- Enable branch protection on `main`, private vulnerability reporting, and 2FA
  for every maintainer.
- Scan the full history for secrets: `gitleaks detect`.
