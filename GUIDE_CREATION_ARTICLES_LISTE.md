# Guide de Création d'Articles de Type "Liste" avec Carrousels TMDB

Ce guide documente le processus complet pour créer des articles de type "liste" avec des carrousels d'images de films provenant de l'API TMDB.

## 🎯 Objectif Principal : Maximiser le Trafic Organique

**Ces articles sont conçus avant tout pour générer du trafic SEO.** Chaque décision éditoriale doit être guidée par cette question : *est-ce que ça amène des visiteurs depuis Google ?*

### Règles d'or pour le trafic organique :
- **Cibler une requête à fort volume** : utilise Google Trends, Semrush ou simplement les suggestions Google pour valider que la requête principale est recherchée (ex: "films comme Shutter Island" → volume élevé).
- **Titre H1 = requête principale** : le titre de l'article doit contenir exactement la requête cible.
- **Couvrir les requêtes longue traîne** : utilise les sections H2 et la FAQ pour répondre à des variantes ("film avec twist comme Shutter Island", "film psychologique après Shutter Island", etc.).
- **FAQ obligatoire** : minimum 3-4 questions qui couvrent les requêtes longue traîne liées. Format `<details>/<summary>` avec bordure rouge.
- **Volume > Qualité** : un article de liste bien ciblé sur une requête à 10 000 recherches/mois vaut mieux qu'un chef-d'œuvre sur une requête à 50 recherches/mois.

## 📋 Vue d'ensemble

Les articles de type "liste" sont des articles qui présentent plusieurs films avec :
- Un carrousel d'images pour chaque film (3 images par film)
- Des informations structurées (genre, casting, pitch, avis)
- Une mise en page HTML avec des styles inline pour les carrousels

## 🔧 Prérequis

- Clé API TMDB : `adaae6de59a1a0ef031be9c4b22907b0` (dans `.env` : `TMDB_API_KEY`)
- Accès Supabase :
  - URL : `SUPABASE_URL` (dans `.env`)
  - Service Role Key : `SUPABASE_SERVICE_ROLE_KEY` (dans `.env`)
- Node.js avec les packages : `axios`, `@supabase/supabase-js`

## 📝 Processus Étape par Étape

### Étape 1 : Récupération des Données TMDB

Créer un script pour récupérer les IDs TMDB et les images des films :

```javascript
const axios = require('axios');
const fs = require('fs');

const TMDB_API_KEY = 'adaae6de59a1a0ef031be9c4b22907b0';
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = [
  { title: "Nom du Film", year: 2019 },
  // ... autres films
];

async function fetchMovieImages(movieId) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      params: { api_key: TMDB_API_KEY }
    });
    const images = response.data.backdrops.slice(0, 3).map(img => 
      `https://image.tmdb.org/t/p/original${img.file_path}`
    );
    return images;
  } catch (error) {
    console.error(`Error fetching images for movie ${movieId}:`, error.message);
    return [];
  }
}

async function searchMovies() {
  const results = [];
  for (const movie of movies) {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: movie.title,
          year: movie.year,
          language: 'fr-FR'
        }
      });
      
      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        const images = await fetchMovieImages(result.id);
        results.push({
          title: movie.title,
          id: result.id,
          poster: `https://image.tmdb.org/t/p/original${result.poster_path}`,
          images: images
        });
      }
    } catch (error) {
      console.error(`Error searching ${movie.title}:`, error.message);
    }
  }
  
  fs.writeFileSync('tmdb_results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to tmdb_results.json');
}

searchMovies();
```

**Exécution :**
```bash
node test_tmdb.js
```

### Étape 2 : Structure HTML du Contenu

Le contenu de l'article doit être en HTML avec cette structure pour chaque film :

```html
<h2>1. Titre du Film (Année)</h2>
<ul>
  <li><strong>Genre :</strong> Genre du film</li>
  <li><strong>Casting :</strong> Acteurs principaux</li>
</ul>

<div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0; padding: 10px 0; scroll-snap-type: x mandatory;">
  <!-- Image 1 : OBLIGATOIREMENT l'affiche officielle du film (poster TMDB, taille w342 ou w500) -->
  <img src="https://image.tmdb.org/t/p/w342/POSTER.jpg" alt="Affiche Titre du Film (Année)" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />
  <!-- Images 2, 3, 4 : backdrops (captures du film) — doivent être visuellement différentes -->
  <img src="https://image.tmdb.org/t/p/original/BACKDROP1.jpg" alt="Titre du Film (Année)" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />
  <img src="https://image.tmdb.org/t/p/original/BACKDROP2.jpg" alt="Titre du Film (Année)" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />
  <img src="https://image.tmdb.org/t/p/original/BACKDROP3.jpg" alt="Titre du Film (Année)" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />
