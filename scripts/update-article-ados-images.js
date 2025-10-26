/**
 * Script pour mettre à jour les affiches de l'article "Idée de film pour ado"
 */

require('dotenv').config();
const axios = require('axios');

// Charger le modèle Article (Supabase)
const Article = require('../server/models/supabase/Article');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// IDs TMDB corrigés
const films = [
  { title: 'The Truman Show', tmdbId: 37165, year: 1998 },
  { title: 'Ready Player One', tmdbId: 333339, year: 2018 },
  { title: 'Le Cercle des poètes disparus', tmdbId: 207, year: 1989 },
  { title: 'Mean Girls', tmdbId: 673593, year: 2004 }, // Corrigé - version 2024
  { title: 'Le Monde de Charlie', tmdbId: 84892, year: 2012 },
  { title: 'Hunger Games', tmdbId: 70160, year: 2012 },
  { title: 'The Way Way Back', tmdbId: 147773, year: 2013 }, // Corrigé - sans virgule
  { title: 'Sing Street', tmdbId: 369557, year: 2016 }, // Corrigé
  { title: 'The Spectacular Now', tmdbId: 157386, year: 2013 }, // Corrigé
  { title: 'Chronicle', tmdbId: 76726, year: 2012 },
];

async function getMoviePoster(tmdbId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'fr-FR',
      },
    });
    
    if (response.data.poster_path) {
      return `${TMDB_IMAGE_BASE}${response.data.poster_path}`;
    }
    return null;
  } catch (error) {
    console.error(`Erreur TMDB pour ${tmdbId}:`, error.message);
    return null;
  }
}

