# MovieHunt Blog - Générateur d'Articles IA

Blog automatique qui génère des articles à partir des pages de moviehunt.fr en utilisant OpenAI GPT-4o mini.

## 🚀 Fonctionnalités

- ✅ **Intégration API MovieHunt** : Utilise l'API JSON officielle pour des données fiables
- ✅ **Génération automatique d'articles** : Détecte les nouvelles pages sur moviehunt.fr
- ✅ **Ajout manuel d'URLs** : Interface pour ajouter manuellement des URLs à traiter
- ✅ **Import en masse** : Importez tous les films MovieHunt en une seule commande
- ✅ **Génération IA** : Utilise GPT-4o mini pour créer des articles de qualité (800-1200 mots)
- ✅ **Interface d'administration** : Gestion complète des articles avec statistiques
- ✅ **Blog moderne** : Interface utilisateur élégante avec React et TailwindCSS
- ✅ **Webhook support** : Automatisation complète via webhooks
- ✅ **SEO optimisé** : Meta-tags, slugs, sitemap-ready

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- Clé API OpenAI

## 🛠️ Installation

1. **Cloner et installer les dépendances**
```bash
npm run install-all
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. **Démarrer l'application**
```bash
# Mode développement (backend + frontend)
npm run dev

# Production
npm run build
npm start
```

## 🔧 Configuration

### Variables d'environnement

- `MONGODB_URI` : URI de connexion MongoDB
- `OPENAI_API_KEY` : Clé API OpenAI (obligatoire)
- `PORT` : Port du serveur backend (défaut: 5000)
- `MOVIEHUNT_URL` : URL du site MovieHunt
- `CLIENT_URL` : URL du frontend pour CORS

## 📁 Structure du projet

```
moviehunt-blog/
├── server/                 # Backend Node.js/Express
│   ├── config/            # Configuration (DB, OpenAI)
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── services/          # Services (scraping, IA)
│   ├── middleware/        # Middleware Express
│   └── index.js           # Point d'entrée
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/        # Pages
│   │   ├── services/     # Services API
│   │   └── App.jsx       # Composant principal
│   └── package.json
└── package.json
```

## 🎯 Utilisation

### Méthode 1 : Interface Admin (Recommandé)

1. Accéder à http://localhost:5173/admin
2. Onglet "Générer un article"
3. Entrer l'URL : `https://www.moviehunt.fr/films/deepwater`
4. Cliquer sur "Générer l'article"
5. L'article apparaît automatiquement sur le blog !

### Méthode 2 : Import en masse

```bash
# Importer les 10 premiers films
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'

# Traiter la queue
curl -X POST http://localhost:5000/api/queue/process \
  -d '{"limit": 5}'
```

### Méthode 3 : Webhook automatique

Configurez un webhook sur votre site MovieHunt :
```bash
POST http://votre-domaine.com/api/webhook/moviehunt
{
  "url": "https://www.moviehunt.fr/films/nouveau-film",
  "event": "page.created"
}
```

### API Endpoints Principaux

**Articles**
- `GET /api/articles` - Liste tous les articles
- `GET /api/articles/:id` - Récupère un article
- `POST /api/articles/generate` - Génère un article depuis une URL
- `PUT /api/articles/:id` - Met à jour un article
- `DELETE /api/articles/:id` - Supprime un article

**Import**
- `GET /api/import/films/available` - Liste tous les films MovieHunt
- `POST /api/import/films/bulk` - Import en masse
- `POST /api/import/film/:slug` - Importe un film spécifique
- `GET /api/import/stats` - Statistiques d'import

**Queue & Webhook**
- `GET /api/queue` - Liste la queue
- `POST /api/queue/process` - Traite la queue
- `POST /api/webhook/moviehunt` - Webhook pour nouvelles pages

## 🔐 Sécurité

- Helmet pour les headers HTTP sécurisés
- Validation des entrées avec express-validator
- Variables d'environnement pour les secrets
- CORS configuré

## 📚 Documentation Complète

- **[QUICK_START.md](QUICK_START.md)** - Démarrage rapide en 5 minutes
- **[MOVIEHUNT_API_GUIDE.md](MOVIEHUNT_API_GUIDE.md)** - Guide complet de l'API MovieHunt
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentation API REST
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guide de déploiement en production
- **[COPIER_COLLER_SUPABASE.md](COPIER_COLLER_SUPABASE.md)** - 🔄 **Keep-Alive Supabase (ULTRA SIMPLE - 5 min)**
- **[SUPABASE_KEEP_ALIVE_SIMPLE.md](SUPABASE_KEEP_ALIVE_SIMPLE.md)** - Guide détaillé Keep-Alive

## ✨ Exemple d'Article Généré

Pour le film "Deepwater" (note 5/10), l'IA génère automatiquement :

```markdown
# Deepwater : Le drame explosif de la plateforme pétrolière

## Introduction
En 2016, Peter Berg nous plonge au cœur de la catastrophe...

## Synopsis
Le 20 avril 2010, la plateforme pétrolière Deepwater Horizon...

## Ce qui fonctionne
- L'histoire vraie captivante
- La performance remarquable de Kurt Russell
- Les effets spéciaux impressionnants

## Les réserves
- Une réalisation parfois maladroite
- Un rythme inégal qui peine à maintenir la tension

## Le casting
Kurt Russell livre une performance solide en Jimmy Harrell...

## Notre verdict
Avec une note de 5/10, Deepwater reste un film mitigé...

## Conclusion
Malgré ses défauts, Deepwater mérite le détour pour...
```

## 🎨 Captures d'écran

### Page d'accueil
- Liste des articles avec images
- Recherche et pagination
- Design moderne et responsive

### Page article
- Contenu Markdown formaté
- Métadonnées du film (note, genres, année)
- Lien vers la source MovieHunt
- Tags et navigation

### Interface Admin
- Génération d'articles en un clic
- Gestion de la queue
- Statistiques en temps réel
- Import en masse

## 📝 Roadmap

- [x] Intégration API MovieHunt
- [x] Génération d'articles avec GPT-4o mini
- [x] Interface d'administration
- [x] Système de queue
- [x] Webhook support
- [x] Import en masse
- [ ] Authentification admin
- [ ] Système de cache Redis
- [ ] Sitemap automatique
- [ ] RSS feed
- [ ] Newsletter automatique

## 📄 Licence

ISC
