# Migration vers Next.js - Plan d'Action

## 🎯 Objectif
Migrer le blog React/Vite actuel vers Next.js avec ISR pour améliorer le SEO en rendant le contenu visible dans le HTML source.

## 📋 Stratégie de Migration

### Option 1 : Migration Progressive (Recommandée)
Transformer progressivement le client React actuel en Next.js.

**Avantages** :
- ✅ Garde tout le code existant
- ✅ Migration par étapes
- ✅ Moins de risques
- ✅ Peut tester en parallèle

**Étapes** :
1. Installer Next.js dans le dossier client
2. Créer la structure Next.js (pages/, public/, etc.)
3. Migrer les composants un par un
4. Configurer ISR pour les articles
5. Tester et déployer

### Option 2 : Nouveau Projet Next.js
Créer un nouveau projet et migrer le code.

**Avantages** :
- ✅ Structure Next.js propre dès le départ
- ✅ Dernières best practices

**Inconvénients** :
- ❌ Plus de travail de migration
- ❌ Risque de perdre des configurations

## 🚀 Plan de Migration Détaillé (Option 1)

### Phase 1 : Installation et Configuration

```bash
cd client
npm install next@latest react@latest react-dom@latest
```

Créer `next.config.js` :
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.moviehunt.fr', 'image.tmdb.org'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
```

### Phase 2 : Structure des Dossiers

```
client/
├── pages/              # Pages Next.js
│   ├── index.tsx       # Page d'accueil
│   ├── article/
│   │   └── [slug].tsx  # Page article avec ISR
│   ├── admin/
│   │   ├── index.tsx
│   │   └── edit/[id].tsx
│   ├── login.tsx
│   ├── _app.tsx        # App wrapper
│   └── _document.tsx   # HTML document
├── src/
│   ├── components/     # Composants existants
│   ├── services/       # Services API
│   ├── contexts/       # Contexts React
│   └── styles/         # Styles
├── public/             # Assets statiques
└── next.config.js
```

### Phase 3 : Migration des Pages

#### 1. Page d'accueil (`pages/index.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { articlesAPI } from '@/services/api';
import SEO from '@/components/SEO';
import ArticleCard from '@/components/ArticleCard';

export default function Home({ articles, totalPages }) {
  return (
    <>
      <SEO
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt."
        url="/"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8">
          Bienvenue sur le <span className="text-primary-600">MovieHunt Blog</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await articlesAPI.getAll({
      page: 1,
      limit: 9,
      status: 'published',
    });
    
    return {
      props: {
        articles: response.data.data.articles,
        totalPages: response.data.data.pagination.pages,
      },
      revalidate: 3600, // ISR : Régénère toutes les heures
    };
  } catch (error) {
    return {
      props: {
        articles: [],
        totalPages: 1,
      },
      revalidate: 60,
    };
  }
};
```

#### 2. Page Article (`pages/article/[slug].tsx`)

```typescript
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { articlesAPI } from '@/services/api';
import SEO from '@/components/SEO';
import ArticleSchema from '@/components/ArticleSchema';

export default function ArticlePage({ article }) {
  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <>
      <SEO
        title={article.seo?.metaTitle || article.title}
        description={article.seo?.metaDescription || article.excerpt}
        image={article.coverImage}
        url={`/article/${article.slug}`}
        type="article"
        article={{
          publishedAt: article.publishedAt,
          modifiedAt: article.updatedAt,
          author: 'MovieHunt',
          tags: article.tags,
        }}
      />
      
      <ArticleSchema article={article} />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        {article.coverImage && (
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full rounded-xl mb-8"
          />
        )}
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await articlesAPI.getAll({
      limit: 100,
      status: 'published',
    });
    
    const paths = response.data.data.articles.map((article) => ({
      params: { slug: article.slug },
    }));
    
    return {
      paths,
      fallback: 'blocking', // ISR : Génère les nouvelles pages à la demande
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const response = await articlesAPI.getBySlug(params.slug as string);
    
    return {
      props: {
        article: response.data.data,
      },
      revalidate: 3600, // ISR : Régénère toutes les heures
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
```

### Phase 4 : Configuration

#### `pages/_app.tsx`

```typescript
import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </HelmetProvider>
  );
}
```

#### `pages/_document.tsx`

```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script async src="https://scripts.withcabin.com/hello.js" />
      </body>
    </Html>
  );
}
```

### Phase 5 : Adapter les Services API

Les services API doivent fonctionner côté serveur. Modifier `services/api.js` :

```javascript
import axios from 'axios';

const getApiUrl = () => {
  // Côté serveur
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://localhost:5000/api';
  }
  // Côté client
  return process.env.NEXT_PUBLIC_API_URL || '/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... reste du code
```

### Phase 6 : Scripts package.json

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "export": "next export"
  }
}
```

### Phase 7 : Variables d'Environnement

Créer `.env.local` :
```bash
# API Backend
API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL
NEXT_PUBLIC_SITE_URL=https://blog.moviehunt.fr
```

## 🎯 Avantages de Next.js avec ISR

### Avant (React SPA)
```html
<!-- HTML Source -->
<div id="root"></div>
<script src="/assets/main.js"></script>
```
❌ Contenu invisible pour les crawlers

### Après (Next.js ISR)
```html
<!-- HTML Source -->
<article>
  <h1>Butcher's Crossing : Un western contemplatif</h1>
  <p>Découvrez Butcher's Crossing, un western atypique...</p>
  <div class="prose">
    <h2>Introduction</h2>
    <p>Le contenu complet de l'article est ici...</p>
  </div>
</article>
```
✅ Contenu visible et indexable immédiatement

## 📊 Comparaison Performance

| Métrique | React SPA | Next.js ISR |
|----------|-----------|-------------|
| **First Contentful Paint** | ~2s | ~0.5s |
| **Time to Interactive** | ~3s | ~1s |
| **SEO Score** | 70/100 | 95/100 |
| **HTML Source** | Vide | Complet |
| **Indexation Google** | Lente | Rapide |

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Configuration Vercel
```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/.next",
  "framework": "nextjs",
  "env": {
    "API_URL": "@api-url",
    "NEXT_PUBLIC_API_URL": "@next-public-api-url"
  }
}
```

## ⚠️ Points d'Attention

1. **Authentification** : Les pages admin doivent rester CSR (Client-Side Rendering)
2. **API Calls** : Utiliser `getStaticProps` pour les données publiques, `getServerSideProps` pour les données privées
3. **Images** : Utiliser `next/image` pour l'optimisation automatique
4. **Routing** : Adapter les liens avec `next/link`
5. **CSS** : TailwindCSS fonctionne directement

## 📝 Checklist de Migration

- [ ] Installer Next.js et dépendances
- [ ] Créer la structure pages/
- [ ] Migrer _app.tsx et _document.tsx
- [ ] Migrer la page d'accueil avec getStaticProps
- [ ] Migrer la page article avec getStaticPaths + ISR
- [ ] Adapter les services API pour SSR
- [ ] Migrer les pages admin (CSR)
- [ ] Tester en local
- [ ] Configurer les variables d'environnement
- [ ] Déployer sur Vercel
- [ ] Vérifier le HTML source
- [ ] Tester avec Google Rich Results
- [ ] Soumettre le nouveau sitemap

## 🎓 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
