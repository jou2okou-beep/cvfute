# CVFuté

**Un CV professionnel en 5 minutes, sans inscription.**

Générateur de CV français 100 % côté navigateur : aucune donnée n'est envoyée sur un serveur
(saisie et sauvegarde en localStorage), le PDF est produit par l'impression native du navigateur.

- **Hébergement** : site statique (GitHub Pages) — zéro serveur, zéro base de données, zéro maintenance.
- **Modèle économique** : 2 modèles de CV gratuits ; Pack Pro à 9,90 € en paiement unique
  (Stripe Payment Link) qui délivre un code de déblocage.

## Développement

Aucun build. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python -m http.server 8080
```

## Codes Pack Pro

```bash
python scripts/generate_codes.py 100
```

Publie les empreintes SHA-256 dans `js/codes.js` (committé) et ajoute les codes en clair dans
`codes_prives.txt` (**jamais committé** — voir `.gitignore`). Après un paiement Stripe, le code
est montré au client via le message de confirmation du Payment Link.

## Structure

```
index.html          # landing + éditeur + aperçu + tarifs + FAQ
css/style.css       # site, 6 modèles de CV (2 gratuits, 4 Pro), impression A4
js/app.js           # état, rendu live, localStorage, déblocage Pro (SHA-256)
js/codes.js         # empreintes des codes Pro (généré)
scripts/generate_codes.py
```
