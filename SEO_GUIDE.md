# Guide SEO - MovieHunt Blog

## 🎯 Améliorations SEO Implémentées

### 1. **Meta Tags Dynamiques** ✅

Chaque page a maintenant des meta tags optimisés qui changent dynamiquement :

#### Page d'accueil
- Titre : "Accueil - Critiques et analyses de films | MovieHunt Blog"
- Description personnalisée
- Keywords ciblés : films méconnus, pépites cinéma, etc.

#### Pages d'articles
- Titre : Utilise `article.seo.metaTitle` ou `article.title`
- Description : Utilise `article.seo.metaDescription` ou `article.excerpt`
- Keywords : Générés automatiquement depuis les tags, genres, acteurs
- Image : Image de couverture de l'article

### 2. **Open Graph & Twitter Cards** ✅

Toutes les pages incluent maintenant :
- **Open Graph** (Facebook, LinkedIn, WhatsApp)
  - og:type, og:url, og:title, og:description, og:image
  - og:site_name, og:locale
  - Pour les articles : article:published_time, article:author, article:tag

- **Twitter Cards**
  - twitter:card (summary_large_image)
  - twitter:title, twitter:description, twitter:image

### 3. **Schema.org JSON-LD** ✅

Chaque article inclut des données structurées pour Google :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Titre de l'article",
  "description": "Extrait",
  "image": ["url-image"],
  "datePublished": "2024-01-01",
  "author": {
    "@type": "Organization",
    "name": "MovieHunt"
  },
  "about": {
    "@type": "Movie",
    "name": "Titre du film",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 7.5,
      "bestRating": 10
    }
  }
}
```

### 4. **Sitemap XML Dynamique** ✅

- **URL** : `https://blog.moviehunt.fr/api/sitemap.xml`
- Généré automatiquement depuis la base de données
- Inclut :
  - Page d'accueil (priority: 1.0, changefreq: daily)
  - Tous les articles publiés (priority: 0.8, changefreq: weekly)
- Mis à jour automatiquement quand un nouvel article est publié

### 5. **Robots.txt** ✅

Fichier `robots.txt` configuré :
```
User-agent: *
Allow: /

Sitemap: https://blog.moviehunt.fr/sitemap.xml

Crawl-delay: 1

Disallow: /admin
Disallow: /login
```

### 6. **Balises Canonical** ✅

Chaque page a une balise `<link rel="canonical">` pour éviter le contenu dupliqué.

---

## 📊 Problème : Contenu Non Visible dans le HTML Source

### ⚠️ Le Problème

Actuellement, le blog est une **SPA (Single Page Application)** React. Cela signifie :

1. **Le HTML source est vide** :
   ```html
   <div id="root"></div>
   ```

2. **Le contenu est généré par JavaScript** :
   - Les crawlers de Google doivent exécuter le JavaScript
   - Certains crawlers (réseaux sociaux) ne voient pas le contenu
   - Temps de chargement plus long pour l'indexation

3. **Impact SEO** :
   - ❌ Contenu non visible immédiatement
   - ❌ Temps de First Contentful Paint plus long
   - ❌ Moins bon pour le référencement

### ✅ Solutions Possibles

#### Option 1 : **Pre-rendering avec React Snap** (Facile)
- Génère des fichiers HTML statiques au build
- Bon pour les sites avec peu de pages dynamiques
- **Avantages** : Simple à mettre en place
- **Inconvénients** : Nécessite un rebuild à chaque nouvel article

#### Option 2 : **Server-Side Rendering (SSR) avec Next.js** (Recommandé)
- Migrer vers Next.js pour le SSR
- Le HTML est généré côté serveur
- **Avantages** : 
  - Meilleur SEO
  - Meilleur temps de chargement
  - Contenu visible dans le source
- **Inconvénients** : Nécessite une migration

#### Option 3 : **Static Site Generation (SSG) avec Next.js**
- Génère des pages HTML statiques au build
- Utilise `getStaticProps` et `getStaticPaths`
- **Avantages** :
  - Performance maximale
  - Bon SEO
  - Hébergement simple
- **Inconvénients** : Nécessite un rebuild pour les nouveaux articles

#### Option 4 : **Hybrid avec Incremental Static Regeneration (ISR)**
- Next.js avec ISR
- Régénère les pages à la demande
- **Avantages** :
  - Meilleur des deux mondes
  - Pas besoin de rebuild complet
  - Excellent SEO
- **Inconvénients** : Nécessite Next.js

---

## 🚀 Recommandation

Pour un blog avec génération automatique d'articles, je recommande :

### **Migration vers Next.js avec ISR**

**Pourquoi ?**
1. ✅ Contenu visible dans le HTML source
2. ✅ Excellent SEO
3. ✅ Performance optimale
4. ✅ Pas besoin de rebuild à chaque article
5. ✅ Support natif des meta tags dynamiques
6. ✅ API routes intégrées

**Comment ?**
1. Créer un nouveau projet Next.js
2. Migrer les composants React existants
3. Utiliser `getStaticProps` pour les articles
4. Configurer ISR avec `revalidate`
5. Garder l'API backend actuelle

**Exemple de page article avec ISR** :
```javascript
export async function getStaticProps({ params }) {
  const article = await fetch(`/api/articles/slug/${params.slug}`);
  return {
    props: { article },
    revalidate: 3600 // Régénère toutes les heures
  };
}
```

---

## 📈 Vérification SEO

### Outils pour tester

1. **Google Search Console**
   - Soumettre le sitemap
   - Vérifier l'indexation
   - Tester les rich results

2. **Test des Rich Results**
   - https://search.google.com/test/rich-results
   - Vérifier les données structurées

3. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Vérifier les Core Web Vitals

4. **Debugger Open Graph**
   - Facebook : https://developers.facebook.com/tools/debug/
   - Twitter : https://cards-dev.twitter.com/validator

5. **Voir le HTML source**
   ```bash
   curl https://blog.moviehunt.fr/article/butchers-crossing
   ```

---

## 🔧 Configuration Requise

### Variables d'environnement

Ajouter dans `.env` :
```bash
# Client
VITE_SITE_URL=https://blog.moviehunt.fr

# Server
CLIENT_URL=https://blog.moviehunt.fr
```

### Soumettre le sitemap à Google

1. Aller sur Google Search Console
2. Ajouter le sitemap : `https://blog.moviehunt.fr/api/sitemap.xml`
3. Attendre l'indexation (quelques jours)

---

## 📝 Checklist SEO

- [x] Meta tags dynamiques (title, description, keywords)
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Schema.org JSON-LD
- [x] Sitemap XML dynamique
- [x] Robots.txt
- [x] Balises canonical
- [ ] **Contenu visible dans le HTML source** (nécessite SSR/SSG)
- [ ] Soumettre le sitemap à Google Search Console
- [ ] Créer une image og-image.jpg par défaut
- [ ] Optimiser les images (lazy loading, WebP)
- [ ] Ajouter des liens internes entre articles
- [ ] Créer une page 404 personnalisée avec SEO

---

## 🎨 Prochaines Étapes

1. **Court terme** (sans migration) :
   - Créer une image `og-image.jpg` par défaut
   - Soumettre le sitemap à Google
   - Optimiser les images des articles

2. **Moyen terme** (migration recommandée) :
   - Migrer vers Next.js avec ISR
   - Implémenter le SSR pour le contenu
   - Améliorer les Core Web Vitals

3. **Long terme** :
   - Ajouter des breadcrumbs
   - Créer des pages catégories/tags
   - Implémenter AMP (Accelerated Mobile Pages)
   - Ajouter des liens internes intelligents