async function updateArticle() {
  console.log('🔄 Mise à jour de l\'article "Idée de film pour ado"...\n');

  // Récupérer l'article existant
  console.log('📖 Recherche de l\'article...');
  const article = await Article.findBySlug('idee-de-film-pour-ado-10-films-incontournables');
  
  if (!article) {
    console.error('❌ Article non trouvé !');
    process.exit(1);
  }
  
  console.log(`✅ Article trouvé : ${article.title}\n`);

  // Récupérer les nouvelles affiches
  console.log('📸 Récupération des affiches TMDB corrigées...');
  const postersPromises = films.map(film => getMoviePoster(film.tmdbId));
  const posters = await Promise.all(postersPromises);
  
  films.forEach((film, index) => {
    film.poster = posters[index];
    console.log(`  ✓ ${film.title}: ${film.poster ? 'OK' : 'Pas d\'affiche'}`);
  });

  // Reconstruire le contenu avec les bonnes affiches
  const content = `Tu cherches une **idée de film pour ado** qui sorte un peu des sentiers battus ? Que tu aies envie de réfléchir, de rire ou de vivre une belle aventure, certains films marquent à vie lorsqu'on les découvre à l'adolescence. Voici **10 longs-métrages cultes** à (re)voir sans hésiter — seuls, entre amis ou en famille.

## 🎯 6 films incontournables pour ados

### 🧠 1. The Truman Show (1998)

${films[0].poster ? `![The Truman Show](${films[0].poster})` : ''}

Un homme mène une vie parfaite… jusqu'à ce qu'il découvre qu'il vit dans un immense plateau télé. À la fois drôle, troublant et visionnaire, **The Truman Show** questionne notre rapport à l'image et à la liberté. 

**Pourquoi le voir ?** Un film que tout ado devrait voir au moins une fois pour réfléchir à ce qu'est vivre vraiment. Jim Carrey y livre une performance magistrale, loin de ses rôles comiques habituels.

---

### 🚀 2. Ready Player One (2018)

${films[1].poster ? `![Ready Player One](${films[1].poster})` : ''}

Bienvenue dans l'OASIS, un monde virtuel où tout est possible. Spielberg signe ici une aventure épique et bourrée de références à la pop culture. 

**Pourquoi le voir ?** C'est le film parfait pour les ados gamers ou rêveurs, un mélange explosif d'action, d'émotion et de nostalgie geek. Les effets visuels sont spectaculaires et l'histoire pose des questions pertinentes sur notre rapport au virtuel.

---

### 🏫 3. Le Cercle des poètes disparus (1989)

${films[2].poster ? `![Le Cercle des poètes disparus](${films[2].poster})` : ''}

Un professeur hors du commun enseigne à ses élèves à penser par eux-mêmes. Derrière les blazers et les vers de poésie se cache une réflexion puissante sur la pression scolaire, la liberté et la passion.

**Pourquoi le voir ?** Un classique bouleversant qui continue d'inspirer des générations d'élèves. Robin Williams y est inoubliable dans le rôle du professeur Keating. *Carpe Diem* !

---

### 👑 4. Mean Girls (2004)

${films[3].poster ? `![Mean Girls](${films[3].poster})` : ''}

Au lycée, les apparences règnent… et les "Plastics" dictent la loi. **Mean Girls** reste la comédie culte sur les clans, la popularité et la recherche d'identité.

**Pourquoi le voir ?** Derrière l'humour, une vraie satire des codes adolescents. Indispensable pour une soirée fun mais pas si légère qu'elle en a l'air. Les répliques sont devenues iconiques !

---

### ☀️ 5. Le Monde de Charlie (2012)

${films[4].poster ? `![Le Monde de Charlie](${films[4].poster})` : ''}

Un adolescent timide tente de trouver sa place après un passé difficile. Porté par Logan Lerman, Emma Watson et Ezra Miller, ce film parle de solitude, d'amitié et de renaissance avec une sincérité rare.

**Pourquoi le voir ?** C'est un film doudou qui touche droit au cœur. Parfait pour ceux qui se sentent différents ou en décalage. La bande-son est également magnifique.

---

### 🏹 6. Hunger Games (2012)

${films[5].poster ? `![Hunger Games](${films[5].poster})` : ''}

Impossible d'oublier Katniss Everdeen, héroïne courageuse d'un monde où les adolescents s'affrontent pour survivre. Derrière l'action spectaculaire, **Hunger Games** aborde la résistance, la manipulation médiatique et la soif de liberté.

**Pourquoi le voir ?** Une saga forte et inspirante avec une héroïne féminine puissante. Jennifer Lawrence est parfaite dans ce rôle qui l'a révélée au grand public.

---

## 🔍 4 films méconnus à découvrir absolument

Si tu veux aller plus loin et trouver une **idée de film pour ado** plus originale, voici quelques pépites moins connues mais tout aussi marquantes :

### 🎞️ The Way Way Back (2013)

${films[6].poster ? `![The Way Way Back](${films[6].poster})` : ''}

Un adolescent mal dans sa peau passe l'été dans une station balnéaire où il trouve un job inattendu dans un parc aquatique. 

**Pourquoi le voir ?** Drôle, touchant et sincère : un vrai petit bijou de cinéma indépendant. Steve Carell et Sam Rockwell sont excellents.

---

### 🌅 Sing Street (2016)

${films[7].poster ? `![Sing Street](${films[7].poster})` : ''}

Dans le Dublin des années 80, un ado monte un groupe pour impressionner une fille. Un film musical plein d'énergie et d'émotion, avec une bande-son irrésistible.

**Pourquoi le voir ?** Parfait pour ceux qui rêvent de liberté et de création. Les chansons sont addictives et l'histoire est touchante.

---

### 💔 The Spectacular Now (2013)

${films[8].poster ? `![The Spectacular Now](${films[8].poster})` : ''}

Deux adolescents que tout oppose apprennent à se connaître. Ce drame doux-amer aborde la transition vers l'âge adulte avec une justesse rare.

**Pourquoi le voir ?** Un film sensible sur les doutes et les premiers choix de vie. Miles Teller et Shailene Woodley sont remarquables.

---

### 🌌 Chronicle (2012)

${films[9].poster ? `![Chronicle](${films[9].poster})` : ''}

Trois lycéens obtiennent des super-pouvoirs et découvrent que tout pouvoir a un prix. Un film nerveux et original tourné comme un found footage, entre science-fiction et drame psychologique.

**Pourquoi le voir ?** Une approche réaliste et sombre des super-héros. Le format found footage rend l'histoire encore plus immersive.

---

## 💡 Pourquoi ces films sont parfaits pour les ados ?

Trouver une **idée de film pour ado**, ce n'est pas seulement choisir un divertissement : c'est découvrir des récits qui parlent d'**identité**, de **liberté** et de **courage**. 

Ces dix films — connus ou non — prouvent que le cinéma adolescent peut être aussi profond qu'inspirant. Ils abordent des thèmes universels :

- 🧠 **La quête d'identité** : Qui suis-je vraiment ?
- 🎭 **La pression sociale** : Comment rester soi-même ?
- 💪 **Le courage** : Oser défendre ses valeurs
- ❤️ **L'amitié et l'amour** : Les relations qui nous construisent
- 🌟 **Les rêves** : Poursuivre ses passions malgré les obstacles

## 🎬 Comment choisir le bon film ?

Voici quelques conseils pour trouver l'**idée de film pour ado** parfaite selon l'humeur :

### Pour réfléchir
- The Truman Show
- Le Cercle des poètes disparus
- Chronicle

### Pour rire
- Mean Girls
- The Way Way Back

### Pour l'aventure
- Ready Player One
- Hunger Games

### Pour l'émotion
- Le Monde de Charlie
- The Spectacular Now
- Sing Street

## 📺 Où regarder ces films ?

La plupart de ces films sont disponibles sur les plateformes de streaming populaires :

- **Netflix** : Mean Girls, The Spectacular Now
- **Amazon Prime Video** : Le Cercle des poètes disparus, Chronicle
- **Disney+** : Ready Player One (via Star)
- **Apple TV+** : Location/Achat disponible

💡 **Astuce** : Vérifie sur [JustWatch](https://www.justwatch.com/fr) pour savoir où regarder chaque film légalement.

## 🎯 En résumé

Que tu cherches une **idée de film pour ado** pour une soirée entre amis, un moment de réflexion ou simplement pour te divertir, ces 10 films offrent un voyage cinématographique riche et varié.

Des classiques incontournables aux pépites méconnues, chacun de ces films a quelque chose d'unique à offrir. Ils parlent de ce que c'est que de grandir, de douter, de rêver et de devenir soi-même.

👉 **Découvre sur [MovieHunt.fr](https://www.moviehunt.fr) nos critiques détaillées et nos recommandations de films méconnus pour prolonger ta ciné-curiosité.**

---

## ❓ FAQ : Idée de film pour ado

### Quel est le meilleur film pour ado sur Netflix ?
**Mean Girls** et **Le Monde de Charlie** sont d'excellents choix disponibles sur Netflix. Ils mélangent humour, émotion et réflexion.

### Quels films pour ados sur Disney+ ?
**Ready Player One** est disponible via Star sur Disney+. C'est une aventure épique parfaite pour les jeunes gamers.

### Quel film pour ado timide ?
**Le Monde de Charlie** et **The Way Way Back** sont parfaits pour les ados introvertis. Ils parlent de trouver sa place et de s'accepter.

### Quel film d'action pour ado ?
**Hunger Games** et **Ready Player One** offrent de l'action spectaculaire tout en abordant des thèmes profonds.

### Quel film pour ado qui aime la musique ?
**Sing Street** est le choix idéal ! Un film musical touchant avec une bande-son irrésistible.`;

  console.log('\n📝 Mise à jour de l\'article...');
  
  try {
    // Mettre à jour le contenu et l'image de couverture
    const updatedArticle = await Article.findByIdAndUpdate(
      article._id,
      {
        content: content.trim(),
        coverImage: films[0].poster || article.coverImage,
      },
      { new: true }
    );
    
    console.log('\n✅ Article mis à jour avec succès !');
    console.log(`   ID: ${updatedArticle._id}`);
    console.log(`   Slug: ${updatedArticle.slug}`);
    console.log(`   Image de couverture: ${updatedArticle.coverImage}`);
    console.log(`   URL: https://www.moviehunt-blog.fr/article/${updatedArticle.slug}`);
    console.log('\n🎉 Les affiches ont été corrigées !');
    console.log('\n📊 Affiches mises à jour:');
    console.log(`   ✓ Mean Girls (2004) - ID TMDB: 673593`);
    console.log(`   ✓ Sing Street (2016) - ID TMDB: 369557`);
    console.log(`   ✓ The Spectacular Now (2013) - ID TMDB: 157386`);
  } catch (error) {
    console.error('\n❌ Erreur lors de la mise à jour:');
    console.error(`   ${error.message}`);
    if (error.details) {
      console.error(`   Détails: ${error.details}`);
    }
    process.exit(1);
  }
}

// Exécuter le script
updateArticle();
