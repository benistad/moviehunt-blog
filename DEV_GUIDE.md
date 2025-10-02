# 🛠️ Guide de Développement - MovieHunt Blog

## 🚀 Démarrage du projet

### Backend (API)
```bash
cd /Users/benoitdurand/Library/Mobile\ Documents/com~apple~CloudDocs/DEV/WINDSURF/MovieHunt\ le\ Blog
PORT=5001 node server/index.js
```

### Frontend (Interface)
```bash
cd /Users/benoitdurand/Library/Mobile\ Documents/com~apple~CloudDocs/DEV/WINDSURF/MovieHunt\ le\ Blog/client
npm run dev
```

## ⚠️ CRITIQUE : Redémarrage OBLIGATOIRE après CHAQUE modification

**RÈGLE D'OR : Après CHAQUE modification de code, vous DEVEZ TOUJOURS redémarrer BACKEND ET FRONTEND**

### 🔴 Pourquoi redémarrer les deux ?

Même si vous modifiez uniquement le backend ou uniquement le frontend, **redémarrez TOUJOURS les deux** pour éviter :
- Erreurs de cache
- Incompatibilités entre versions
- Bugs difficiles à déboguer

### 1. Backend (TOUJOURS redémarrer)
```bash
# Tuer le processus backend
pkill -9 node

# Relancer
PORT=5001 node server/index.js &
```

### 2. Frontend (TOUJOURS redémarrer)
**ATTENTION** : Même si Vite a le Hot Module Replacement (HMR), il est **FORTEMENT RECOMMANDÉ** de redémarrer manuellement :
```bash
# Tuer le processus frontend
pkill -f "vite"

# Relancer
cd client && npm run dev
```

### 3. Script de redémarrage complet (RECOMMANDÉ)
```bash
# Tout tuer
pkill -9 node && pkill -f "vite"

# Attendre 1 seconde
sleep 1

# Relancer backend
PORT=5001 node server/index.js &

# Attendre que le backend démarre
sleep 2

# Relancer frontend
cd client && npm run dev
```

### ⚡ Commande rapide (tout-en-un)
```bash
pkill -9 node && pkill -f "vite" && sleep 1 && PORT=5001 node server/index.js & sleep 2 && cd client && npm run dev
```

## 🔍 Vérifier que tout tourne

```bash
# Vérifier les ports utilisés
lsof -ti:5001,5173

# Tester le backend
curl http://localhost:5001/api/health

# Tester le frontend
curl http://localhost:5173
```

## 📦 Stack Technique

### Base de données
- **Supabase** uniquement (PostgreSQL)
- Pas de MongoDB
- Modèles dans `/server/models/supabase/`

### Backend
- **Node.js** + Express
- **Supabase Client** pour la BDD
- **OpenAI API** pour génération d'articles
- **TMDB API** pour images et données films
- **Axios** pour scraping MovieHunt

### Frontend
- **React** + Vite
- **React Router** pour navigation
- **TipTap** pour éditeur WYSIWYG
- **Tailwind CSS** pour styling
- **Cabin Analytics** pour analytics

## 🗂️ Structure des fichiers

```
MovieHunt le Blog/
├── server/
│   ├── config/
│   │   └── supabase.js          # Configuration Supabase
│   ├── models/
│   │   ├── index.js             # Export des modèles
│   │   └── supabase/
│   │       ├── Article.js       # Modèle Article + Query Builder
│   │       └── UrlQueue.js      # Modèle Queue + Query Builder
│   ├── routes/
│   │   ├── articles.js          # Routes articles
│   │   ├── queue.js             # Routes queue
│   │   ├── tmdb.js              # Routes TMDB
│   │   └── import.js            # Import en masse
│   ├── services/
│   │   ├── aiService.js         # Génération GPT
│   │   ├── scraperService.js    # Scraping MovieHunt
│   │   ├── tmdbService.js       # API TMDB
│   │   └── articleGeneratorService.js
│   └── index.js                 # Point d'entrée
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RichTextEditor.jsx    # Éditeur TipTap
│   │   │   └── ImageSelector.jsx     # Sélecteur images TMDB
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── ArticleEditor.jsx
│   │   │   └── ArticleDetail.jsx
│   │   └── services/
│   │       └── api.js           # Client API
│   └── index.html
└── .env                         # Variables d'environnement
```

## 🔐 Variables d'environnement requises

```env
# Supabase (OBLIGATOIRE)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-xxx...

# TMDB (OBLIGATOIRE)
TMDB_API_KEY=xxx...
TMDB_API_READ_ACCESS_TOKEN=eyJxxx...

# Server (OBLIGATOIRE)
PORT=5001
CLIENT_URL=http://localhost:5173

# MovieHunt
MOVIEHUNT_URL=https://moviehunt.fr
```

## 🐛 Dépannage

### Erreur "EADDRINUSE"
Le port est déjà utilisé :
```bash
# Tuer tous les processus Node
pkill -9 node

# Ou tuer un port spécifique
lsof -ti:5001 | xargs kill -9
```

### Erreur Supabase
Vérifiez vos clés dans `.env` :
```bash
# Tester la connexion
curl -H "apikey: VOTRE_ANON_KEY" \
     -H "Authorization: Bearer VOTRE_SERVICE_KEY" \
     https://VOTRE_URL.supabase.co/rest/v1/articles
```

### Erreur "Cannot find module"
Réinstallez les dépendances :
```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### Frontend ne se charge pas
```bash
# Vérifier que Vite tourne
lsof -ti:5173

# Vérifier les logs
cd client && npm run dev
```

## 📝 Workflow de développement

### 1. Modifier le code
Éditez les fichiers dans `/server` ou `/client`

### 2. Redémarrer les serveurs
```bash
# Backend
pkill -9 node && PORT=5001 node server/index.js &

# Frontend (si nécessaire)
cd client && npm run dev
```

### 3. Tester dans le navigateur
Ouvrez http://localhost:5173

### 4. Vérifier les logs
- Backend : Logs dans le terminal où vous avez lancé `node server/index.js`
- Frontend : Console du navigateur (F12)

## 🚨 Règles importantes

1. **Toujours redémarrer après modification backend**
2. **Pas de fallbacks** - Erreurs explicites si données manquantes
3. **Supabase uniquement** - Pas de MongoDB
4. **camelCase → snake_case** - Conversion automatique dans les Query Builders
5. **Vérifier les variables d'environnement** - Le serveur refuse de démarrer si manquantes

## 📚 Ressources

- **Supabase Docs** : https://supabase.com/docs
- **TipTap Docs** : https://tiptap.dev/
- **TMDB API** : https://developers.themoviedb.org/3
- **OpenAI API** : https://platform.openai.com/docs

Bon développement ! 🚀
