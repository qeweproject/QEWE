# QEWE 3.1.0 — revue de sécurité (novembre 2026)

Revue de code manuelle de l'application Electron (`app/`), des scripts de build et
de la configuration de dépendances. Ce n'est pas un audit indépendant certifié.
Les tests n'ont pas pu être exécutés pendant la revue (dépendances npm absentes
de l'environnement) : lancer `npm test` et les tests natifs avant toute release.

## Verdict

L'architecture est saine et déjà au-dessus de la moyenne des outils wallet :

- Renderer sandboxé, `contextIsolation`, pas de Node, DevTools désactivés.
- CSP stricte (`connect-src 'none'`) + filtre de session qui n'autorise que les
  fichiers locaux de l'application : le code qui manipule la seed ne peut pas
  joindre Internet directement.
- Seeds et clés uniquement dans des Web Workers éphémères ; le processus
  principal ne reçoit que des adresses publiques.
- IPC limité à la frame principale, arguments revalidés côté main.
- Signature limitée à des transferts ETH/ERC20 canoniques EIP-1559 mainnet,
  avec plafonds de frais, simulation et contrôle du signataire.
- Fuses Electron durcis, `ignore-scripts`, lockfile avec intégrité, empreintes
  SHA256 des fichiers vendorisés.

Aucune faille permettant de voler des fonds à distance n'a été trouvée. Les
points ci-dessous réduisent les risques résiduels.

## Corrigé dans ce lot

| # | Gravité | Problème | Correctif |
|---|---|---|---|
| 1 | Moyenne | **Canal d'exfiltration via l'URL RPC.** Le renderer (qui voit la seed) peut transmettre n'importe quelle URL RPC au main, qui la contacte. Un code vendorisé compromis (ethers, transport Ledger) pourrait cacher la seed dans l'URL d'un serveur pirate. | Toute nouvelle URL RPC doit être confirmée dans une boîte de dialogue native (main) que le renderer ne contrôle pas. URL par défaut PublicNode pré-approuvée. Couvre scan, ajout ERC20, préparation, préparation hors ligne et diffusion. |
| 2 | Moyenne | **Seed laissée dans le presse-papiers** après un collage (historique Windows Win+V, synchro cloud, autres applis). | Presse-papiers vidé juste après un collage dans les champs seed/passphrase. |
| 3 | Faible | **Capture d'écran / partage d'écran** de la seed affichée. | `setContentProtection(true)` : fenêtre exclue des captures et du partage d'écran. |
| 4 | Faible | Couche de traduction appliquée au récapitulatif de transaction (adresses, montants). Pas exploitable aujourd'hui, mais une valeur affichée ne doit jamais pouvoir être réécrite. | Valeurs du récapitulatif exclues de l'i18n. |
| 5 | Faible | Fichier non signé en hexadécimal majuscule accepté à l'import puis rejeté après signature. | Normalisation canonique à l'import. |
| 6 | Faible | Pas de verrou d'instance unique ; garde de navigation seulement sur la fenêtre principale. | `requestSingleInstanceLock` + garde globale `web-contents-created`. |
| 7 | Chaîne d'approvisionnement | Dependabot adopte les versions dès leur publication ; aucun build de release traçable. | Délai de 7 jours (14 pour les majeures) ; workflow `release.yml` qui construit l'installeur sur les tags `v*` et publie son SHA256 et une attestation de provenance. |

Un test (`tests/desktop.test.cjs`) vérifie le refus d'URL RPC non confirmée,
la protection d'écran et le vidage du presse-papiers.

## Recommandations (non implémentées)

Par priorité :

1. **Signer l'installeur Windows** (`signAndEditExecutable: false` aujourd'hui).
   Pour un outil qui reçoit des seeds, un binaire non signé est le principal
   risque une fois open source : n'importe qui peut publier une copie piégée.
   Options : SignPath Foundation (gratuit pour l'open source) ou Azure Trusted
   Signing. Publier aussi les SHA256 et l'attestation GitHub de chaque release.
2. **Épingler par SHA de commit** les deux actions encore sur un tag dans
   `release.yml` (`attest-build-provenance`, `upload-artifact`), comme dans
   `checks.yml`. Activer la protection de la branche `main`, la
   signature des commits, le *private vulnerability reporting* et 2FA.
3. **Migrer `file://` vers un protocole personnalisé** (`protocol.handle`,
   ex. `app://qewe/`) puis désactiver le fuse `grantFileProtocolExtraPrivileges`.
   C'est la configuration recommandée par Electron ; à tester avec les workers.
4. **Remplacer `@ledgerhq/hw-transport-webhid` 6.36.0** (déprécié) par le SDK
   Ledger actuel, avec tests sur un vrai Ledger.
5. **Anti-empoisonnement d'adresse** : afficher l'adresse destinataire par blocs
   et alerter si elle partage début et fin avec une adresse connue sans être
   identique.
6. **Création de seed** : le panneau « Nouvelle phrase » génère une seed sur un
   ordinateur connecté. Afficher un avertissement fort : pour des fonds
   importants, créer la seed sur le Ledger.
7. **Mode hors ligne** : le libellé laisse penser à un isolement complet. C'est
   un blocage applicatif. Préciser dans l'interface qu'il faut débrancher le
   réseau pour signer avec une seed saisie.
8. **Mettre à jour Electron** à chaque version de sécurité de la branche
   supportée ; une vieille version de Chromium est le risque le plus probable
   à long terme.
9. **Adresse de don** : elle relie publiquement ce dépôt à toute l'activité
   on-chain de cette adresse. Utiliser une adresse neuve, dédiée aux dons.

## Avant de passer le dépôt en public

- Vérifier l'historique git complet (`git log -p`, ou `gitleaks detect`) : un
  secret supprimé dans un commit récent reste visible dans l'historique.
- Vérifier qu'aucune vraie adresse personnelle ne figure dans les tests ou
  captures (les vecteurs actuels sont publics : `abandon…`, Hardhat, TREZOR).
- Garder la mention « expérimental, non audité » tant qu'une revue
  indépendante et des tests sur Ledger physique n'ont pas été faits.