</div>

<p><strong>Le pitch :</strong> Description du film...</p>
<p><strong>Pourquoi il faut le voir :</strong> Raisons de regarder le film...</p>
```

**Structure obligatoire du carrousel (4 images) :**
- **Image 1** : affiche officielle du film (`poster_path` TMDB, taille `w342`)
- **Images 2-4** : backdrops du film (`backdrops` TMDB, taille `original`) — choisir des images visuellement différentes (pas deux scènes similaires)
- **Si TMDB manque d'images** : la contrainte est relaxée, mettre ce qui est disponible

**Points importants :**
- Les styles sont **inline** (pas de classes CSS externes)
- Hauteur fixe des images : `300px`
- `scroll-snap-type: x mandatory` pour un défilement fluide
- Attributs `loading="lazy"` et `decoding="async"` pour les performances
- Alt de l'affiche : `"Affiche [Titre] ([Année])"` — alt des backdrops : `"[Titre] ([Année])"`

### Étape 3 : Préparation du Visuel Principal

1. Copier le visuel dans `client/public/` avec un nom descriptif
2. Utiliser un nom en kebab-case (ex: `7-plot-twists-2026.png`)

```bash
cp "/chemin/source/visuel.png" "client/public/nom-article.png"
```

**⚠️ Important : Format de l'image de couverture**

L'image de couverture s'affiche avec `object-cover` pour remplir tout le cadre sans marges :
- L'image remplit complètement le conteneur (pas de marges sur les côtés)
- L'image peut être rognée en haut/bas ou sur les côtés selon son ratio
- L'image est centrée dans le conteneur (`object-center`)
- Format recommandé : 16:9 (1920x1080) pour un affichage optimal sans rognage
- **Règle importante** : L'image doit remplir tout le cadre, pas de marges visibles

### Étape 4 : Création de l'Article dans Supabase

**⚠️ IMPORTANT : Utiliser les noms de colonnes snake_case de Supabase**

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ⚠️ Pas SUPABASE_SERVICE_KEY
);

const articleData = {
  title: "Titre de l'article",
  slug: "slug-de-larticle",  // Format kebab-case
  excerpt: "Description courte de l'article...",
  category: "list",  // ⚠️ Toujours "list" pour ce type d'article
  tags: ["Tag1", "Tag2", "Tag3"],
  status: "published",
  cover_image: "/nom-visuel.png",  // ⚠️ snake_case, pas coverImage
  source_url: "https://www.moviehunt-blog.fr",  // ⚠️ Obligatoire
  metadata: {
    movieTitle: "Titre descriptif",
    releaseYear: "2026",
    genre: ["Liste", "Genre"]
  },
  content: `<p>Contenu HTML complet...</p>`
};

async function createArticle() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Article créé avec succès!');
    console.log('URL:', 'https://www.moviehunt-blog.fr/article/' + data.slug);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

createArticle();
```

### Étape 5 : Liens Internes (OBLIGATOIRE)

Les liens internes sont essentiels pour le SEO et le temps passé sur le site. **Ne jamais publier un article sans au moins 2-3 liens internes.**

#### Stratégie de maillage interne :
1. **Dans le corps de l'article** : lier chaque film qui possède déjà une critique sur MovieHunt.
2. **Dans la section "Que regarder après..."** : lier vers d'autres articles de liste pertinents.
3. **En conclusion** : lier vers un article de liste généraliste (ex: "Quel film regarder ce soir").

#### Comment trouver les articles à lier :
```javascript
// Chercher les articles liés dans Supabase
const { data } = await supabase
  .from('articles')
  .select('slug, title')
  .eq('status', 'published')
  .ilike('title', '%mot-clé%');
```

## 🎨 Design des Titres H2

Chaque titre `<h2>` d'un article de liste doit avoir un **trait rouge épais** en dessous. Utiliser le rouge MovieHunt : `#dc2626`.

```html
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">1. Titre du Film (Année)</h2>
```

Ce style s'applique à **tous les H2** de l'article (titres de films, sections SEO, FAQ, Conclusion). C'est un élément de charte graphique obligatoire pour les articles de type liste.

