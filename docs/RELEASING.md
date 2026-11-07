# Release process

The first public distribution is an experimental preview. Keep that status until real hardware/OS testing and independent review support changing it.

1. Review the exact source and lockfile; run Source checks. Preserve upstream notices and full license texts. Never add credentials or real wallet data to the repository.
2. Use the four standard hosted runners in `.github/workflows/release.yml`, on a public repository. Do not select paid/larger runners or add billing/payment services. Private repositories can incur charges beyond their included allowance; the release workflow refuses private publication.
3. Either create the version tag matching `package.json`, or run **Reviewed installers** manually on `main` with `release_tag` set to that exact tag (for example `v3.2.0-rc.3`). An empty input builds only. Manual publication creates the tag at the checked commit after verification and refuses to move an existing tag. The workflow checks all four native installers against their sources, runtime protections, icons and installed contents. Windows needs full 7-Zip with NSIS support.
4. Only after all builds succeed, collect the four artifacts, validate their checksums/source manifests, generate a dependency SBOM, aggregate SHA256s and attest provenance. Verify the attestations before distribution.
5. Create a draft release, attach every asset, then publish it as a **pre-release**, not latest stable. If immutability is enabled, publication locks assets and the tag. Do not overwrite published release bytes; use a new version.
6. Enable Pages on `main` + `/docs` and HTTPS. Confirm links/downloads and the manifest. Keep screenshots labeled as simulated historical preview data. Publish only the intended public source/packages.

Build provenance, release immutability and file hashes are separate from Authenticode, Developer ID and Apple notarization. No publisher certificate or private signing key is committed or claimed. Setting those up needs a separate maintainer process; no paid service is configured here.

Monitor dependency alerts and private security reports. Review contributions against public fixtures, never ask users for secrets, and keep marketing consistent with the actual audit/hardware/signature status.
