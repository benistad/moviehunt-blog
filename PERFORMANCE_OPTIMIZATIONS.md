# 🚀 Optimisations de Performance - MovieHunt Blog

## 📊 État actuel (PageSpeed Insights)

- **Score Mobile** : 64/100
- **First Contentful Paint (FCP)** : 3,3s ⚠️
- **Largest Contentful Paint (LCP)** : 6,2s 🔴
- **Total Blocking Time (TBT)** : 240ms 🟡
- **Cumulative Layout Shift (CLS)** : 0.101 ✅
- **Speed Index** : 3,4s ⚠️

## ✅ Optimisations appliquées

### 1. **Chargement asynchrone des fonts** ✅
- Utilisation de `media="print"` pour charger les fonts de manière non-bloquante
- Réduction des poids de fonts (400, 600, 700 au lieu de 300-800)
- Réduction des familles (Poppins et Inter uniquement)

**Impact attendu** : -0,5s sur FCP

### 2. **Chargement différé de Google Analytics** ✅
- GA chargé après l'événement `load` au lieu du parsing initial
- Pas de blocage du rendu

**Impact attendu** : -0,3s sur FCP, -100ms sur TBT

### 3. **Suppression de CKEditor sur les pages publiques** ✅
- CKEditor n'est plus chargé sur toutes les pages
- Économie de ~200KB de JavaScript

**Impact attendu** : -0,4s sur LCP, -150ms sur TBT

### 4. **Optimisation du cache des images** ✅
- Cache TTL augmenté de 60s à 24h
- Formats modernes (AVIF, WebP) activés
- Tailles d'images optimisées

**Impact attendu** : -1s sur LCP (visites répétées)

## 🔄 Optimisations recommandées (à faire)

### 1. **Preload de l'image LCP** 🎯 PRIORITÉ HAUTE
L'image de couverture de l'article est probablement le LCP. Il faut la preloader.

**Dans `pages/article/[slug].tsx`** :
```tsx
import Head from 'next/head';

// Dans le composant
<Head>
  <link
    rel="preload"
    as="image"
    href={article.coverImage}
    imageSrcSet={`${article.coverImage}?w=640 640w, ${article.coverImage}?w=1200 1200w`}
    imageSizes="(max-width: 768px) 100vw, 1200px"
  />
</Head>
```

**Impact attendu** : -2s sur LCP ⭐

### 2. **Utiliser Next.js Image au lieu de `<img>`** 🎯 PRIORITÉ HAUTE

Remplacer toutes les balises `<img>` par `<Image>` de Next.js :

```tsx
import Image from 'next/image';

// Au lieu de
<img src={article.coverImage} alt={article.title} />

// Utiliser
<Image
  src={article.coverImage}
  alt={article.title}
  width={1200}
  height={675}
  priority // Pour l'image LCP
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Générer avec plaiceholder
/>
```

**Impact attendu** : -1,5s sur LCP, amélioration CLS

### 3. **Lazy loading des images dans le contenu** 🎯 PRIORITÉ MOYENNE

Pour les images dans le markdown (ReactMarkdown) :

```tsx
<ReactMarkdown
  components={{
    img: ({ node, ...props }) => (
      <Image
        {...props}
        width={800}
        height={450}
        loading="lazy"
        alt={props.alt || ''}
      />
    ),
  }}
>
  {article.content}
</ReactMarkdown>
```

**Impact attendu** : -0,5s sur Speed Index

### 4. **Code splitting et dynamic imports** 🎯 PRIORITÉ MOYENNE

Charger les composants lourds de manière dynamique :

```tsx
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div>Chargement...</div>,
  ssr: true,
});
```

**Impact attendu** : -200ms sur TBT

### 5. **Optimiser les requêtes API** 🎯 PRIORITÉ MOYENNE

Utiliser ISR (Incremental Static Regeneration) au lieu de SSR :

```tsx
// Dans pages/article/[slug].tsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // ... fetch article
  return {
    props: { article },
    revalidate: 3600, // Régénérer toutes les heures
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Générer les paths des articles les plus populaires
  return {
    paths: [], // ou les 10 articles les plus lus
    fallback: 'blocking',
  };
};
```

**Impact attendu** : -1s sur TTFB (Time To First Byte)

### 6. **Minifier et compresser le CSS** 🎯 PRIORITÉ BASSE

Vérifier que Tailwind CSS est bien purgé en production :

```js
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
```

**Impact attendu** : -100ms sur FCP

### 7. **Ajouter un Service Worker pour le cache** 🎯 PRIORITÉ BASSE

Utiliser `next-pwa` pour mettre en cache les assets :

```bash
npm install next-pwa
```

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

**Impact attendu** : Amélioration des visites répétées

## 📈 Objectifs de performance

### Court terme (1 semaine)
- ✅ Score Mobile : **75+/100**
- ✅ LCP : **< 4s**
- ✅ FCP : **< 2s**

**Actions** : Preload LCP image + Next.js Image

### Moyen terme (1 mois)
- 🎯 Score Mobile : **85+/100**
- 🎯 LCP : **< 2,5s**
- 🎯 FCP : **< 1,5s**

**Actions** : ISR + Code splitting + Lazy loading

### Long terme (3 mois)
- 🌟 Score Mobile : **90+/100**
- 🌟 LCP : **< 2s**
- 🌟 FCP : **< 1s**

**Actions** : PWA + CDN + Optimisations avancées

## 🔧 Commandes utiles

### Tester les performances localement
```bash
npm run build
npm run start
# Puis tester avec Lighthouse dans Chrome DevTools
```

### Analyser le bundle
```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```

### Tester avec PageSpeed Insights
```bash
# URL à tester
https://pagespeed.web.dev/analysis?url=https://www.moviehunt-blog.fr
```

## 📊 Métriques à surveiller

### Core Web Vitals
- **LCP** (Largest Contentful Paint) : < 2,5s ✅
- **FID** (First Input Delay) : < 100ms ✅
- **CLS** (Cumulative Layout Shift) : < 0,1 ✅

### Autres métriques
- **TTFB** (Time To First Byte) : < 600ms
- **FCP** (First Contentful Paint) : < 1,8s
- **Speed Index** : < 3,4s
- **TBT** (Total Blocking Time) : < 200ms

## 🎯 Checklist d'optimisation

### Immédiat (aujourd'hui)
- [x] Chargement asynchrone des fonts
- [x] Différer Google Analytics
- [x] Supprimer CKEditor des pages publiques
- [x] Optimiser le cache des images
- [ ] Preload de l'image LCP
- [ ] Utiliser Next.js Image pour la cover image

### Cette semaine
- [ ] Remplacer toutes les `<img>` par `<Image>`
- [ ] Lazy loading des images markdown
- [ ] Code splitting des composants lourds
- [ ] Tester et mesurer les améliorations

### Ce mois
- [ ] Migrer vers ISR (getStaticProps)
- [ ] Optimiser les requêtes API
- [ ] Ajouter un CDN (Vercel Edge Network)
- [ ] Implémenter un PWA

## 🔗 Ressources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Dernière mise à jour** : 26 octobre 2025
**Prochaine révision** : 2 novembre 2025
