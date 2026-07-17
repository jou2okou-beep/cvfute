# Guide de lancement CVFuté

## 1. Brancher Stripe (~20 min, gratuit)

1. Crée un compte sur [stripe.com](https://stripe.com) (gratuit ; commission ~1,5 % + 0,25 €
   uniquement quand tu encaisses). Il faudra ton IBAN et une pièce d'identité pour recevoir
   les virements.
2. Dashboard Stripe → **Catalogue de produits → Ajouter un produit** :
   « Pack Pro CVFuté », prix unique **9,90 € TTC**.
3. **Liens de paiement (Payment Links) → Créer un lien** sur ce produit :
   - Active « Collecter l'adresse email ».
   - Dans **Page de confirmation** : choisis « Afficher un message personnalisé » et colle :
     > Merci ! Votre code Pack Pro : **CVPRO-XXXX-XXXX** — entrez-le sur cvfute via
     > « J'ai déjà un code ». Gardez cet email précieusement.
   - Remplace `CVPRO-XXXX-XXXX` par un code de `codes_prives.txt` (fichier local, jamais publié).
   - Active le reçu par email (le client garde ainsi son code).
4. Copie l'URL du lien (`https://buy.stripe.com/...`) et remplace la valeur de `STRIPE_LINK`
   dans `js/app.js`, puis pousse (`git add -A; git commit -m "Stripe"; git push`).

**Rotation des codes** : tous les ~20 ventes, change le code affiché dans le message de
confirmation (n'importe lequel de `codes_prives.txt`). Tous les codes restent valides à vie
pour les acheteurs passés. Pour en générer d'autres : `python scripts/generate_codes.py 100`.

## 2. Marketing réseaux sociaux (0 €)

**Le format qui marche : avant/après.** Un CV Word moche → 15 s de remplissage accéléré
dans CVFuté → le PDF final propre. À décliner en boucle.

- **TikTok / Reels / Shorts** (canal principal) : 1 vidéo/jour pendant 30 jours.
  Angles : « Ton CV te fait rater des entretiens », « CV étudiant sans expérience »,
  « Les 5 erreurs qui poubellisent ton CV », « Recruteur : ce que je vois en 6 secondes ».
  Hashtags : #cv #emploi #recherchedemploi #entretien #etudiant #alternance #stage.
- **Périodes chaudes** : rentrée (sept-oct), janvier, et avril-juin (stages/alternance/jobs d'été).
- **LinkedIn** : 2 posts/semaine de conseils CV, lien en commentaire.
- **Communautés** : réponses utiles (pas de spam) sur les subreddits emploi FR et groupes
  Facebook « recherche d'emploi » / « alternance ».
- L'argument différenciant à marteler : **« sans inscription, tes données restent chez toi,
  et le PDF est vraiment gratuit »** — tous les concurrents font payer à la fin ou exigent un compte.

Quand les premières ventes arrivent : réinvestis 50-100 € en Spark Ads TikTok sur la vidéo
organique qui a le mieux marché.

## 3. Obligations légales (légères)

- Site sans compte, sans cookie, sans collecte : pas de bandeau RGPD nécessaire.
- En tant que vendeur, il te faut une page **Mentions légales / CGV** avec ton identité de
  vendeur et l'email de contact — à ajouter avant les premières pubs. Vendre nécessite un
  statut (l'auto-entreprise se crée gratuitement en ligne — ironie appréciée).
- Droit de rétractation numérique : prévoir la case « exécution immédiate » dans les CGV.

## 4. Éteindre FactuZen (5 min, quand tu veux)

Le remplacement du dépôt GitHub est déjà fait. Il reste, depuis tes comptes :

- **Render** : dashboard → service `factuzen` → Settings → **Delete service**
  (sinon il tentera des déploiements en échec à chaque push et t'enverra des emails).
- **Neon** : dashboard → projet → Settings → **Delete project**.

Rien ne coûte tant que tu ne le fais pas ; c'est juste du ménage.
