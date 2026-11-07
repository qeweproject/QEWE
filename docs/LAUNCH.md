# Launch kit (drafts to copy — post from your own account)

Do this only after: PR #6 merged, release v3.2.0 published, `docs/VERIFY.md` checked on a real download, GitHub Pages enabled (Settings → Pages → Branch `main`, folder `/docs`).

## Show HN
**Title:** Show HN: QEWE – find forgotten Ethereum funds across wallet derivation paths

**Text:**
I built this to recover my own funds. The same seed gives different addresses depending on the derivation path a wallet used (Ledger Live, Legacy, MetaMask/Trezor, old MyEtherWallet…), and the same address can hold money on Arbitrum/Base/OP that Etherscan doesn't show. QEWE reads public addresses from a Ledger (the seed never leaves the device), checks all paths and networks at once and shows where the funds are.

It's an Electron app, MIT. Because it's security-sensitive: the renderer is sandboxed with `connect-src 'none'`, only the main process talks to the network (allow-listed), releases have SHA256 + GitHub build attestation, and docs/VERIFY.md explains how to check it or build it yourself. It is NOT independently audited yet — I'd love review.

Repo: https://github.com/qeweproject/QEWE

## r/ethereum, r/ledgerwallet, r/CryptoCurrency
**Title:** I made a free open-source tool to find forgotten ETH/tokens across Ledger paths and L2s (built to recover my own funds)

**Text:** (adapt the HN text; add the GIF; end with)
Never type a Ledger recovery phrase into any computer app — QEWE reads public addresses over USB. Not audited yet, so test with small wallets first and verify your download (link). Feedback and security reviews very welcome.

*Rules:* read each subreddit's self-promotion rules first; r/CryptoCurrency may require flair or minimum karma. Don't ask for upvotes. Answer every comment about security honestly, including limits.

## awesome-ethereum lists
Search GitHub for `awesome-ethereum` lists, read each CONTRIBUTING.md, then open a PR adding one line in the right section (Tools / Wallets utilities):

`- [QEWE](https://github.com/qeweproject/QEWE) - Desktop tool to find forgotten ETH/ERC20 funds across wallet derivation paths and EVM networks, from a Ledger. MIT.`

## Later: audit funding
Gitcoin Grants, Ethereum Foundation ESP, Optimism RetroPGF/other public-goods rounds. Prepare: a short scope doc (threat model = SECURITY.md), the release hashes, and a budget quote from an audit firm.
