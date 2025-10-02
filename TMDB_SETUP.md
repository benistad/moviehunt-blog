# 🎬 Configuration de l'API TMDB

Ce guide vous explique comment obtenir une clé API TMDB pour enrichir vos articles avec des visuels et données complètes.

## 🔑 Obtenir une clé API TMDB

### 1. Créer un compte TMDB

1. Allez sur https://www.themoviedb.org/
2. Cliquez sur "S'inscrire" (Sign Up)
3. Créez votre compte gratuitement

### 2. Demander une clé API

1. Connectez-vous à votre compte
2. Allez dans **Paramètres** (Settings) : https://www.themoviedb.org/settings/account
3. Cliquez sur **API** dans le menu de gauche
4. Cliquez sur **Create** ou **Request an API Key**
5. Choisissez **Developer** (pas Commercial)
6. Acceptez les conditions d'utilisation
7. Remplissez le formulaire :
   - **Application Name** : MovieHunt Blog
   - **Application URL** : http://localhost:5173 (ou votre domaine)
   - **Application Summary** : Blog automatique pour critiques de films
8. Soumettez la demande

### 3. Récupérer vos clés

Vous recevrez **2 clés** :
- **API Key (v3 auth)** : Clé API classique
- **API Read Access Token (v4 auth)** : Token de lecture

## 📝 Configuration dans le projet

### 1. Ouvrez votre fichier `.env`

```bash
nano .env
```

### 2. Ajoutez vos clés TMDB

```env
# TMDB (The Movie Database)
TMDB_API_KEY=votre_clé_api_ici
TMDB_API_READ_ACCESS_TOKEN=votre_token_ici
```

### 3. Redémarrez le serveur

```bash
npm run dev
```

## ✨ Fonctionnalités TMDB

Une fois configuré, le blog enrichira automatiquement les articles avec :

### 📸 Visuels
- **Backdrop** : Image de fond haute qualité (1920x1080)
- **Poster** : Affiche du film (500x750)
- **Photos du casting** : Photos des acteurs

### 📊 Données complètes
- **Synopsis officiel** : Description complète du film
- **Note TMDB** : Note moyenne des utilisateurs (/10)
- **Durée** : Durée du film en minutes
- **Budget** : Budget de production
- **Box Office** : Recettes mondiales
- **Tagline** : Phrase d'accroche du film
- **Casting complet** : Liste des acteurs avec leurs rôles
- **Réalisateur** : Nom du réalisateur
- **Genres** : Genres du film
- **Date de sortie** : Date de sortie officielle

### 🤖 Amélioration de l'IA

GPT-4o mini reçoit toutes ces données pour :
- Écrire un synopsis plus complet
- Mentionner des informations précises (durée, budget, etc.)
- Parler du casting avec plus de détails
- Comparer la note TMDB avec la note MovieHunt

## 🔍 Exemple de données récupérées

Pour le film "Deepwater" :

```json
{
  "title": "Deepwater Horizon",
  "year": 2016,
  "runtime": 107,
  "genres": ["Action", "Drame", "Thriller"],
  "synopsis": "Le 20 avril 2010, l'explosion de la plateforme...",
  "tagline": "Quand la pression monte, l'héroïsme émerge",
  "voteAverage": 6.9,
  "budget": 110000000,
  "revenue": 121790373,
  "director": {
    "name": "Peter Berg"
  },
  "cast": [
    { "name": "Mark Wahlberg", "character": "Mike Williams" },
    { "name": "Kurt Russell", "character": "Jimmy Harrell" },
    { "name": "John Malkovich", "character": "Donald Vidrine" }
  ],
  "backdropUrl": "https://image.tmdb.org/t/p/original/...",
  "posterUrl": "https://image.tmdb.org/t/p/w500/..."
}
```

## 🚫 Si vous n'avez pas de clé TMDB

Le blog fonctionnera quand même ! Il utilisera :
- Les données de MovieHunt uniquement
- Les images par défaut (si disponibles)
- Un message dans les logs : "⚠️ TMDB_API_KEY non configurée"

## 📚 Documentation TMDB

- **Site officiel** : https://www.themoviedb.org/
- **Documentation API** : https://developers.themoviedb.org/3
- **Images** : https://developers.themoviedb.org/3/getting-started/images
- **Recherche** : https://developers.themoviedb.org/3/search/search-movies

## 💡 Conseils

1. **Gratuit** : L'API TMDB est 100% gratuite pour un usage non commercial
2. **Limites** : 40 requêtes par 10 secondes (largement suffisant)
3. **Cache** : Les données TMDB sont sauvegardées dans MongoDB
4. **Langue** : Les données sont récupérées en français (fr-FR)
5. **Fallback** : Si TMDB ne trouve pas le film, le blog utilise les données MovieHunt

## ✅ Vérification

Pour vérifier que TMDB fonctionne :

1. Générez un article
2. Regardez les logs du serveur :
   ```
   🎬 Recherche TMDB: "Deepwater" (2016)
   ✅ Film trouvé sur TMDB: Deepwater Horizon (293670)
   ✅ Données TMDB récupérées pour "Deepwater"
   ```
3. L'article devrait avoir :
   - Une image de fond de haute qualité
   - Des informations précises (durée, budget, etc.)
   - Un casting complet

Bon blogging avec TMDB ! 🎬✨
