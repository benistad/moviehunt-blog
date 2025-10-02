# 📡 Documentation API

## Base URL

```
Development: http://localhost:5000/api
Production: https://votre-domaine.com/api
```

## 📋 Endpoints

### Articles

#### GET /articles
Liste tous les articles avec pagination et recherche.

**Query Parameters:**
- `page` (number, optional) - Numéro de page (défaut: 1)
- `limit` (number, optional) - Nombre d'articles par page (défaut: 10)
- `status` (string, optional) - Statut des articles: `published`, `draft`, `archived` (défaut: published)
- `search` (string, optional) - Recherche textuelle

**Exemple:**
```bash
GET /api/articles?page=1&limit=10&status=published&search=inception
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "_id": "...",
        "title": "Inception: Une plongée dans les rêves",
        "slug": "inception-une-plongee-dans-les-reves",
        "excerpt": "Christopher Nolan nous offre...",
        "coverImage": "https://...",
        "tags": ["Science-Fiction", "Thriller"],
        "publishedAt": "2025-09-30T15:24:10.000Z",
        "status": "published"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

#### GET /articles/:id
Récupère un article par son ID.

**Exemple:**
```bash
GET /api/articles/507f1f77bcf86cd799439011
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Inception: Une plongée dans les rêves",
    "slug": "inception-une-plongee-dans-les-reves",
    "content": "# Introduction\n\nChristopher Nolan...",
    "excerpt": "Christopher Nolan nous offre...",
    "sourceUrl": "https://moviehunt.fr/films/inception",
    "coverImage": "https://...",
    "tags": ["Science-Fiction", "Thriller"],
    "metadata": {
      "movieTitle": "Inception",
      "releaseYear": "2010",
      "genre": ["Science-Fiction", "Action"],
      "director": "Christopher Nolan",
      "actors": ["Leonardo DiCaprio", "Marion Cotillard"]
    },
    "seo": {
      "metaTitle": "Inception - Critique et Analyse",
      "metaDescription": "Découvrez notre analyse...",
      "keywords": ["inception", "nolan", "science-fiction"]
    },
    "status": "published",
    "generatedBy": "manual",
    "publishedAt": "2025-09-30T15:24:10.000Z",
    "createdAt": "2025-09-30T15:24:10.000Z",
    "updatedAt": "2025-09-30T15:24:10.000Z"
  }
}
```

#### GET /articles/slug/:slug
Récupère un article par son slug.

**Exemple:**
```bash
GET /api/articles/slug/inception-une-plongee-dans-les-reves
```

#### GET /articles/stats
Récupère les statistiques des articles et de la queue.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "articles": {
      "total": 45,
      "published": 42,
      "draft": 3
    },
    "queue": {
      "pending": 5,
      "processing": 1,
      "failed": 2
    }
  }
}
```

#### GET /articles/tags/all
Récupère tous les tags uniques utilisés dans les articles.

**Réponse:**
```json
{
  "success": true,
  "data": [
    "Science-Fiction",
    "Action",
    "Thriller",
    "Drame",
    "Comédie"
  ]
}
```

#### POST /articles/generate
Génère un nouvel article à partir d'une URL MovieHunt.

**Body:**
```json
{
  "url": "https://moviehunt.fr/films/inception"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Inception: Une plongée dans les rêves",
    "slug": "inception-une-plongee-dans-les-reves",
    "content": "...",
    "status": "published"
  },
  "message": "Article généré avec succès"
}
```

**Erreurs possibles:**
- `400` - URL invalide ou manquante
- `500` - Erreur de scraping ou de génération IA

#### POST /articles/:id/regenerate
Régénère un article existant.

**Exemple:**
```bash
POST /api/articles/507f1f77bcf86cd799439011/regenerate
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Inception: Une plongée dans les rêves (Mis à jour)",
    "content": "..."
  },
  "message": "Article régénéré avec succès"
}
```

#### PUT /articles/:id
Met à jour un article existant.

**Body:**
```json
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu...",
  "status": "published",
  "tags": ["Tag1", "Tag2"]
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Nouveau titre",
    "content": "Nouveau contenu...",
    "status": "published"
  },
  "message": "Article mis à jour avec succès"
}
```

