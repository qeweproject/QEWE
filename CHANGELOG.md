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
