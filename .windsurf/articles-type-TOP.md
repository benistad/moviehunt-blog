# Articles type TOP — Guide éditorial MovieHunt Blog

## Description

Ce guide définit la structure et les directives pour créer les articles de type "TOP" ou "Liste" sur MovieHunt Blog. Ces articles regroupent plusieurs films autour d'un thème commun (ex : "Films comme Inception", "Top 10 films Netflix", "Thrillers sous-cotés").

---

## Structure du script de création

Chaque article de type TOP est généré via un script Node.js dans `server/scripts/`. Le script :

1. Déclare la liste des films avec titre + année
2. Appelle l'API TMDB pour chaque film (images + métadonnées)
3. Génère le HTML de l'article avec carousels
4. Insère directement en base Supabase (table `articles`)

**Modèle de référence :** `server/scripts/createThrillersSousCotsArticle.js`

---

## Structure HTML de l'article

### Intro (2-3 paragraphes)
```html
<p>Accroche directe, ton passionné, question rhétorique ou constat.</p>
<p>Mise en contexte + promesse éditoriale (<strong>N films...</strong>)</p>
<p>Appel à l'action implicite.</p>
```

### Chaque film (répété N fois)
```html
<h2>1. Titre du Film (Année) : Sous-titre accrocheur</h2>

<!-- ⚠️ CAROUSEL OBLIGATOIRE : les images DOIVENT être sur une seule ligne horizontale scrollable -->
<!-- ⚠️ Ne JAMAIS laisser les images s'empiler verticalement -->
<!-- ⚠️ Le style inline "display: flex" est OBLIGATOIRE — les classes CSS seules ne suffisent pas -->
<!-- ⚠️ Images VARIÉES : ne pas utiliser des images identiques ou très similaires du même film -->
<!--    TMDB renvoie parfois plusieurs recadrages du même poster — vérifier et filtrer -->
<!--    Privilégier : backdrop (scènes du film) + poster + stills — pas 5 versions du même poster -->
<div class="film-carousel" style="display: flex; flex-direction: row; gap: 10px; overflow-x: auto; overflow-y: hidden; margin: 20px 0; padding: 10px 0; flex-wrap: nowrap;">
  <img
    src="/api/tmdb/proxy-image?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FXXX.jpg"
    alt="[Titre Film Année] - [mot-clé SEO pertinent]"
    title="[Titre Film] - image 1"
    style="height: 280px; width: auto; border-radius: 10px; flex-shrink: 0; display: block;"
    loading="lazy"
    decoding="async"
  />
  <!-- répéter pour chaque image — max 5, toutes différentes -->
</div>

<!-- Métadonnées film -->
<ul>
  <li><strong>Genre :</strong> Thriller, Science-Fiction</li>
  <li><strong>Durée :</strong> 118 min</li>
  <li><strong>Réalisateur :</strong> Prénom Nom</li>
  <li><strong>Casting :</strong> Acteur 1, Acteur 2, Acteur 3</li>
</ul>

<p><strong>Le pitch :</strong> Description concise et engageante du film.</p>
<p><strong>Pourquoi ça vaut le détour :</strong> Analyse éditoriale passionnée. <strong>Titre</strong> en gras dans le texte. Lien avec le thème de l'article.</p>
```

### Conclusion + récapitulatif
```html
<h2>En résumé : pourquoi ces films ?</h2>
<p>Synthèse éditoriale.</p>
<ul>
  <li><strong>Film A</strong> si tu veux X</li>
  <li><strong>Film B</strong> si tu veux Y</li>
</ul>
<p>Invitation à la discussion.</p>
```

### FAQ SEO (obligatoire)
```html
<h2>FAQ : [Thème de l'article]</h2>

<h3>Question longue tail SEO 1 ?</h3>
<p>Réponse courte et directe avec les titres de films <strong>en gras</strong>.</p>

<h3>Question longue tail SEO 2 ?</h3>
<p>Réponse courte et directe.</p>

<h3>Question longue tail SEO 3 ?</h3>
<p>Réponse courte et directe.</p>
```

