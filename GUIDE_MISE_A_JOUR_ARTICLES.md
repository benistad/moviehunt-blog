# Guide de Mise à Jour des Articles Existants

Ce guide définit les règles à respecter impérativement lors de la modification d'un article déjà publié sur MovieHunt.

---

## ⚠️ Règles Absolues

### 1. Ne jamais toucher à l'image en une (`cover_image`)

L'image de couverture (image en une) d'un article existant **ne doit jamais être modifiée** lors d'une mise à jour de contenu.

- Elle a pu être choisie manuellement, optimisée ou référencée ailleurs (réseaux sociaux, partages, etc.)
- Toute modification d'un article via script Supabase **doit exclure `cover_image` du `update()`**

```javascript
// ✅ CORRECT — ne pas inclure cover_image
await supabase.from('articles').update({
  content: newContent,
  updated_at: new Date().toISOString(),
}).eq('slug', 'mon-article');

// ❌ INCORRECT — écrase l'image en une existante
await supabase.from('articles').update({
  content: newContent,
  cover_image: '...',   // ← NE JAMAIS FAIRE ça sur un article existant
  updated_at: new Date().toISOString(),
}).eq('slug', 'mon-article');
```

---

### 2. Toujours mettre à jour `updated_at`

Chaque modification d'un article **doit inclure `updated_at`** avec la date courante. C'est ce champ qui alimente l'affichage "Mis à jour le" sur le site et qui indique à Google que le contenu est frais.

```javascript
updated_at: new Date().toISOString()
```

> Un article mis à jour avec une date récente est mieux référencé qu'un article vieillissant. C'est un signal SEO important.

---

## 📋 Checklist Mise à Jour

Avant d'exécuter un script de mise à jour sur un article existant :

- [ ] Le champ `cover_image` est **absent** du `update()`
- [ ] Le champ `updated_at` est **présent** et défini à `new Date().toISOString()`
- [ ] Le champ `status` est **absent** du `update()` (sauf si intentionnellement changé)
- [ ] Le champ `slug` est **absent** du `update()` (ne jamais changer le slug d'un article publié — casse les URLs indexées)
- [ ] Le champ `published_at` est **absent** du `update()` (ne pas remodifier la date de publication)

---

## 🔧 Template de Script de Mise à Jour

```javascript
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // 1. Lire l'article existant (sans modifier cover_image ni slug)
  const { data, error } = await supabase
    .from('articles')
    .select('id, content')   // ← ne pas sélectionner cover_image si on ne l'utilise pas
    .eq('slug', 'mon-slug-article')
    .single();

  if (error) { console.error('❌', error.message); process.exit(1); }

  // 2. Modifier uniquement ce qui doit l'être
  let content = data.content;
  // ... modifications du contenu ...

  // 3. Mettre à jour — SANS cover_image, AVEC updated_at
  const { error: e2 } = await supabase
    .from('articles')
    .update({
      content,
      updated_at: new Date().toISOString(),  // ← OBLIGATOIRE
      // cover_image: '...',                 // ← INTERDIT
      // slug: '...',                        // ← INTERDIT
      // published_at: '...',                // ← INTERDIT
    })
    .eq('id', data.id);

  if (e2) { console.error('❌', e2.message); process.exit(1); }
  console.log('✅ Article mis à jour (cover_image conservée, updated_at rafraîchi)');
}

run().catch(console.error);
```

---

## 💡 Cas particuliers

### Mise à jour du SEO (metaTitle, metaDescription, keywords)

Le champ `seo` peut être modifié sans problème. Bien penser à inclure `updated_at`.

```javascript
await supabase.from('articles').update({
  seo: { metaTitle: '...', metaDescription: '...', keywords: [...] },
  updated_at: new Date().toISOString(),
}).eq('slug', 'mon-article');
```

### Changement de catégorie ou de tags

Ces champs peuvent être modifiés. Ne pas oublier `updated_at`.

### Republication d'un article en draft

Si l'article passe de `draft` à `published`, mettre `status: 'published'` ET `published_at: new Date().toISOString()`.

---

## 📚 Références

- Modèle Article : `server/models/supabase/Article.js`
- Guide création articles liste : `GUIDE_CREATION_ARTICLES_LISTE.md`
- Guide visuels Supabase : `GUIDE_VISUEL_SUPABASE.md`
