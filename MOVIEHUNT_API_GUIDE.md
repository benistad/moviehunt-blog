# 🎬 Guide d'Utilisation de l'API MovieHunt

Le blog est **entièrement configuré** pour utiliser l'API JSON de MovieHunt. Aucune configuration supplémentaire n'est nécessaire !

## ✅ Fonctionnement Automatique

Le système utilise l'API JSON officielle de MovieHunt :
- **API Film** : `https://www.moviehunt.fr/api/films/[slug]`
- **API Liste** : `https://www.moviehunt.fr/api/films/list`

### Avantages de l'API JSON

✅ **Données structurées** : Format JSON propre et fiable  
✅ **Performance** : Cache HTTP de 1 heure  
✅ **Fiabilité** : Pas de parsing HTML fragile  
✅ **Métadonnées riches** : Score, genres, année, casting, etc.  
✅ **Sections éditoriales** : Points forts, avis, synopsis  

## 🚀 Utilisation

### 1. Générer un article depuis une URL

```bash
# Via l'interface Admin
http://localhost:5173/admin
# Entrez l'URL : https://www.moviehunt.fr/films/deepwater

# Via l'API
curl -X POST http://localhost:5000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.moviehunt.fr/films/deepwater"}'
```

### 2. Importer un film par slug

```bash
# Génération immédiate
curl -X POST http://localhost:5000/api/import/film/deepwater \
  -H "Content-Type: application/json" \
  -d '{"generateNow": true}'

# Ajouter à la queue
curl -X POST http://localhost:5000/api/import/film/deepwater
```

### 3. Voir tous les films disponibles

```bash
# Via l'API
curl http://localhost:5000/api/import/films/available

# Résultat
{
  "success": true,
  "data": {
    "films": [
      {"id": "1", "title": "Deepwater", "slug": "deepwater"},
      {"id": "2", "title": "Heretic", "slug": "heretic"},
      ...
    ],
    "count": 50
  }
}
```

### 4. Import en masse

```bash
# Importer les 10 premiers films
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'

# Importer des films spécifiques
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"slugs": ["deepwater", "heretic", "dark-waters"]}'

# Importer TOUS les films (attention, peut être long)
curl -X POST http://localhost:5000/api/import/films/all
```

### 5. Statistiques d'import

```bash
curl http://localhost:5000/api/import/stats

# Résultat
{
  "success": true,
  "data": {
    "availableOnMovieHunt": 50,
    "inQueue": 5,
    "imported": 20,
    "remaining": 30
  }
}
```

## 📊 Données Extraites

Pour chaque film, l'API fournit :

```json
{
  "title": "Deepwater",
  "slug": "deepwater",
  "score": 5,
  "hunted": false,
  "genres": ["Drame", "Action"],
  "year": 2016,
  "sections": [
    {
      "heading": "Pourquoi le voir ?",
      "content": "• Pour l'histoire vraie\n• Pour la performance de Kurt Russell"
    },
    {
      "heading": "Notre avis",
      "content": "• Pour la réalisation « avec les pieds »\n• Pour le rythme inégal"
    },
    {
      "heading": "Casting",
      "content": "Kurt Russell (Acteur (Jimmy Harrell)), John Malkovich (Acteur (Donald Vidrine))"
    }
  ]
}
```

## 🤖 Génération d'Articles par l'IA

L'IA (GPT-4o mini) reçoit toutes ces données structurées et génère :

1. **Titre accrocheur** optimisé SEO
2. **Extrait** de 150-200 caractères
3. **Article complet** de 800-1200 mots avec :
   - Introduction captivante
   - Synopsis sans spoilers
   - Analyse des points forts
   - Critique constructive
   - Commentaire sur le casting
   - Verdict final basé sur la note
   - Conclusion engageante
4. **Tags** pertinents (genres, thèmes, acteurs)
5. **Métadonnées SEO** (meta-titre, meta-description, keywords)

## 📝 Structure des Articles Générés

