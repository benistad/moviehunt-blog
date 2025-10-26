# Instructions pour créer l'image Open Graph

## Option 1 : Utiliser Canva (Recommandé - Facile)

1. Aller sur [Canva](https://www.canva.com)
2. Créer un design personnalisé de **1200 x 630 pixels**
3. Utiliser ce template :
   - **Fond** : Dégradé sombre (#1a1a2e → #16213e)
   - **Titre** : "MovieHunt Blog" (Police Poppins Bold, 64px, blanc)
   - **Sous-titre** : "Critiques et analyses de films" (28px, gris clair)
   - **Icône** : 🎬 ou logo MovieHunt
   - **URL** : "www.moviehunt-blog.fr" (en bas, couleur #526FDA)
4. Télécharger en **JPG** (qualité maximale)
5. Renommer en `og-image.jpg`
6. Placer dans `/client/public/og-image.jpg`

## Option 2 : Utiliser Figma

1. Créer un frame de 1200 x 630 pixels
2. Suivre le même design que ci-dessus
3. Exporter en JPG (2x pour la qualité)

## Option 3 : Utiliser un service en ligne

### Avec Cloudinary ou Bannerbear
- Utiliser leur générateur d'images Open Graph
- Dimensions : 1200 x 630 pixels
- Format : JPG

### Avec un générateur automatique
- [og-image.vercel.app](https://og-image.vercel.app)
- Entrer le texte : "MovieHunt Blog"
- Télécharger l'image générée

## Option 4 : Convertir le SVG manuellement

1. Ouvrir `og-image.svg` dans un navigateur
2. Faire une capture d'écran en haute résolution
3. Redimensionner à 1200 x 630 pixels avec un outil comme :
   - Photoshop
   - GIMP (gratuit)
   - Preview sur Mac
   - Paint.NET sur Windows
4. Sauvegarder en JPG (qualité 90%)

## Option 5 : Utiliser un script Node.js (Avancé)

Si vous voulez automatiser, installez sharp :

\`\`\`bash
cd client
npm install --save-dev sharp
node scripts/generate-og-image.js
\`\`\`

## Vérification

Une fois l'image créée, vérifiez qu'elle est accessible :
- En local : `http://localhost:3000/og-image.jpg`
- En production : `https://www.moviehunt-blog.fr/og-image.jpg`

Testez avec :
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Dimensions recommandées

- **Facebook/LinkedIn** : 1200 x 630 pixels (ratio 1.91:1)
- **Twitter** : 1200 x 675 pixels (ratio 16:9) ou 1200 x 600 pixels
- **Notre choix** : 1200 x 630 pixels (compatible avec tous)

## Format et qualité

- **Format** : JPG (meilleure compatibilité que PNG)
- **Qualité** : 85-90% (bon compromis taille/qualité)
- **Poids** : < 300 KB idéalement
- **Couleurs** : RGB (pas CMYK)
