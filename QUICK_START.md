# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### 1️⃣ Prérequis

Assurez-vous d'avoir installé :
- **Node.js** (v18 ou supérieur) - [Télécharger](https://nodejs.org/)
- **MongoDB** - [Télécharger](https://www.mongodb.com/try/download/community) ou utilisez [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- **Clé API OpenAI** - [Obtenir une clé](https://platform.openai.com/api-keys)

### 2️⃣ Installation

```bash
# 1. Installer toutes les dépendances
npm run install-all

# 2. Configurer les variables d'environnement
cp .env.example .env
```

### 3️⃣ Configuration

Éditez le fichier `.env` avec vos informations :

```env
# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/moviehunt-blog

# OU MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviehunt-blog

# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-votre-clé-openai-ici

# Server
PORT=5000
NODE_ENV=development

# MovieHunt
MOVIEHUNT_URL=https://moviehunt.fr

# Frontend
CLIENT_URL=http://localhost:5173
```

### 4️⃣ Démarrage

```bash
# Démarrer MongoDB (si local)
# Sur macOS avec Homebrew:
brew services start mongodb-community

# Sur Linux:
sudo systemctl start mongodb

# Sur Windows:
# MongoDB démarre automatiquement après installation

# Démarrer l'application (backend + frontend)
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **API Health** : http://localhost:5000/api/health

### 5️⃣ Première utilisation

1. **Accédez à l'interface** : http://localhost:5173
2. **Allez dans Admin** : http://localhost:5173/admin
3. **Générez votre premier article** :
   - Entrez une URL de moviehunt.fr
   - Cliquez sur "Générer l'article"
   - Attendez quelques secondes
   - L'article apparaîtra sur la page d'accueil

## 📝 Commandes utiles

```bash
# Développement
npm run dev              # Démarre backend + frontend
npm run server           # Démarre uniquement le backend
npm run client           # Démarre uniquement le frontend

# Production
npm run build            # Build le frontend
npm start                # Démarre en mode production

# Installation
npm run install-all      # Installe toutes les dépendances
```

## 🔧 Configuration du Scraping

Le scraping est configuré avec des sélecteurs par défaut. Pour l'adapter à votre site moviehunt.fr :

1. Ouvrez `server/services/scraperService.js`
2. Modifiez les sélecteurs CSS selon votre structure HTML
3. Consultez `SCRAPING_GUIDE.md` pour plus de détails

**Exemple rapide** :
```javascript
// Dans extractTitle($)
const selectors = [
  'h1.votre-classe-titre',  // Remplacez par votre sélecteur
  'h1',
];
```

## 🎯 Fonctionnalités principales

### Génération automatique d'articles
- Ajoutez une URL dans l'interface Admin
- L'IA génère automatiquement un article complet
- L'article est publié instantanément

### Webhook pour automatisation
```bash
# Endpoint webhook
POST http://localhost:5000/api/webhook/moviehunt

# Body JSON
{
  "url": "https://moviehunt.fr/votre-page",
  "event": "page.created"
}
```

### API REST complète
```bash
# Lister les articles
GET /api/articles?page=1&limit=10

# Générer un article
POST /api/articles/generate
Body: { "url": "https://moviehunt.fr/..." }

# Statistiques
GET /api/articles/stats
```

## 🐛 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
# macOS:
brew services list

# Linux:
sudo systemctl status mongodb

# Tester la connexion
mongosh
```

### Erreur OpenAI
- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits OpenAI
- La clé doit commencer par `sk-`

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=3000  # Au lieu de 5000
```

### Problème d'installation
```bash
# Nettoyer et réinstaller
rm -rf node_modules client/node_modules
npm run install-all
```

## 📚 Documentation complète

- **README.md** - Vue d'ensemble du projet
- **SCRAPING_GUIDE.md** - Configuration détaillée du scraping
- **DEPLOYMENT.md** - Guide de déploiement en production

## 🆘 Besoin d'aide ?

1. Vérifiez les logs du serveur dans le terminal
2. Consultez les guides de documentation
3. Vérifiez que toutes les dépendances sont installées
4. Assurez-vous que MongoDB et le serveur sont démarrés

## ✅ Checklist de vérification

- [ ] Node.js installé (v18+)
- [ ] MongoDB installé et démarré
- [ ] Clé API OpenAI configurée dans `.env`
- [ ] Dépendances installées (`npm run install-all`)
- [ ] Application démarrée (`npm run dev`)
- [ ] Frontend accessible (http://localhost:5173)
- [ ] Backend accessible (http://localhost:5000/api/health)

## 🎉 Prochaines étapes

1. **Personnalisez le scraping** selon votre site moviehunt.fr
2. **Testez la génération** avec plusieurs URLs
3. **Explorez l'interface Admin** pour gérer vos articles
4. **Configurez le webhook** pour l'automatisation
5. **Déployez en production** quand vous êtes prêt

Bon développement ! 🚀
