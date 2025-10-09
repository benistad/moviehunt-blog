# 🚀 Déploiement du Backend sur Vercel

## 📋 Prérequis

- Compte Vercel (gratuit) : https://vercel.com
- Vercel CLI installé : `npm install -g vercel`

## 🔧 Étape 1 : Préparer le déploiement

Les fichiers de configuration sont déjà créés :
- ✅ `server/vercel.json` - Configuration Vercel
- ✅ `server/.vercelignore` - Fichiers à ignorer

## 🚀 Étape 2 : Déployer le backend

### Option A : Via la ligne de commande (Recommandé)

```bash
# 1. Se placer dans le dossier server
cd server

# 2. Se connecter à Vercel (si pas déjà fait)
vercel login

# 3. Déployer
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? moviehunt-blog-api (ou autre nom)
# - Directory? ./ (laisser par défaut)
# - Override settings? No

# 4. Une fois déployé, noter l'URL fournie
# Exemple: https://moviehunt-blog-api.vercel.app
```

### Option B : Via le dashboard Vercel

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur **"Add New..."** → **"Project"**
3. Importer votre repo GitHub
4. Configurer :
   - **Root Directory** : `server`
   - **Framework Preset** : Other
   - **Build Command** : (laisser vide)
   - **Output Directory** : (laisser vide)
5. Cliquer sur **"Deploy"**

## ⚙️ Étape 3 : Configurer les variables d'environnement

Une fois le backend déployé, configurer les variables d'environnement dans Vercel :

### Via le dashboard Vercel

1. Aller sur votre projet backend
2. **Settings** → **Environment Variables**
3. Ajouter ces variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `PORT` | `5000` | Port du serveur |
| `CLIENT_URL` | `https://blog.moviehunt.fr` | URL du frontend |
| `SUPABASE_URL` | Votre URL Supabase | Base de données |
| `SUPABASE_SERVICE_ROLE_KEY` | Votre clé Supabase | Clé admin Supabase |
| `OPENAI_API_KEY` | Votre clé OpenAI | Pour générer les articles |
| `TMDB_API_KEY` | Votre clé TMDB | (optionnel) Pour les données films |
| `NODE_ENV` | `production` | Environnement |

### Où trouver ces clés ?

#### Supabase
1. https://supabase.com/dashboard
2. Sélectionner votre projet
3. **Settings** → **API**
4. Copier :
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

#### OpenAI
1. https://platform.openai.com/api-keys
2. Créer une nouvelle clé API
3. Copier la clé → `OPENAI_API_KEY`

#### TMDB (optionnel)
1. https://www.themoviedb.org/settings/api
2. Copier votre clé → `TMDB_API_KEY`

## ✅ Étape 4 : Vérifier le déploiement

### Tester l'API

```bash
# Remplacer par votre URL Vercel
curl https://moviehunt-blog-api.vercel.app/api/health
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "MovieHunt Blog API opérationnelle",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production"
}
```

### Tester le sitemap

```bash
curl https://moviehunt-blog-api.vercel.app/api/sitemap.xml
```

## 🔗 Étape 5 : Mettre à jour le frontend

Une fois le backend déployé, mettre à jour les variables d'environnement du **frontend** :

### Dans Vercel (projet frontend)

1. Aller sur votre projet **frontend** (Next.js)
2. **Settings** → **Environment Variables**
3. Ajouter/Modifier :

| Variable | Valeur |
|----------|--------|
| `API_URL` | `https://moviehunt-blog-api.vercel.app/api` |
| `NEXT_PUBLIC_API_URL` | `https://moviehunt-blog-api.vercel.app/api` |

4. **Redéployer** le frontend pour prendre en compte les nouvelles variables

## 🎯 Étape 6 : Configuration CORS

Le backend doit autoriser les requêtes depuis votre frontend. Vérifiez que `CLIENT_URL` dans les variables d'environnement du backend correspond bien à l'URL de votre frontend.

## 📊 Monitoring

### Logs Vercel

Pour voir les logs du backend :
```bash
cd server
vercel logs
```

Ou via le dashboard : **Deployments** → Cliquer sur un déploiement → **Logs**

### Erreurs courantes

#### 1. "CORS error"
- Vérifier que `CLIENT_URL` est bien configuré dans le backend
- Vérifier que l'URL correspond exactement (avec/sans trailing slash)

#### 2. "Supabase connection failed"
- Vérifier que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont corrects
- Vérifier que la clé est bien la **service_role** (pas anon)

#### 3. "OpenAI API error"
- Vérifier que `OPENAI_API_KEY` est correct
- Vérifier que vous avez des crédits OpenAI

## 🔄 Redéploiement

Pour redéployer après des modifications :

```bash
cd server
git add .
git commit -m "Update backend"
git push origin main
```

Vercel redéploiera automatiquement !

Ou manuellement :
```bash
cd server
vercel --prod
```

## 📝 Résumé des URLs

Après déploiement, vous aurez :

- **Backend API** : `https://moviehunt-blog-api.vercel.app/api`
- **Frontend** : `https://blog.moviehunt.fr` (ou votre domaine)
- **Sitemap** : `https://moviehunt-blog-api.vercel.app/api/sitemap.xml`
- **Health check** : `https://moviehunt-blog-api.vercel.app/api/health`

## 🎉 C'est terminé !

Votre backend est maintenant déployé sur Vercel et prêt à servir votre blog Next.js !

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifier les logs : `vercel logs`
2. Vérifier les variables d'environnement dans le dashboard
3. Tester l'API avec curl
4. Vérifier que toutes les dépendances sont dans `package.json`
