# 🚀 Guide de Déploiement Vercel - MovieHunt Blog

Ce guide vous aide à déployer votre blog MovieHunt sur Vercel en quelques minutes.

## ✅ Prérequis

- ✅ Compte GitHub (vous l'avez déjà)
- ✅ Compte Vercel (vous l'avez déjà)
- ✅ Compte Supabase actif
- ✅ Clés API (OpenAI, TMDB)

## 📋 Étape 1 : Pousser le code sur GitHub

### 1.1 Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - MovieHunt Blog"
```

### 1.2 Créer un repository sur GitHub

1. Allez sur https://github.com/new
2. Nom du repository : `moviehunt-blog`
3. Laissez en **Private** (recommandé)
4. Ne cochez rien d'autre
5. Cliquez sur **Create repository**

### 1.3 Pousser le code

```bash
git remote add origin https://github.com/VOTRE_USERNAME/moviehunt-blog.git
git branch -M main
git push -u origin main
```

## 🚀 Étape 2 : Déployer sur Vercel

### 2.1 Importer le projet

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur **Add New** → **Project**
3. Sélectionnez votre repository `moviehunt-blog`
4. Cliquez sur **Import**

### 2.2 Configuration du build

Vercel détectera automatiquement la configuration grâce au fichier `vercel.json`.

**Ne changez rien**, cliquez simplement sur **Deploy**.

## 🔐 Étape 3 : Configurer les variables d'environnement

### 3.1 Accéder aux paramètres

1. Une fois le déploiement terminé, allez dans **Settings** → **Environment Variables**

### 3.2 Ajouter les variables (copiez-collez vos valeurs)

#### Variables Frontend (préfixe `VITE_`)

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `VITE_SUPABASE_URL` | Votre URL Supabase | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Votre clé anon Supabase | Production, Preview, Development |

#### Variables Backend (API)

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `SUPABASE_URL` | Votre URL Supabase | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Votre clé anon Supabase | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Votre clé service role Supabase | Production, Preview, Development |
| `OPENAI_API_KEY` | Votre clé OpenAI | Production, Preview, Development |
| `TMDB_API_KEY` | Votre clé TMDB | Production, Preview, Development |
| `TMDB_API_READ_ACCESS_TOKEN` | Votre token TMDB | Production, Preview, Development |
| `MOVIEHUNT_URL` | `https://moviehunt.fr` | Production, Preview, Development |
| `CLIENT_URL` | Votre URL Vercel (ex: `https://moviehunt-blog.vercel.app`) | Production, Preview, Development |
| `PORT` | `5001` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### 3.3 Où trouver vos clés ?

#### Supabase
1. https://supabase.com/dashboard
2. Sélectionnez votre projet
3. **Settings** → **API**
4. Copiez `URL`, `anon public` et `service_role`

#### OpenAI
1. https://platform.openai.com/api-keys
2. Créez une nouvelle clé si nécessaire

#### TMDB
1. https://www.themoviedb.org/settings/api
2. Copiez `API Key` et `API Read Access Token`

## 🔄 Étape 4 : Redéployer

1. Retournez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **Redeploy**
4. Attendez que le déploiement se termine (1-2 minutes)

## ✅ Étape 5 : Vérifier le déploiement

### 5.1 Tester le frontend

1. Cliquez sur **Visit** pour ouvrir votre site
2. Vous devriez voir la page d'accueil
3. Testez le raccourci **Ctrl+Shift+A** pour accéder à l'admin
4. Connectez-vous avec vos identifiants Supabase

### 5.2 Tester l'API

Ouvrez : `https://votre-site.vercel.app/api/health`

Vous devriez voir :
```json
{
  "success": true,
  "message": "MovieHunt Blog API opérationnelle",
  "timestamp": "...",
  "environment": "production"
}
```

## 🎉 C'est terminé !

Votre site est maintenant en ligne sur :
- **URL principale** : `https://votre-projet.vercel.app`
- **Admin** : `https://votre-projet.vercel.app/admin` (ou Ctrl+Shift+A)

## 🔧 Mises à jour futures

Pour mettre à jour votre site :

```bash
# Faites vos modifications
git add .
git commit -m "Description des changements"
git push
```

Vercel déploiera automatiquement les changements en 1-2 minutes !

## 🌐 Ajouter un domaine personnalisé (optionnel)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **Add**
3. Entrez votre domaine (ex: `blog.moviehunt.fr`)
4. Suivez les instructions pour configurer les DNS

---

## 📦 Autres options de déploiement

### Option Alternative : Serveur VPS

#### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer MongoDB (ou utiliser MongoDB Atlas)
sudo apt install -y mongodb

# Installer PM2 pour gérer les processus
sudo npm install -g pm2
```

#### 2. Déployer l'application

```bash
# Cloner ou transférer le projet
git clone <votre-repo> moviehunt-blog
cd moviehunt-blog

# Installer les dépendances
npm run install-all

# Configurer les variables d'environnement
cp .env.example .env
nano .env  # Éditer avec vos valeurs

# Build du frontend
cd client && npm run build && cd ..

# Démarrer avec PM2
pm2 start server/index.js --name moviehunt-blog
pm2 save
pm2 startup
```

#### 3. Configurer Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend (fichiers statiques)
    location / {
        root /chemin/vers/moviehunt-blog/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/moviehunt-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Installer SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Option 2: Heroku

#### 1. Préparer l'application

Créez un fichier `Procfile` à la racine :
```
web: node server/index.js
```

Modifiez `package.json` :
```json
{
  "scripts": {
    "start": "node server/index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

Modifiez `server/index.js` pour servir les fichiers statiques :
```javascript
// Après les routes API
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

#### 2. Déployer sur Heroku

```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer l'application
heroku create moviehunt-blog

# Ajouter MongoDB
heroku addons:create mongolab:sandbox

# Configurer les variables d'environnement
heroku config:set OPENAI_API_KEY=votre_clé
heroku config:set NODE_ENV=production
heroku config:set MOVIEHUNT_URL=https://moviehunt.fr

# Déployer
git push heroku main

# Ouvrir l'application
heroku open
```

### Option 3: Vercel (Frontend) + Railway (Backend)

#### Frontend sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se placer dans le dossier client
cd client

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add VITE_API_URL
```

#### Backend sur Railway

1. Créer un compte sur railway.app
2. Créer un nouveau projet
3. Connecter votre repository GitHub
4. Configurer les variables d'environnement
5. Railway détectera automatiquement Node.js

### Option 4: Docker

#### 1. Créer les Dockerfiles

`Dockerfile` (racine) :
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Backend
COPY package*.json ./
RUN npm install

# Frontend
COPY client/package*.json ./client/
RUN cd client && npm install

# Copier le code
COPY . .

# Build frontend
RUN cd client && npm run build

EXPOSE 5000

CMD ["node", "server/index.js"]
```

`docker-compose.yml` :
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/moviehunt-blog
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

#### 2. Déployer avec Docker

```bash
# Build et démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## 🔒 Sécurité en Production

### 1. Variables d'environnement

Ne jamais commiter le fichier `.env`. Utilisez :
- Variables d'environnement du serveur
- Secrets managers (AWS Secrets, HashiCorp Vault)
- Variables d'environnement de la plateforme

### 2. Rate Limiting

Ajoutez dans `server/index.js` :
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});

app.use('/api/', limiter);
```

### 3. CORS en production

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://votre-domaine.com',
  credentials: true,
}));
```

### 4. Helmet (sécurité headers)

Déjà configuré dans le projet avec `helmet`.

## 📊 Monitoring

### PM2 Monitoring

```bash
# Voir les processus
pm2 list

# Logs
pm2 logs moviehunt-blog

# Monitoring
pm2 monit

# Redémarrer
pm2 restart moviehunt-blog
```

### Logs

Ajoutez un système de logs :
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 Mise à jour

```bash
# Avec PM2
git pull
npm install
cd client && npm install && npm run build && cd ..
pm2 restart moviehunt-blog

# Avec Docker
git pull
docker-compose down
docker-compose up -d --build
```

## 🗄️ Backup MongoDB

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/moviehunt-blog" --out=/backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/moviehunt-blog" /backup/moviehunt-blog/
```

## 📈 Performance

### 1. Compression

Déjà activé avec `compression` middleware.

### 2. Cache

Ajoutez du cache pour les articles :
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes
```

### 3. CDN

Utilisez un CDN pour les images :
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] MongoDB accessible
- [ ] Clé OpenAI valide
- [ ] Frontend buildé
- [ ] HTTPS activé (SSL)
- [ ] CORS configuré
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Backup automatique configuré
- [ ] Monitoring en place
- [ ] Tests effectués

## 🆘 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les logs
pm2 logs moviehunt-blog

# Vérifier les variables d'environnement
pm2 env 0
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongodb

# Tester la connexion
mongo --eval "db.adminCommand('ping')"
```

### Erreur OpenAI
- Vérifier que la clé API est valide
- Vérifier les quotas OpenAI
- Vérifier les logs d'erreur