#### DELETE /articles/:id
Supprime un article.

**Exemple:**
```bash
DELETE /api/articles/507f1f77bcf86cd799439011
```

**Réponse:**
```json
{
  "success": true,
  "message": "Article supprimé avec succès"
}
```

### Queue

#### GET /queue
Liste les URLs en queue.

**Query Parameters:**
- `status` (string, optional) - Filtrer par statut: `pending`, `processing`, `completed`, `failed`

**Exemple:**
```bash
GET /api/queue?status=pending
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "url": "https://moviehunt.fr/films/inception",
      "status": "pending",
      "addedBy": "manual",
      "retryCount": 0,
      "createdAt": "2025-09-30T15:24:10.000Z"
    }
  ]
}
```

#### POST /queue/process
Traite les URLs en attente dans la queue.

**Body:**
```json
{
  "limit": 5
}
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://moviehunt.fr/films/inception",
      "success": true,
      "articleId": "507f1f77bcf86cd799439011"
    }
  ],
  "message": "5 URLs traitées"
}
```

#### POST /queue/retry
Réessaye les URLs en échec.

**Réponse:**
```json
{
  "success": true,
  "message": "Nouvelle tentative lancée pour les URLs en échec"
}
```

#### DELETE /queue/:id
Supprime une entrée de la queue.

**Exemple:**
```bash
DELETE /api/queue/507f1f77bcf86cd799439011
```

### Webhook

#### POST /webhook/moviehunt
Webhook pour recevoir les notifications de nouvelles pages MovieHunt.

**Body:**
```json
{
  "url": "https://moviehunt.fr/films/inception",
  "event": "page.created",
  "timestamp": "2025-09-30T15:24:10+02:00"
}
```

**Événements supportés:**
- `page.created` - Nouvelle page créée
- `page.updated` - Page mise à jour

**Réponse:**
```json
{
  "success": true,
  "message": "Webhook reçu, génération en cours"
}
```

**Note:** La génération se fait de manière asynchrone. Le webhook répond immédiatement (202 Accepted).

#### GET /webhook/health
Vérifie que le webhook est opérationnel.

**Réponse:**
```json
{
  "success": true,
  "message": "Webhook opérationnel",
  "timestamp": "2025-09-30T15:24:10.000Z"
}
```

### Health

#### GET /health
Vérifie l'état de l'API.

**Réponse:**
```json
{
  "success": true,
  "message": "MovieHunt Blog API opérationnelle",
  "timestamp": "2025-09-30T15:24:10.000Z",
  "environment": "development"
}
```

## 🔒 Codes de statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `202` - Accepté (traitement asynchrone)
- `400` - Requête invalide
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 📝 Format des erreurs

```json
{
  "success": false,
  "error": "Message d'erreur détaillé"
}
```

## 🔐 Authentification

Actuellement, l'API n'a pas d'authentification. Pour ajouter de l'authentification en production, consultez le guide de déploiement.

## 💡 Exemples d'utilisation

### JavaScript (Fetch)
```javascript
// Générer un article
const response = await fetch('http://localhost:5000/api/articles/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://moviehunt.fr/films/inception'
  })
});

const data = await response.json();
console.log(data);
```

### cURL
```bash
# Générer un article
curl -X POST http://localhost:5000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://moviehunt.fr/films/inception"}'

# Lister les articles
curl http://localhost:5000/api/articles?page=1&limit=10
```

### Python
```python
import requests

# Générer un article
response = requests.post(
    'http://localhost:5000/api/articles/generate',
    json={'url': 'https://moviehunt.fr/films/inception'}
)

data = response.json()
print(data)
```

## 🚀 Rate Limiting

En production, l'API est limitée à :
- 100 requêtes par 15 minutes par IP
- Applicable sur tous les endpoints `/api/*`

## 📊 Pagination

Les endpoints qui retournent des listes utilisent la pagination :
- `page` - Numéro de page (commence à 1)
- `limit` - Nombre d'éléments par page
- `total` - Nombre total d'éléments
- `pages` - Nombre total de pages
