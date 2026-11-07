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
