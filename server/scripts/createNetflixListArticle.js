require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const tmdbService = require('../services/tmdbService');
const axios = require('axios');

const films = [
  { title: 'Circle', year: 2015 },
  { title: 'I Am Mother', year: 2019 },
  { title: 'Calibre', year: 2018 },
  { title: 'ARQ', year: 2016 },
  { title: 'His House', year: 2020 },
  { title: 'Fractured', year: 2019 },
  { title: 'Oxygen', year: 2021 },
  { title: 'Triple Frontier', year: 2019 },
  { title: 'The Discovery', year: 2017 },
  { title: 'The Good Nurse', year: 2022 }
];

async function getFilmImages() {
  const filmsData = [];
  
  for (const film of films) {
    console.log(`\n🎬 Recherche: ${film.title} (${film.year})`);
    
    // Rechercher le film
    const movieData = await tmdbService.searchMovie(film.title, film.year);
    
    if (movieData) {
      // Récupérer les images
      const images = await tmdbService.getMovieImages(movieData.id, 10);
      
      filmsData.push({
        title: film.title,
        year: film.year,
        tmdbId: movieData.id,
        posterUrl: movieData.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` 
          : null,
        backdropUrl: movieData.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}` 
          : null,
        images: images.slice(0, 5) // Limiter à 5 images par film
      });
      
      console.log(`✅ ${images.length} images trouvées`);
    } else {
      console.log(`❌ Film non trouvé`);
    }
    
    // Pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return filmsData;
}

async function createArticle() {
  console.log('📝 Récupération des données TMDB...\n');
  const filmsData = await getFilmImages();
  
  console.log('\n\n📊 Résumé:');
  console.log(JSON.stringify(filmsData, null, 2));
  
  // Créer le contenu HTML de l'article avec les carrousels
  const articleContent = generateArticleHTML(filmsData);
  
  // Publier l'article
  const article = {
    title: '10 Films Méconnus sur Netflix à Voir Absolument en 2026 (Pépites Cachées)',
    slug: '10-films-meconnus-netflix-2026',
    excerpt: 'Tu as l\'impression de passer plus de temps à faire défiler le catalogue Netflix qu\'à réellement regarder un film ? Découvre 10 pépites cachées qui valent largement le détour.',
    content: articleContent,
    category: 'list',
    tags: ['Netflix', 'Films cachés', 'Recommandations', 'Thriller', 'Science-fiction'],
    status: 'published',
    coverImage: filmsData[0]?.backdropUrl || filmsData[0]?.posterUrl,
    metadata: {
      movieTitle: '10 Films Netflix',
      releaseYear: '2026',
      genre: ['Liste', 'Recommandations']
    }
  };
  
  try {
    const response = await axios.post('https://moviehunt-blog-api.vercel.app/api/articles', article);
    console.log('\n✅ Article créé avec succès!');
    console.log(`📄 ID: ${response.data._id}`);
    console.log(`🔗 Slug: ${response.data.slug}`);
  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'article:', error.response?.data || error.message);
  }
}

