# 🧪 Tests de l'API MovieHunt

Ce fichier contient des commandes pour tester toutes les fonctionnalités du blog.

## ✅ Prérequis

1. Le serveur doit être démarré : `npm run dev`
2. MongoDB doit être en cours d'exécution
3. La clé API OpenAI doit être configurée dans `.env`

## 🔍 Tests de Base

### 1. Vérifier que l'API est opérationnelle

```bash
curl http://localhost:5000/api/health
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "MovieHunt Blog API opérationnelle",
  "timestamp": "2025-09-30T...",
  "environment": "development"
}
```

### 2. Vérifier le webhook

```bash
curl http://localhost:5000/api/webhook/health
```

## 📊 Tests de l'API MovieHunt

### 3. Lister tous les films disponibles

```bash
curl http://localhost:5000/api/import/films/available
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "films": [
      {"id": "1", "title": "Deepwater", "slug": "deepwater"},
      ...
    ],
    "count": 50
  }
}
```

### 4. Obtenir les statistiques d'import

```bash
curl http://localhost:5000/api/import/stats
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "availableOnMovieHunt": 50,
    "inQueue": 0,
    "imported": 0,
    "remaining": 50
  }
}
```

## 🎬 Tests de Génération d'Articles

### 5. Générer un article depuis une URL

```bash
curl -X POST http://localhost:5000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.moviehunt.fr/films/deepwater"}'
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Deepwater : ...",
    "slug": "deepwater-...",
    "content": "...",
    "status": "published"
  },
  "message": "Article généré avec succès"
}
```

### 6. Importer un film par slug

```bash
curl -X POST http://localhost:5000/api/import/film/heretic \
  -H "Content-Type: application/json" \
  -d '{"generateNow": true}'
```

### 7. Import en masse (5 films)

```bash
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "addedToQueue": 5,
    "alreadyExists": 0,
    "total": 5
  },
  "message": "5 films ajoutés à la queue"
}
```

## 📋 Tests de la Queue

### 8. Voir la queue

```bash
curl http://localhost:5000/api/queue
```

### 9. Traiter la queue

```bash
curl -X POST http://localhost:5000/api/queue/process \
  -H "Content-Type: application/json" \
  -d '{"limit": 3}'
```

**Note :** Cette commande va générer 3 articles. Cela peut prendre 30-60 secondes.

### 10. Voir les URLs en échec

```bash
curl "http://localhost:5000/api/queue?status=failed"
```

### 11. Réessayer les échecs

```bash
curl -X POST http://localhost:5000/api/queue/retry
```

## 📰 Tests des Articles

### 12. Lister tous les articles

```bash
curl "http://localhost:5000/api/articles?page=1&limit=10"
```

### 13. Rechercher un article

```bash
curl "http://localhost:5000/api/articles?search=deepwater"
```

### 14. Obtenir un article par slug

```bash
curl http://localhost:5000/api/articles/slug/deepwater
```

### 15. Obtenir les statistiques

```bash
curl http://localhost:5000/api/articles/stats
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "articles": {
      "total": 5,
      "published": 5,
      "draft": 0
    },
    "queue": {
      "pending": 2,
      "processing": 0,
      "failed": 0
    }
  }
}
```

### 16. Obtenir tous les tags

```bash
curl http://localhost:5000/api/articles/tags/all
```

## 🔄 Tests de Mise à Jour

### 17. Mettre à jour un article

```bash
# Remplacez {id} par un ID d'article réel
curl -X PUT http://localhost:5000/api/articles/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouveau titre",
    "status": "published"
  }'
```

### 18. Régénérer un article

```bash
# Remplacez {id} par un ID d'article réel
curl -X POST http://localhost:5000/api/articles/{id}/regenerate
```

### 19. Supprimer un article

```bash
# Remplacez {id} par un ID d'article réel
curl -X DELETE http://localhost:5000/api/articles/{id}
```

## 🔗 Tests du Webhook

### 20. Tester le webhook MovieHunt

```bash
curl -X POST http://localhost:5000/api/webhook/moviehunt \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.moviehunt.fr/films/conclave",
    "event": "page.created",
    "timestamp": "2025-09-30T16:00:00+02:00"
  }'
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Webhook reçu, génération en cours"
}
```

## 🎯 Scénario de Test Complet

Voici un scénario complet pour tester toutes les fonctionnalités :

```bash
# 1. Vérifier l'API
curl http://localhost:5000/api/health

# 2. Voir les films disponibles
curl http://localhost:5000/api/import/films/available | jq '.data.count'

# 3. Importer 3 films
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"limit": 3}'

# 4. Attendre 5 secondes
sleep 5

# 5. Traiter la queue
curl -X POST http://localhost:5000/api/queue/process \
  -H "Content-Type: application/json" \
  -d '{"limit": 3}'

# 6. Attendre la génération (60 secondes)
echo "Génération en cours... Attendez 60 secondes"
sleep 60

# 7. Vérifier les articles générés
curl http://localhost:5000/api/articles/stats

# 8. Lister les articles
curl "http://localhost:5000/api/articles?limit=10" | jq '.data.articles[] | {title, slug}'
```

## 🐛 Dépannage

### Erreur : "OPENAI_API_KEY manquante"
```bash
# Vérifiez votre fichier .env
cat .env | grep OPENAI_API_KEY
```

### Erreur : "Erreur MongoDB"
```bash
# Vérifiez que MongoDB est démarré
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongodb
```

### Erreur : "Film non trouvé"
```bash
# Testez directement l'API MovieHunt
curl https://www.moviehunt.fr/api/films/deepwater
```

### Erreur : "Timeout"
```bash
# L'API OpenAI peut être lente, augmentez le timeout
# Ou réessayez plus tard
```

## 📊 Résultats Attendus

Après avoir exécuté le scénario complet, vous devriez avoir :

- ✅ 3 films dans la queue
- ✅ 3 articles générés
- ✅ 3 articles publiés sur le blog
- ✅ Statistiques à jour
- ✅ Tags extraits automatiquement

## 🎉 Félicitations !

Si tous les tests passent, votre blog MovieHunt est **100% fonctionnel** ! 🚀

Vous pouvez maintenant :
1. Accéder à l'interface : http://localhost:5173
2. Voir vos articles générés
3. Utiliser l'interface admin : http://localhost:5173/admin
4. Importer plus de films
5. Déployer en production !

## 💡 Commandes Utiles

```bash
# Voir les logs du serveur
npm run server

# Voir les logs MongoDB
mongosh
> use moviehunt-blog
> db.articles.find().pretty()
> db.urlqueues.find().pretty()

# Nettoyer la base de données
> db.articles.deleteMany({})
> db.urlqueues.deleteMany({})
```