#### Format des liens internes :
```html
<!-- Dans le texte -->
<a href="/article/slug-article" style="color:#dc2626;font-weight:600;">Titre de l'article</a>

<!-- En bloc à la fin de l'article -->
<p>👉 À lire aussi : 
  <a href="/article/slug-1" style="color:#dc2626;">Article 1</a>, 
  <a href="/article/slug-2" style="color:#dc2626;">Article 2</a>
</p>
```

### Étape 6 : Déploiement

```bash
# Ajouter le visuel
git add "client/public/nom-visuel.png"
git commit -m "feat(article): Ajout du visuel pour l'article [titre]"
git push origin main
```

## ⚠️ Erreurs Courantes et Solutions

### Erreur 1 : "Route non trouvée" avec POST /api/articles

**Problème :** Il n'existe pas de route POST directe pour créer des articles.

**Solution :** Utiliser Supabase directement avec `@supabase/supabase-js`.

### Erreur 2 : "Could not find the 'coverImage' column"

**Problème :** Utilisation de camelCase au lieu de snake_case.

**Solution :** Utiliser `cover_image` au lieu de `coverImage`.

### Erreur 3 : "null value in column 'source_url' violates not-null constraint"

**Problème :** Le champ `source_url` est obligatoire dans Supabase.

**Solution :** Toujours inclure `source_url: "https://www.moviehunt-blog.fr"`.

### Erreur 4 : "supabaseKey is required"

**Problème :** Mauvais nom de variable d'environnement.

**Solution :** Utiliser `SUPABASE_SERVICE_ROLE_KEY` (pas `SUPABASE_SERVICE_KEY`).

### Erreur 5 : Contenu HTML affiché brut

**Problème :** Le composant article utilise `ReactMarkdown` qui attend du Markdown.

**Solution :** Le contenu doit être en HTML. Le composant `[slug].tsx` utilise `dangerouslySetInnerHTML` pour afficher le HTML.

## 📊 Structure des Données

### Champs Obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `title` | string | Titre de l'article |
| `slug` | string | URL-friendly (kebab-case) |
| `excerpt` | string | Description courte |
| `category` | string | Toujours "list" |
| `tags` | array | Liste de tags |
| `status` | string | "published" ou "draft" |
| `cover_image` | string | Chemin vers l'image |
| `source_url` | string | URL source (obligatoire) |
| `content` | string | Contenu HTML complet |

### Champs Optionnels

| Champ | Type | Description |
|-------|------|-------------|
| `metadata` | object | Métadonnées du film |
| `metadata.movieTitle` | string | Titre descriptif |
| `metadata.releaseYear` | string | Année |
| `metadata.genre` | array | Genres |

## 🎨 Exemple Complet

Voir l'article "7 Films avec un Plot Twist Final Incroyable" :
- URL : https://www.moviehunt-blog.fr/article/7-films-plot-twist-incroyable
- Fichier de création : `create_article.js`
- Résultats TMDB : `tmdb_results.json`

## 📚 Références

- API TMDB : https://developers.themoviedb.org/3
- Supabase JS Client : https://supabase.com/docs/reference/javascript
- Modèle Article : `server/models/supabase/Article.js`
- Page Article : `client/pages/article/[slug].tsx`

## 🔄 Workflow Recommandé

1. ✅ Valider la requête cible (volume de recherche suffisant)
2. ✅ Lister les films avec titre et année
3. ✅ Exécuter le script TMDB pour récupérer les images (3 backdrops par film)
4. ✅ Rédiger le contenu HTML avec les carrousels
5. ✅ Ajouter les liens internes (minimum 2-3)
6. ✅ Ajouter la FAQ longue traîne (minimum 3 questions)
7. ✅ Copier le visuel principal dans `client/public/` (format 16:9)
8. ✅ Créer/mettre à jour l'article avec le script Supabase
9. ✅ Commit et push
10. ✅ Vérifier l'article en ligne après déploiement

## 💡 Conseils

- **Toujours** tester le script TMDB avant de créer l'article
- **Vérifier** que les 3 images sont bien récupérées pour chaque film
- **Utiliser** des noms de fichiers descriptifs pour les visuels
- **Garder** une copie du script de création pour référence
- **Attendre** 2-3 minutes après le push pour voir l'article en ligne (temps de déploiement Vercel)
- **Liens internes** : toujours chercher dans Supabase les articles publiés liés avant de finaliser
- **SEO** : le titre H1 doit contenir exactement la requête principale recherchée sur Google
- **FAQ** : couvrir au minimum les variantes "film similaire à X", "film avec twist comme X", "film psychologique comme X"
