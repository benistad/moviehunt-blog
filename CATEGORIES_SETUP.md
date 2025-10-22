# 📂 Configuration des Catégories d'Articles

Ce guide explique comment activer le système de catégories pour vos articles.

## 🎯 Fonctionnalités

Le système de catégories permet de classer vos articles en deux types :
- **⭐ Critiques de films** (par défaut) : Articles de critique et analyse de films
- **📋 Listes de films** : Articles de type liste, sélection, top films, etc.

## 🚀 Installation

### Étape 1 : Appliquer la migration SQL

Connectez-vous à votre base de données Supabase et exécutez la migration :

1. Allez dans votre projet Supabase
2. Cliquez sur **SQL Editor** dans la sidebar
3. Cliquez sur **"New query"**
4. Copiez-collez le contenu du fichier `server/migrations/add_category_to_articles.sql`
5. Cliquez sur **"Run"** (ou Ctrl+Enter)

Le script SQL va :
- Ajouter une colonne `category` à la table `articles`
- Définir `'review'` comme valeur par défaut (Critiques de films)
- Créer un index pour optimiser les recherches par catégorie
- Appliquer une contrainte pour n'accepter que les valeurs `'review'` ou `'list'`

### Étape 2 : Vérifier l'installation

Vérifiez que la colonne a bien été ajoutée :

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'articles' AND column_name = 'category';
```

Vous devriez voir :
- **column_name** : `category`
- **data_type** : `text`
- **column_default** : `'review'::text`

## 📝 Utilisation

### Dans l'éditeur d'article

1. Ouvrez un article en mode édition (`/admin/edit/[id]`)
2. Vous verrez un nouveau sélecteur **"Catégorie"** entre l'image de couverture et les tags
3. Choisissez la catégorie appropriée :
   - **Critiques de films** : Pour les articles de critique
   - **Listes de films** : Pour les listes et sélections
4. Sauvegardez l'article

### Valeur par défaut

Tous les nouveaux articles sont automatiquement créés avec la catégorie **"Critiques de films"** (`review`).

Les articles existants conservent également cette catégorie par défaut.

## 🎨 Affichage

### Sur les cartes d'articles (page d'accueil)

Chaque carte d'article affiche un badge de catégorie en haut à gauche :
- **⭐ Critique** : Badge bleu pour les critiques
- **📋 Liste** : Badge orange pour les listes

### Sur la page d'article

L'en-tête de l'article affiche un badge de catégorie :
- **⭐ Critique de film** : Badge bleu
- **📋 Liste de films** : Badge orange

## 🔧 Personnalisation

### Modifier les couleurs des badges

**Dans ArticleCardNext.tsx** (cartes d'articles) :
```tsx
{article.category === 'list' ? (
  <div className="bg-orange-500 text-white ...">
    📋 Liste
  </div>
) : (
  <div className="bg-blue-500 text-white ...">
    ⭐ Critique
  </div>
)}
```

**Dans [slug].tsx** (page d'article) :
```tsx
<div className={`... ${
  article.category === 'list' 
    ? 'bg-orange-500 text-white' 
    : 'bg-blue-500 text-white'
}`}>
```

### Ajouter de nouvelles catégories

Si vous souhaitez ajouter d'autres catégories à l'avenir :

1. **Modifier la contrainte SQL** :
```sql
ALTER TABLE articles 
DROP CONSTRAINT articles_category_check;

ALTER TABLE articles 
ADD CONSTRAINT articles_category_check 
CHECK (category IN ('review', 'list', 'nouvelle_categorie'));
```

2. **Mettre à jour la validation API** (`server/middleware/validator.js`) :
```javascript
body('category')
  .optional()
  .isIn(['review', 'list', 'nouvelle_categorie'])
  .withMessage('Catégorie invalide'),
```

3. **Ajouter l'option dans l'éditeur** (`client/src/pages/ArticleEditor.jsx`) :
```jsx
<select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option value="review">Critiques de films</option>
  <option value="list">Listes de films</option>
  <option value="nouvelle_categorie">Nouvelle Catégorie</option>
</select>
```

4. **Mettre à jour l'affichage** dans les composants d'affichage

## 📊 Filtrage par catégorie (optionnel)

Pour ajouter un filtre par catégorie sur la page d'accueil, vous pouvez modifier l'API :

**Dans ArticleQuery (server/models/supabase/Article.js)** :
```javascript
if (this.query.category) {
  supabaseQuery = supabaseQuery.eq('category', this.query.category);
}
```

**Dans la page d'accueil (client/pages/index.tsx)** :
```typescript
const response = await axios.get(`${apiUrl}/articles`, {
  params: {
    page,
    limit: 9,
    status: 'published',
    category: selectedCategory, // Ajouter ce paramètre
    search,
  },
});
```

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. ✅ Créez ou éditez un article
2. ✅ Changez la catégorie
3. ✅ Sauvegardez
4. ✅ Vérifiez que le badge s'affiche correctement sur la page d'accueil
5. ✅ Vérifiez que le badge s'affiche correctement sur la page d'article

## 🎉 C'est prêt !

Votre système de catégories est maintenant opérationnel !

Les articles peuvent être classés en **Critiques** ou **Listes**, avec un affichage visuel clair pour les visiteurs.
