# Tableau de bord de billetterie

Prototype React (Vite) d'une plateforme de gestion de billets. Il fonctionne sans serveur : toutes les données sont fictives et les modifications disparaissent au rechargement de la page.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrez l'adresse affichée dans le terminal (par défaut http://localhost:5173).

## Déployer sur Vercel

Avec la ligne de commande :

```bash
npx vercel --prod
```

Ou depuis le site : poussez le projet sur GitHub, puis importez-le sur vercel.com. Vercel détecte Vite tout seul. Le fichier `vercel.json` permet aux URL comme `/events` de fonctionner quand on recharge la page.

## Où modifier quoi

| Élément | Fichier |
| --- | --- |
| Nom de la marque, chiffres, acheteurs, événements | `src/data.js` |
| Textes en français et en anglais | `src/i18n.jsx` |
| Couleurs des thèmes clair et sombre, mise en page | `src/styles.css` |
| Version précédente du design (non utilisée par le site) | `archive/design-v1/` |
| Menu et en-tête | `src/components/Layout.jsx` |
| Graphiques | `src/components/charts.jsx` |
| Pages | `src/pages/` |

## Limites du prototype

- Pas de base de données ni de vraie authentification : « Log out » mène à une simple page de démonstration.
- Les paiements et les remboursements ne sont pas réels.
