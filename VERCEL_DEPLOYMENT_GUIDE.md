# 🚀 Guide de Déploiement Vercel - MovieHunt Blog

## 📋 Architecture

Nous allons créer **2 projets Vercel séparés** :

1. **Backend API** (Express) → `moviehunt-blog-api`
2. **Frontend** (Next.js) → `moviehunt-blog` (déjà configuré)

---

## 🔧 Projet 1 : Backend API

### Étape 1 : Créer un nouveau projet Vercel pour le backend

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur **"Add New..."** → **"Project"**
3. Sélectionner votre repo **benistad/moviehunt-blog**
4. **IMPORTANT** : Configurer comme suit :

```
Project Name: moviehunt-blog-api
Root Directory: server          ⚠️ CRUCIAL
Framework Preset: Other
Build Command: (laisser vide)
Output Directory: (laisser vide)
Install Command: npm install
```

### Étape 2 : Ajouter les variables d'environnement

Avant de déployer, cliquer sur **"Environment Variables"** et ajouter :

| Variable | Valeur | Où la trouver |
|----------|--------|---------------|
| `PORT` | `5000` | - |
| `CLIENT_URL` | `https://moviehunt-blog.vercel.app` | URL de votre frontend |
| `SUPABASE_URL` | `https://fjoxqvdilkbxivzskrmg.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase Dashboard → Settings → API → service_role key |
| `OPENAI_API_KEY` | `sk-...` | https://platform.openai.com/api-keys |
| `TMDB_API_KEY` | (optionnel) | https://www.themoviedb.org/settings/api |
| `NODE_ENV` | `production` | - |

### Étape 3 : Déployer

Cliquer sur **"Deploy"**

Une fois déployé, noter l'URL :
```
https://moviehunt-blog-api.vercel.app
```

Votre API sera accessible sur :
```
https://moviehunt-blog-api.vercel.app/api
```

### Étape 4 : Tester le backend

```bash
curl https://moviehunt-blog-api.vercel.app/api/health
```

Devrait retourner :
```json
{
  "success": true,
  "message": "MovieHunt Blog API opérationnelle"
}
```

---

## 🎨 Projet 2 : Frontend Next.js

### Étape 1 : Vérifier/Créer le projet frontend

Si pas encore fait :

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur **"Add New..."** → **"Project"**
3. Sélectionner votre repo **benistad/moviehunt-blog**
4. Configurer :

```
Project Name: moviehunt-blog
Root Directory: (laisser vide - racine)
Framework Preset: Next.js
Build Command: cd client && npm run build
Output Directory: client/.next
Install Command: cd client && npm install
```

### Étape 2 : Configurer les variables d'environnement

Ajouter ces variables (en utilisant l'URL du backend déployé) :

| Variable | Valeur |
|----------|--------|
| `API_URL` | `https://moviehunt-blog-api.vercel.app/api` |
| `NEXT_PUBLIC_API_URL` | `https://moviehunt-blog-api.vercel.app/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://moviehunt-blog.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fjoxqvdilkbxivzskrmg.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (clé anon, pas service_role) |

### Étape 3 : Déployer

Cliquer sur **"Deploy"**

---

## 🔄 Mise à jour du CLIENT_URL du backend

⚠️ **IMPORTANT** : Une fois le frontend déployé, retourner sur le projet **backend** :

1. Aller sur le projet `moviehunt-blog-api`
2. **Settings** → **Environment Variables**
3. Modifier `CLIENT_URL` avec l'URL réelle du frontend :
   ```
   CLIENT_URL=https://moviehunt-blog.vercel.app
   ```
4. **Redéployer** le backend (Deployments → ... → Redeploy)

---

## ✅ Vérification

### Backend

```bash
# Health check
curl https://moviehunt-blog-api.vercel.app/api/health

# Sitemap
curl https://moviehunt-blog-api.vercel.app/api/sitemap.xml

# Articles
curl https://moviehunt-blog-api.vercel.app/api/articles
```

### Frontend

1. Ouvrir `https://moviehunt-blog.vercel.app`
2. Vérifier que les articles s'affichent
3. Cliquer sur un article
4. Vérifier le HTML source (clic droit → Afficher le code source)
   - Le contenu de l'article doit être visible dans le HTML !

---

## 🎯 Domaine personnalisé (optionnel)

### Pour le frontend (blog.moviehunt.fr)

1. Projet frontend → **Settings** → **Domains**
2. Ajouter `blog.moviehunt.fr`
3. Configurer le DNS chez votre registrar :
   ```
   Type: CNAME
   Name: blog
   Value: cname.vercel-dns.com
   ```

### Pour le backend (api.moviehunt.fr)

1. Projet backend → **Settings** → **Domains**
2. Ajouter `api.moviehunt.fr`
3. Configurer le DNS :
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

4. Mettre à jour les variables d'environnement :
   - Backend : `CLIENT_URL=https://blog.moviehunt.fr`
   - Frontend : `NEXT_PUBLIC_API_URL=https://api.moviehunt.fr/api`

---

## 🐛 Dépannage

### Erreur : "No such file or directory: client"

Le `Root Directory` n'est pas configuré correctement.
- Backend : `Root Directory` = `server`
- Frontend : `Root Directory` = (vide)

### Erreur : "CORS error"

Vérifier que `CLIENT_URL` dans le backend correspond exactement à l'URL du frontend.

### Erreur : "Supabase connection failed"

Vérifier que vous utilisez la bonne clé :
- Backend : `SUPABASE_SERVICE_ROLE_KEY` (clé secrète)
- Frontend : `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé publique)

### Articles ne s'affichent pas

1. Vérifier les logs du backend : Projet backend → Deployments → Logs
2. Vérifier que `NEXT_PUBLIC_API_URL` est correct dans le frontend
3. Tester l'API directement avec curl

---

## 📊 Résumé des URLs

Après déploiement :

| Service | URL |
|---------|-----|
| Backend API | `https://moviehunt-blog-api.vercel.app/api` |
| Frontend | `https://moviehunt-blog.vercel.app` |
| Health check | `https://moviehunt-blog-api.vercel.app/api/health` |
| Sitemap | `https://moviehunt-blog-api.vercel.app/api/sitemap.xml` |

Avec domaines personnalisés :

| Service | URL |
|---------|-----|
| Backend API | `https://api.moviehunt.fr/api` |
| Frontend | `https://blog.moviehunt.fr` |

---

## 🎉 C'est terminé !

Votre blog MovieHunt est maintenant déployé sur Vercel avec :
- ✅ Backend API fonctionnel
- ✅ Frontend Next.js avec ISR
- ✅ Contenu visible dans le HTML source
- ✅ SEO optimal

🚀 **Le blog est en production !**
