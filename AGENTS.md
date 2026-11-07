# AGENTS.md — QEWE

Outil Electron (Windows) qui manipule des seeds et signe des transactions Ethereum.
Lire `README.md`, `SECURITY.md`, `SECURITY_REVIEW.md` et `CONTRIBUTING.md` avant toute modification.

## Règles non négociables
- Pas de télémétrie, pas d'identifiants dans le code, pas de nouvel appel réseau
  sans accord explicite.
- Aucune seed, clé privée ou phrase ne doit apparaître dans les logs, les exports
  ou les tests. Utiliser uniquement les vecteurs publics de `tests/`.
- Ne jamais modifier `VENDOR_SHA256.json` ni `app/vendor/` pour faire passer une vérification.
- Ne pas désactiver la sandbox, la CSP, l'isolation du contexte ni les fuses Electron.
- Pas de signature arbitraire : seuls les transferts ETH/ERC20 canoniques sont acceptés.
- Dépendances épinglées ; installation avec `npm ci --ignore-scripts`.
- Les modifications de `app/core.cjs`, `app/offline*`, `app/main.cjs`, `app/preload.cjs`,
  `app/transfers*`, `scripts/` et `.github/workflows/` demandent une relecture humaine explicite.

## Commandes de vérification
```sh
npm ci --ignore-scripts
npm audit --audit-level=low
npm run build:vendor
npm run verify:vendor
npm run verify:privacy
npm test
npm run test:dom
```
Les tests natifs (`tests/native-*.cjs`) nécessitent Windows et ne tournent pas dans la CI Linux.

## Workflow
- Une branche par tâche, une PR par branche. Ne jamais pousser sur `main`.
- Avant d'ouvrir une PR : lancer les commandes ci-dessus et indiquer dans la description
  ce qui n'a pas pu être exécuté.
- Un agent ne relit pas seul ses propres changements sensibles : la PR doit être relue par un humain.
- Auteur des commits : identité pseudonyme du projet, jamais une adresse personnelle.