---

## Objectif principal : trafic organique MAXIMUM

**Ces articles sont conçus avant tout pour ranker sur Google.** Chaque décision éditoriale doit servir le SEO. Voici les règles impératives :

### Volume de contenu — OBLIGATOIRE
- **Minimum 1 800 mots** de texte (hors balises HTML)
- **Idéal : 2 000-2 500 mots** — les articles en top 3 Google sur les requêtes compétitives ("films comme X", "meilleurs films Y") dépassent systématiquement 1 800 mots
- Si l'article est trop court après génération, étoffer via :
  - Une section "Pourquoi ces films ?" plus développée (points communs, analyse du genre)
  - Une section "Comment choisir selon ton humeur ?" avec tableau ou liste détaillée
  - Une FAQ plus longue (5-6 questions au lieu de 3-4)
  - Une introduction plus développée avec contexte du film de référence

### Structure SEO impérative
- **H1** (titre de l'article) : mot-clé principal en début de titre
- **H2** pour chaque film : inclure le titre + l'année (ex: `Source Code (2011) : ...`)
- **H2 thématiques** après les films : "Pourquoi ces films ?", "Comment choisir ?", "FAQ"
- **H3** dans la FAQ : chaque question est un H3 = autant de featured snippets potentiels
- **Mot-clé principal** répété naturellement dans l'intro, dans au moins 2 H2, et dans la conclusion
- **Variantes sémantiques** disséminées dans le texte : synonymes, reformulations, titres de films

### FAQ — arme principale pour le trafic
- **Minimum 5 questions** (pas 3) — chaque H3 de FAQ est une chance de featured snippet
- Questions au format "People Also Ask" de Google :
  - "Quels films ressemblent à [X] ?"
  - "Quel est le meilleur film comme [X] ?"
  - "Film [X] disponible sur Netflix ?"
  - "Film [genre] à voir absolument ?"
  - "[Film spécifique] vaut-il le coup ?"
- Réponses courtes et directes (2-3 phrases max par réponse)

### Longue traîne — maximiser les entrées
- Chaque titre de film dans l'article est une requête potentielle
- Mentionner les plateformes (Netflix, Prime, Disney+) quand c'est pertinent → requêtes "film X sur Netflix"
- Mentionner les genres et sous-genres → requêtes "thriller boucle temporelle", "film SF mind-bending"
- Inclure des comparaisons explicites → "si tu as aimé X, tu aimeras Y"

### Maillage sémantique
- Répéter le mot-clé principal (ou ses variantes) dans :
  - L'intro (2x)
  - Au moins 2 sous-titres H2
  - La conclusion
  - La metaDescription
  - L'excerpt
- Ne pas sur-optimiser : 1 occurrence par section suffit, le texte doit rester naturel

---

## Règles SEO

### Titre de l'article
- Format : `[Nombre] [Type] [Thème] : [sous-titre accrocheur]`
- Exemples : `10 Films Comme Inception à Voir Absolument`, `Top 8 Thrillers Sous-Cotés`
- Inclure le mot-clé principal dès le début

### Slug
- Format kebab-case, sans accents, sans stop words inutiles
- Exemple : `films-comme-inception-a-voir-absolument`

### Meta description (150-160 caractères)
- Inclure le mot-clé principal
- Mentionner 2-3 titres de films concrets
- Appel à l'action implicite

### Keywords array
- Mot-clé principal (ex: "films comme Inception")
- Variantes longue traîne (ex: "film similaire à Inception", "Inception alternatives")
- Titres des films listés
- Genres associés

### Balises alt des images
Format : `[Titre Film] [Année] - [mot-clé SEO en rapport avec le thème de l'article]`

Exemples :
- `"Coherence 2013 - film comme Inception réalité alternative"`
- `"Predestination 2014 - film voyage temporel mind-blowing"`
- `"Source Code 2011 - thriller science-fiction boucle temporelle"`

**Règles pour les alt :**
- Toujours inclure le titre et l'année du film
- Ajouter 1-2 mots-clés SEO liés au thème de l'article
- Ne jamais copier-coller le même alt sur toutes les images d'un film
- Varier les formulations : "film similaire à X", "thriller [genre]", "film [adjectif]"

---

## Images TMDB

### Récupération via tmdbService
```javascript
const movieData = await tmdbService.searchMovie(film.title, film.year);
const images = await tmdbService.getMovieImages(movieData.id, 8); // max 8, on en garde 5
const details = await tmdbService.getMovieDetails(movieData.id);
```

### Proxy obligatoire
Toutes les images TMDB doivent passer par le proxy interne :
```javascript
const proxyUrl = '/api/tmdb/proxy-image?url=' + encodeURIComponent(imageUrl);
```

### Fallback si pas d'images
Si `images.length === 0`, utiliser le poster :
```html
<figure class="image image-style-align-center">
  <img src="/api/tmdb/proxy-image?url=..." alt="..." title="..." />
  <figcaption>Titre Film (Année) - Genre</figcaption>
</figure>
```

### Titres alternatifs TMDB
Certains films sont indexés sous leur titre original ou traduit. En cas d'échec, tester :
- Titre original (espagnol, coréen, etc.)
- Titre anglais international
- Ou utiliser directement l'ID TMDB connu

---

## Données article Supabase

```javascript
const supabaseArticle = {
  title: 'N Films [Thème] à Voir Absolument',
  slug: 'n-films-theme-a-voir-absolument',
  content: articleContent,        // HTML généré
  excerpt: 'Description 160 chars max avec mot-clé principal.',
  source_url: '',
  scraped_data: {},
  cover_image: filmsData[0].backdropUrl || filmsData[0].posterUrl,
  tags: ['tag1', 'tag2', 'Titre Film 1', 'Titre Film 2'],
  status: 'draft',                // Toujours créer en draft
  category: 'list',               // Toujours 'list' pour les TOP
  generated_by: 'manual',
  metadata: {
    movieTitle: '[Titre principal ou thème]',
    releaseYear: String(new Date().getFullYear()),
    genre: ['Liste', 'Genre1', 'Genre2'],
  },
  seo: {
    metaTitle: 'N Films [Thème] à Voir Absolument | MovieHunt Blog',
    metaDescription: '...150-160 chars...',
    keywords: ['mot-clé principal', 'variante 1', 'variante 2', 'Titre Film 1'],
  },
  published_at: new Date().toISOString(),
};
```

---

## Ton éditorial

- Direct, passionné, accessible — jamais condescendant
- "tu" (tutoiement) systématique
- Phrases courtes, rythme soutenu
- Éviter les formules génériques : "un chef-d'œuvre", "incontournable", "vous allez adorer"
- Mettre les titres de films **en gras** dans le corps du texte
- Donner une vraie opinion, pas juste un résumé
- **OBLIGATOIRE — Accents et caractères français :** Tous les textes doivent être écrits avec les accents corrects (é, è, ê, à, â, î, ô, ù, û, ç, œ, etc.). Les scripts Node.js génèrent parfois du texte sans accents à cause de l'encodage des chaînes — il faut systématiquement vérifier et corriger avant publication. Ne jamais écrire "realite" à la place de "réalité", "realisateur" à la place de "réalisateur", "generale" à la place de "générale", etc.

---

## Checklist avant publication

- [ ] Tous les films ont au moins 1 image (carousel ou poster)
- [ ] Les balises `alt` sont uniques et contiennent des mots-clés SEO
- [ ] La `cover_image` est définie (backdrop du premier film de préférence)
- [ ] Le `slug` est en kebab-case sans accents
- [ ] La `metaDescription` fait entre 150 et 160 caractères
- [ ] Le tableau `keywords` contient au moins 6 entrées
- [ ] La FAQ contient au moins 3 questions longue traîne
- [ ] Le statut est `draft` (à publier manuellement depuis l'admin)
- [ ] **Tous les accents sont corrects** dans le contenu, le titre, l'excerpt et les métadonnées SEO (é, è, à, â, ê, î, ô, ç, œ…)