function generateArticleHTML(filmsData) {
  const intro = `
    <p>Tu as l'impression de passer plus de temps à faire défiler le catalogue Netflix qu'à réellement regarder un film ? C'est le piège classique. L'algorithme de Netflix est conçu pour te pousser les mêmes blockbusters et les séries du moment. Résultat : des dizaines de chefs-d'œuvre passent sous ton radar.</p>
    
    <p>Si tu cherches que regarder ce soir et que tu en as marre du réchauffé, tu es au bon endroit. Voici 10 films méconnus sur Netflix, de véritables pépites sous-cotées qui valent largement le détour. Pas de recommandations banales, juste du suspense, des concepts fous et des scénarios qui retournent le cerveau.</p>
  `;
  
  const films = [
    {
      number: 1,
      title: 'Circle (2015) : Le jeu de massacre psychologique',
      genre: 'Thriller / Science-fiction',
      duration: '1h 27min',
      pitch: '50 inconnus se réveillent disposés en cercle dans une pièce sombre. Toutes les deux minutes, l\'un d\'eux est foudroyé… à moins que le groupe ne vote pour choisir la prochaine victime.',
      why: 'Un huis clos oppressant aux faux airs de Black Mirror. Ce film indépendant repose sur un concept minimaliste redoutablement efficace. La vraie force de Circle réside dans son étude sociologique cruelle : face à la mort, quels critères les humains utilisent-ils pour juger qui mérite de vivre ? Tu te demanderas constamment : « Et moi, j\'aurais voté pour qui ? »'
    },
    {
      number: 2,
      title: 'I Am Mother (2019) : La science-fiction intelligente',
      genre: 'Anticipation / Huis clos',
      casting: 'Hilary Swank, Clara Rugaard',
      pitch: 'Dans un bunker post-apocalyptique, une adolescente est élevée par "Mère", un robot bienveillant conçu pour repeupler la Terre. Mais l\'arrivée soudaine d\'une femme blessée venue de l\'extérieur va faire voler en éclats toutes ses certitudes.',
      why: 'Loin des explosions habituelles de la SF, ce film pose de vraies questions philosophiques sur l\'intelligence artificielle et la moralité. La tension monte crescendo jusqu\'à un final glaçant.'
    },
    {
      number: 3,
      title: 'Calibre (2018) : La tension à son paroxysme',
      genre: 'Thriller dramatique',
      casting: 'Jack Lowden, Martin McCann',
      pitch: 'Deux amis d\'enfance partent pour un paisible week-end de chasse dans les Highlands écossais. Une seconde d\'inattention, un coup de feu accidentel, et leur vie bascule dans un cauchemar absolu.',
      why: 'Probablement l\'un des thrillers les plus angoissants du catalogue Netflix. L\'atmosphère est poisseuse, réaliste et terriblement étouffante. Un film sur la culpabilité qui te prendra aux tripes du début à la fin.'
    },
    {
      number: 4,
      title: 'ARQ (2016) : La boucle temporelle nerveuse',
      genre: 'Action / SF',
      casting: 'Robbie Amell, Rachael Taylor',
      pitch: 'Dans un futur dystopique ravagé par une guerre énergétique, un ingénieur et sa compagne sont coincés dans un laboratoire. Ils revivent sans cesse la même attaque mortelle et doivent utiliser cette boucle temporelle pour protéger une technologie révolutionnaire.',
      why: 'Un savant mélange entre Un jour sans fin et un thriller d\'action nerveux. Malgré un budget modeste, le film exploite son concept de manière brillante et ne laisse aucun temps mort.'
    },
    {
      number: 5,
      title: 'His House (2020) : L\'horreur qui a du sens',
      genre: 'Épouvante / Drame social',
      casting: 'Wunmi Mosaku, Sope Dirisu',
      pitch: 'Un couple de réfugiés fuit la guerre au Soudan du Sud pour trouver asile en Angleterre. Mais la maison délabrée que l\'État leur a attribuée semble habitée par une force sinistre venue de leur passé.',
      why: 'Une masterclass. Ce n\'est pas qu\'un simple film de fantômes ou de maison hantée ; c\'est une métaphore poignante sur le traumatisme de l\'exil. Un mélange parfait et acclamé par la critique (100% sur Rotten Tomatoes !).'
    },
    {
      number: 6,
      title: 'Fractured (La Faille) (2019) : Le puzzle mental',
      genre: 'Thriller psychologique',
      casting: 'Sam Worthington, Lily Rabe',
      pitch: 'Après un accident de la route, un père amène sa fille et sa femme aux urgences. Il s\'endort dans la salle d\'attente. À son réveil, sa famille a disparu et l\'hôpital affirme ne les avoir jamais admis.',
      why: 'Un thriller paranoïaque qui joue avec tes nerfs. Le scénario est conçu pour te faire douter de tout et de tout le monde, jusqu\'au twist final particulièrement retors.'
    },
    {
      number: 7,
      title: 'Oxygène (2021) : Claustrophobes s\'abstenir',
      genre: 'Survie / Science-fiction',
      casting: 'Mélanie Laurent, Mathieu Amalric (voix)',
      pitch: 'Une femme amnésique se réveille enfermée dans une capsule cryogénique médicale. Le niveau d\'oxygène baisse dangereusement. Elle doit retrouver la mémoire pour comprendre comment s\'échapper avant l\'asphyxie.',
      why: 'Le réalisateur français Alexandre Aja nous livre un huis clos de survie intense, porté de bout en bout par la performance exceptionnelle de Mélanie Laurent. Une course contre la montre haletante.'
    },
    {
      number: 8,
      title: 'Triple Frontière (2019) : Le braquage atypique',
      genre: 'Action / Braquage',
      casting: 'Ben Affleck, Oscar Isaac, Pedro Pascal',
      pitch: 'D\'anciens membres des forces spéciales décident de monter un braquage illégal pour dérober la fortune d\'un baron de la drogue en Amérique du Sud. Mais l\'avidité va rapidement compliquer l\'opération.',
      why: 'Bien qu\'il ait un casting 5 étoiles, il est souvent oublié au fond du catalogue. C\'est bien plus qu\'un simple film de gros bras : il aborde la loyauté, les conséquences de la guerre et la nature corruptible de l\'homme.'
    },
    {
      number: 9,
      title: 'The Discovery (2017) : Et si l\'au-delà existait ?',
      genre: 'Romance / Drame de SF',
      casting: 'Robert Redford, Rooney Mara, Jason Segel',
      pitch: 'Un scientifique prouve de manière irréfutable l\'existence d\'une vie après la mort. Cette découverte provoque une vague de suicides massive à l\'échelle mondiale, les gens cherchant à "passer de l\'autre côté".',
      why: 'Un film contemplatif, philosophique et mélancolique qui détonne avec les productions habituelles. Une ambiance unique pour ceux qui aiment les scénarios d\'anticipation profonds.'
    },
    {
      number: 10,
      title: 'Meurtres sans ordonnance (The Good Nurse) (2022) : Le true crime effrayant',
      genre: 'Thriller / Fait divers',
      casting: 'Jessica Chastain, Eddie Redmayne',
      pitch: 'Amy, une infirmière compatissante, commence à soupçonner son nouveau et discret collègue, Charlie, d\'être responsable d\'une série de décès inexpliqués parmi les patients de l\'hôpital.',
      why: 'Tiré d\'une glaçante histoire vraie, ce film repose entièrement sur la tension psychologique et le jeu exceptionnel de ses deux acteurs oscarisés. Froid, clinique, et redoutable.'
    }
  ];
  
  let content = intro;
  
  films.forEach((film, index) => {
    const filmData = filmsData[index];
    
    content += `
      <h2>${film.number}. ${film.title}</h2>
      <ul>
        <li><strong>Genre :</strong> ${film.genre}</li>
        ${film.duration ? `<li><strong>Durée :</strong> ${film.duration}</li>` : ''}
        ${film.casting ? `<li><strong>Casting :</strong> ${film.casting}</li>` : ''}
      </ul>
    `;
    
    // Ajouter le carrousel d'images si disponible
    if (filmData && filmData.images && filmData.images.length > 0) {
      content += `
        <div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0; padding: 10px 0;">
      `;
      
      filmData.images.forEach(imageUrl => {
        content += `
          <img src="${imageUrl}" alt="${film.title}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0;" loading="lazy" decoding="async" />
        `;
      });
      
      content += `</div>`;
    }
    
    content += `
      <p><strong>Le pitch :</strong> ${film.pitch}</p>
      <p><strong>Pourquoi ça vaut le détour :</strong> ${film.why}</p>
    `;
  });
  
  // Conclusion
  content += `
    <h2>Conclusion : Ne laisse plus l'algorithme choisir pour toi</h2>
    <p>Ces 10 pépites cachées sur Netflix partagent toutes un point commun : elles ont une véritable identité visuelle et narrative, loin des sentiers battus. La prochaine fois que tu ne sais pas quoi regarder, pioche dans cette liste, tu ne seras pas déçu.</p>
    
    <h2>FAQ : Les films cachés sur Netflix en 2026</h2>
    
    <h3>Comment trouver des films méconnus sur Netflix ?</h3>
    <p>Pour contourner l'algorithme, tu peux utiliser les "codes secrets Netflix". En tapant des codes spécifiques dans la barre de recherche (ou via l'URL sur ordinateur), tu peux accéder à des sous-catégories ultra-nichées (comme "Thrillers psychologiques" ou "Films de SF étrangers") qui ne s'affichent pas sur ton profil classique.</p>
    
    <h3>Quel est le meilleur thriller caché sur Netflix ?</h3>
    <p>Si tu aimes la tension psychologique et l'action réaliste, Calibre est souvent cité comme l'un des meilleurs thrillers indépendants de la plateforme. Pour un huis clos mystérieux, Circle est un incontournable.</p>
    
    <h3>Ces films vont-ils rester sur Netflix en 2026 ?</h3>
    <p>La plupart des films de cette liste (comme Oxygen, I Am Mother ou The Good Nurse) sont des "Netflix Originals", ce qui signifie qu'ils appartiennent à la plateforme et ne quitteront normalement jamais le catalogue. Tu peux donc les ajouter à ta liste sans crainte de les voir disparaître à la fin du mois.</p>
  `;
  
  return content;
}

createArticle().catch(console.error);
