# Contributing

Keep changes small and reviewable. Never add telemetry, embedded credentials,
automatic donations, arbitrary transaction signing, remote renderer scripts,
or sandbox-disabling workarounds. Do not replace standard cryptographic
primitives with original algorithms. Tests use only documented public fixtures.

Dependencies are exact-pinned; installation lifecycle scripts are disabled.
Dependency bumps must include a complete audit, signature verification, vendor
rebuild and tests. Do not change the vendor checksum manifest merely to make a
failing verification pass. CI token permissions remain read-only; no repository
or release credentials belong in the source tree.

Configure a pseudonymous name and the exact GitHub-provided noreply address
before creating commits if you do not want personal author details published.
The MIT license allows donation-address changes in forks. Such a fork should
use its own clearly identified branding and must not impersonate this project.