```markdown
## Introduction
Présentation du film et contexte

## Synopsis
Résumé de l'histoire

## Ce qui fonctionne
Points forts développés

## Les réserves
Points négatifs (si applicable)

## Le casting
Analyse des performances

## Notre verdict
Recommandation finale basée sur la note X/10
[Badge "Hunted" si film recommandé]

## Conclusion
Phrase de clôture et invitation
```

## 🔄 Workflow Complet

```
1. URL MovieHunt fournie
   ↓
2. Extraction du slug (ex: "deepwater")
   ↓
3. Appel API: https://www.moviehunt.fr/api/films/deepwater
   ↓
4. Récupération des données JSON structurées
   ↓
5. Transformation des données pour l'IA
   ↓
6. Génération de l'article avec GPT-4o mini
   ↓
7. Sauvegarde dans MongoDB
   ↓
8. Publication sur le blog
```

## 🎯 Exemples de Films Disponibles

```
- deepwater
- heretic
- dark-waters
- ad-astra
- conclave
- 1917
- alien-romulus
- amsterdam
```

## 🔧 Personnalisation

### Modifier le prompt IA

Éditez `server/services/aiService.js` pour personnaliser :
- Le ton des articles
- La structure
- Les sections
- Le niveau de détail

### Modifier le scraping

Éditez `server/services/scraperService.js` pour :
- Changer l'URL de l'API
- Ajouter des transformations de données
- Personnaliser l'extraction d'images

## 💡 Conseils d'Utilisation

### Import Initial
```bash
# Commencez par importer quelques films pour tester
curl -X POST http://localhost:5000/api/import/films/bulk \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'

# Puis traitez la queue
curl -X POST http://localhost:5000/api/queue/process \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

### Automatisation avec Cron
```bash
# Ajouter dans crontab pour import quotidien
0 2 * * * curl -X POST http://localhost:5000/api/import/films/bulk -d '{"limit":10}'
0 3 * * * curl -X POST http://localhost:5000/api/queue/process -d '{"limit":10}'
```

### Webhook MovieHunt
```bash
# Configurez le webhook sur MovieHunt pour recevoir les nouveaux films
POST http://votre-domaine.com/api/webhook/moviehunt
{
  "url": "https://www.moviehunt.fr/films/nouveau-film",
  "event": "page.created"
}
```

## 🐛 Dépannage

### Film non trouvé
```
Erreur: Film "xxx" non trouvé sur MovieHunt
→ Vérifiez que le slug existe dans l'API
→ Testez: curl https://www.moviehunt.fr/api/films/xxx
```

### Erreur API
```
Erreur: Erreur API: timeout
→ Vérifiez votre connexion internet
→ L'API MovieHunt peut être temporairement indisponible
```

### Article non généré
```
→ Vérifiez votre clé API OpenAI
→ Vérifiez les logs du serveur
→ Assurez-vous d'avoir des crédits OpenAI
```

## 📚 Ressources

- **API MovieHunt** : https://www.moviehunt.fr/api/films/
- **Documentation OpenAI** : https://platform.openai.com/docs
- **Code source** : `server/services/scraperService.js`

## ✨ Fonctionnalités Avancées

### Régénération d'articles
```bash
# Régénérer un article existant avec de nouvelles données
curl -X POST http://localhost:5000/api/articles/{id}/regenerate
```

### Filtrage par note
```javascript
// Dans votre code, filtrer les films par note
const films = await scraperService.getAllFilms();
const topFilms = films.filter(f => f.score >= 7);
```

### Attribution automatique
Tous les articles générés incluent automatiquement :
- Lien vers la source MovieHunt
- Mention "Source: MovieHunt"
- Badge "Hunted by MovieHunt" si applicable

## 🎉 Prêt à l'emploi !

Le système est **100% fonctionnel** et prêt à générer des articles. Il vous suffit de :

1. Démarrer l'application : `npm run dev`
2. Aller dans l'admin : http://localhost:5173/admin
3. Entrer une URL MovieHunt
4. Laisser l'IA faire le reste !

Bon blogging ! 🚀
