# 🧪 Tests du Système de Catégories

## ✅ Checklist de Vérification

### 1. Migration SQL

- [ ] Ouvrir Supabase SQL Editor
- [ ] Exécuter `server/migrations/add_category_to_articles.sql`
- [ ] Vérifier qu'il n'y a pas d'erreur
- [ ] Vérifier la colonne avec :
  ```sql
  SELECT column_name, data_type, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'articles' AND column_name = 'category';
  ```

### 2. Backend

- [ ] Redémarrer le serveur backend
- [ ] Vérifier qu'il n'y a pas d'erreur au démarrage
- [ ] Tester l'API avec curl ou Postman :
  ```bash
  # Récupérer un article
  curl http://localhost:5000/api/articles/[ID]
  
  # Vérifier que le champ 'category' est présent dans la réponse
  ```

### 3. Frontend - Éditeur

- [ ] Ouvrir un article en mode édition : `/admin/edit/[id]`
- [ ] Vérifier la présence du sélecteur "Catégorie"
- [ ] Vérifier qu'il est placé entre "Image de couverture" et "Tags"
- [ ] Vérifier les 2 options :
  - [ ] "Critiques de films"
  - [ ] "Listes de films"
- [ ] Changer la catégorie
- [ ] Cliquer sur "Sauvegarder"
- [ ] Vérifier qu'il n'y a pas d'erreur
- [ ] Recharger la page
- [ ] Vérifier que la catégorie sélectionnée est bien conservée

### 4. Frontend - Page d'Accueil

- [ ] Aller sur la page d'accueil `/`
- [ ] Vérifier que les cartes d'articles affichent un badge de catégorie
- [ ] Pour un article de type "Critique" :
  - [ ] Badge bleu avec "⭐ Critique"
  - [ ] Badge en haut à gauche de la carte
- [ ] Pour un article de type "Liste" :
  - [ ] Badge orange avec "📋 Liste"
  - [ ] Badge en haut à gauche de la carte

### 5. Frontend - Page d'Article

- [ ] Cliquer sur un article
- [ ] Vérifier la présence du badge de catégorie dans l'en-tête
- [ ] Pour un article de type "Critique" :
  - [ ] Badge bleu avec "⭐ Critique de film"
- [ ] Pour un article de type "Liste" :
  - [ ] Badge orange avec "📋 Liste de films"

### 6. Tests de Validation

- [ ] Essayer de sauvegarder un article avec une catégorie invalide via l'API
  ```bash
  curl -X PUT http://localhost:5000/api/articles/[ID] \
    -H "Content-Type: application/json" \
    -d '{"category": "invalid"}'
  ```
- [ ] Vérifier qu'une erreur est retournée
- [ ] Vérifier le message d'erreur : "Catégorie invalide"

### 7. Tests de Création

- [ ] Créer un nouvel article
- [ ] Vérifier que la catégorie par défaut est "Critiques de films"
- [ ] Changer pour "Listes de films"
- [ ] Publier l'article
- [ ] Vérifier sur la page d'accueil que le badge orange s'affiche

### 8. Tests de Migration d'Articles Existants

- [ ] Ouvrir un article existant (créé avant la migration)
- [ ] Vérifier que la catégorie par défaut est "Critiques de films"
- [ ] Modifier la catégorie si nécessaire
- [ ] Sauvegarder
- [ ] Vérifier que le changement est bien pris en compte

## 🐛 Problèmes Courants

### Le sélecteur de catégorie n'apparaît pas

**Solution** :
1. Vérifier que le frontend a bien été redémarré
2. Vider le cache du navigateur (Cmd+Shift+R sur Mac)
3. Vérifier la console du navigateur pour des erreurs

### Les badges ne s'affichent pas

**Solution** :
1. Vérifier que la migration SQL a bien été exécutée
2. Vérifier dans Supabase que la colonne `category` existe
3. Vérifier que les articles ont bien une valeur pour `category`
4. Vérifier la console du navigateur pour des erreurs

### Erreur lors de la sauvegarde

**Solution** :
1. Vérifier que le backend a bien été redémarré
2. Vérifier les logs du serveur backend
3. Vérifier que la validation est correcte dans `server/middleware/validator.js`

### La catégorie n'est pas conservée après sauvegarde

**Solution** :
1. Vérifier que le champ `category` est bien envoyé dans la requête API
2. Vérifier dans `server/models/supabase/Article.js` que le mapping est correct
3. Vérifier dans Supabase que la valeur est bien enregistrée

## 📊 Requêtes SQL Utiles

### Voir tous les articles avec leur catégorie
```sql
SELECT id, title, category, status, created_at 
FROM articles 
ORDER BY created_at DESC 
LIMIT 10;
```

### Compter les articles par catégorie
```sql
SELECT category, COUNT(*) as count 
FROM articles 
WHERE status = 'published' 
GROUP BY category;
```

### Mettre à jour la catégorie d'un article spécifique
```sql
UPDATE articles 
SET category = 'list' 
WHERE id = 'VOTRE_ID_ARTICLE';
```

### Mettre à jour tous les articles sans catégorie
```sql
UPDATE articles 
SET category = 'review' 
WHERE category IS NULL;
```

## ✅ Résultat Attendu

Après avoir complété tous les tests :

- ✅ Tous les articles ont une catégorie (par défaut "review")
- ✅ L'éditeur permet de changer la catégorie facilement
- ✅ Les badges s'affichent correctement sur toutes les pages
- ✅ Les couleurs sont cohérentes (bleu pour critiques, orange pour listes)
- ✅ Aucune erreur dans la console
- ✅ La sauvegarde fonctionne correctement

## 🎉 Validation Finale

Si tous les tests passent, le système de catégories est opérationnel ! 🚀

Vous pouvez maintenant :
- Créer des articles de critiques
- Créer des articles de listes
- Les visiteurs verront clairement la différence entre les deux types d'articles
