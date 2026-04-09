require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const tmdbService = require('../services/tmdbService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const films = [
  { title: 'Source Code', year: 2011 },
  { title: 'Coherence', year: 2013 },
  { title: 'Predestination', year: 2014 },
  { title: 'The Thirteenth Floor', year: 1999 },
  { title: 'Enemy', year: 2013 },
  { title: 'Triangle', year: 2009 },
  { title: 'The One I Love', year: 2014 },
  { title: 'Timecrimes', year: 2007 },
];

const filmsMeta = [
  {
    title: 'Source Code',
    displayTitle: 'Source Code (2011) : La boucle parfaite',
    pitch: 'Un soldat se retrouve propulse dans la peau d\'un autre homme, condamne a revivre les 8 dernieres minutes avant l\'explosion d\'un train. Sa mission : identifier l\'auteur de l\'attentat avant qu\'une seconde bombe ne tue des milliers de personnes.',
    why: '<strong>Source Code</strong> est exactement ce que promettait Inception : un film d\'action intelligent qui ne sacrifie pas le fond pour le spectacle. Duncan Jones construit un concept vertigineux et le tient de bout en bout. La boucle temporelle n\'est pas un gadget — c\'est le coeur du recit, et chaque repetition revele quelque chose de nouveau.',
    altTag: 'Source Code 2011 - film comme Inception boucle temporelle science-fiction',
  },
  {
    title: 'Coherence',
    displayTitle: 'Coherence (2013) : La realite qui se fracture',
    pitch: 'Une soiree entre amis, une comete qui passe, l\'electricite qui coupe. Et soudain, la realite n\'est plus tout a fait la meme. Ce qui commence comme un diner ordinaire devient une spirale de doubles et de choix impossibles.',
    why: '<strong>Coherence</strong> a ete tourne en une nuit avec 50 000 dollars et aucun script complet — et le resultat est siderant. Comme Inception, il te force a recomposer le puzzle en temps reel. Mais la ou Nolan te guide, Coherence te lache dans le labyrinthe et te laisse te debrouiller.',
    altTag: 'Coherence 2013 - film similaire Inception realite alternative fragmentation',
  },
  {
    title: 'Predestination',
    displayTitle: 'Predestination (2014) : Le twist ultime',
    pitch: 'Un agent temporel traque un terroriste a travers differentes epoques. Mais plus il avance dans son enquete, plus les couches du temps se replient sur elles-memes — jusqu\'a un denouement qui oblige a tout revoir depuis le debut.',
    why: 'Si tu as aime la structure en oignon d\'Inception, <strong>Predestination</strong> va te retourner le cerveau. Les freres Spierig adaptent une nouvelle de Robert Heinlein avec une precision chirurgicale. Le twist final n\'est pas une pirouette — c\'est une conclusion logique et implacable d\'une narration parfaitement construite.',
    altTag: 'Predestination 2014 - film voyage temporel mind-blowing twist final',
  },
  {
    title: 'The Thirteenth Floor',
    displayTitle: 'The Thirteenth Floor (1999) : Les niveaux de realite avant l\'heure',
    pitch: 'En 1999, une entreprise cree une simulation parfaite de Los Angeles en 1937. Quand son fondateur est assassine, un employe plonge dans la simulation pour retrouver des indices. Mais les frontières entre le reel et le simule commencent a se dissoudre.',
    why: '<strong>The Thirteenth Floor</strong> a eu le malheur de sortir la meme annee que Matrix et s\'est retrouve dans son ombre. Tort immense. Ce film pose les memes questions qu\'Inception sur les niveaux de realite, mais avec une elegance plus austere, presque melancholique. Un classique sous-estime qui merite une vraie redecouverte.',
    altTag: 'The Thirteenth Floor 1999 - film niveaux de realite simulation comme Inception',
  },
  {
    title: 'Enemy',
    displayTitle: 'Enemy (2013) : Le double et la spirale',
    pitch: 'Adam, un professeur d\'universite discret, decouvre par hasard son double parfait dans un film. Il decide de le retrouver. A partir de la, la realite se deforme, les identites se brouillent, et le film se transforme en cauchemar eveille.',
    why: 'Denis Villeneuve signe avec <strong>Enemy</strong> quelque chose de radicalement different de ses autres oeuvres — un film de l\'inconscient, dense de symbolisme, qui ne donne pas ses cles. Comme Inception, il t\'attire dans une realite instable. Mais il refuse de te rassurer a la fin. Plan final : inoubliable.',
    altTag: 'Enemy 2013 - film ambiance troublante double identite comme Inception Denis Villeneuve',
  },
  {
    title: 'Triangle',
    displayTitle: 'Triangle (2009) : Le casse-tete sans fond',
    pitch: 'Jess et ses amis partent en mer. Une tempete les force a monter sur un paquebot abandonne. Et la, quelque chose d\'etrange commence : ils semblent avoir deja vecu tout ca.',
    why: '<strong>Triangle</strong> est le genre de film qu\'on ne comprend pas completement lors du premier visionnage — et c\'est exactement ce qui le rend addictif. Christopher Smith construit une boucle narrative d\'une coherence impressionnante. Si tu aimes Inception pour sa mecanique de puzzle, Triangle va te hanter.',
    altTag: 'Triangle 2009 - film boucle temporelle puzzle narratif similaire Inception',
  },
  {
    title: 'The One I Love',
    displayTitle: 'The One I Love (2014) : L\'identite sous pression',
    pitch: 'Un couple en crise accepte de partir en retraite dans une maison isolee sur les conseils de leur therapeute. Mais dans cette maison, quelque chose d\'inexplicable se produit : une version idealisee de leur partenaire les attend.',
    why: '<strong>The One I Love</strong> explore le meme territoire qu\'Inception — la perception que nous avons de nos proches, la frontiere entre le reel et ce qu\'on projette. Avec un budget minimal, le film cree une angoisse douce et persistante, et pose des questions sur l\'identite qui restent en tete bien apres le generique.',
    altTag: 'The One I Love 2014 - film realite alternative identite subtil comme Inception',
  },
  {
    title: 'Timecrimes',
    displayTitle: 'Timecrimes (2007) : Le paradoxe parfait',
    pitch: 'Hector, un homme ordinaire dans une maison ordinaire, observe avec ses jumelles quelque chose d\'etrange dans les bois. En allant enqueter, il se retrouve aspire dans une machine a voyager dans le temps — et condamne a repeter les memes erreurs.',
    why: 'Le Espagnol Nacho Vigalondo realise avec <strong>Timecrimes</strong> l\'equivalent low-budget d\'Inception : un film de voyages temporels parfaitement logique, sans effets speciaux, juste avec un concept solide et une execution impeccable. Si tu aimes les paradoxes temporels, c\'est le film le plus efficace sur le sujet avec trois fois rien.',
    altTag: 'Timecrimes 2007 - film paradoxe temporel minimaliste intelligent espagnol',
  },
];

async function getFilmData() {
  const filmsData = [];

  for (const film of films) {
    console.log('\nRecherche TMDB: ' + film.title + ' (' + film.year + ')');

    try {
      const movieData = await tmdbService.searchMovie(film.title, film.year);

      if (movieData) {
        const images = await tmdbService.getMovieImages(movieData.id, 8);
        const details = await tmdbService.getMovieDetails(movieData.id);

        const genres = (details && details.genres) ? details.genres.map(function(g) { return g.name; }).join(', ') : '';
        const runtime = (details && details.runtime) ? details.runtime + ' min' : '';
        const director = (details && details.credits && details.credits.crew)
          ? ((details.credits.crew.find(function(p) { return p.job === 'Director'; }) || {}).name || '')
          : '';
        const cast = (details && details.credits && details.credits.cast)
          ? details.credits.cast.slice(0, 3).map(function(a) { return a.name; }).join(', ')
          : '';

        filmsData.push({
          title: film.title,
          year: film.year,
          tmdbId: movieData.id,
          posterUrl: movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : null,
          backdropUrl: movieData.backdrop_path ? 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path : null,
          images: images.slice(0, 5),
          genres: genres,
          runtime: runtime,
          director: director,
          cast: cast,
        });

        console.log('OK - ' + images.length + ' images, genres: ' + genres);
      } else {
        console.log('Non trouve - insertion sans images');
        filmsData.push({ title: film.title, year: film.year, images: [], posterUrl: null, backdropUrl: null, genres: '', runtime: '', director: '', cast: '' });
      }
    } catch (err) {
      console.warn('Erreur pour ' + film.title + ': ' + err.message);
      filmsData.push({ title: film.title, year: film.year, images: [], posterUrl: null, backdropUrl: null, genres: '', runtime: '', director: '', cast: '' });
    }

    await new Promise(function(resolve) { setTimeout(resolve, 300); });
  }

  return filmsData;
}

function buildCarousel(filmData, meta, index) {
  var content = '';

  if (filmData && filmData.images && filmData.images.length > 0) {
    content += '<div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0; padding: 10px 0;">';
    filmData.images.forEach(function(imageUrl, imgIndex) {
      var proxyUrl = '/api/tmdb/proxy-image?url=' + encodeURIComponent(imageUrl);
      // Varier les alt pour le SEO
      var altVariants = [
        meta.altTag,
        meta.title + ' ' + (filmData.year || '') + ' - scene du film',
        meta.title + ' - film a voir comme Inception',
        meta.title + ' ' + (filmData.year || '') + ' - ' + (filmData.genres ? filmData.genres.split(',')[0] : 'film'),
        meta.title + ' - image officielle TMDB',
      ];
      var alt = altVariants[imgIndex % altVariants.length];
      content += '<img src="' + proxyUrl + '" alt="' + alt + '" title="' + meta.title + ' - image ' + (imgIndex + 1) + '" style="height: 280px; width: auto; border-radius: 10px; flex-shrink: 0;" loading="lazy" decoding="async" />';
    });
    content += '</div>';
  } else if (filmData && filmData.posterUrl) {
    var proxyPoster = '/api/tmdb/proxy-image?url=' + encodeURIComponent(filmData.posterUrl);
    content += '<figure class="image image-style-align-center">';
    content += '<img src="' + proxyPoster + '" alt="' + meta.altTag + '" title="' + meta.title + ' (' + (filmData.year || '') + ') - affiche officielle" />';
    content += '<figcaption>' + meta.title + ' (' + (filmData.year || '') + ')' + (filmData.genres ? ' - ' + filmData.genres : '') + '</figcaption>';
    content += '</figure>';
  }

  return content;
}

function generateArticleHTML(filmsData) {
  var content = '';

  // INTRO
  content += '<p>Tu as termine <strong>Inception</strong> et tu regardes le plafond en te demandant quoi regarder ensuite ? Bonne nouvelle : il existe tout un territoire de films qui jouent avec les memes armes — realite manipulee, narration en spirale, fin qui laisse des questions ouvertes.</p>';
  content += '<p>On a volontairement exclu Christopher Nolan de cette liste. L\'idee, c\'est de te faire decouvrir <strong>8 films comme Inception</strong> qui vont te faire reflechir — et parfois te retourner le cerveau — sans rester dans la filmographie du meme realisateur.</p>';
  content += '<p>Certains sont des chefs-d\'oeuvre meconnus, d\'autres des petits films de genre extremement malins. Tous meritent ton attention.</p>';

  // FILMS
  filmsMeta.forEach(function(meta, index) {
    var filmData = filmsData[index];
    var genreDisplay = (filmData && filmData.genres) ? filmData.genres : '';
    var runtimeDisplay = (filmData && filmData.runtime) ? filmData.runtime : '';
    var directorDisplay = (filmData && filmData.director) ? filmData.director : '';
    var castDisplay = (filmData && filmData.cast) ? filmData.cast : '';

    content += '<h2>' + (index + 1) + '. ' + meta.displayTitle + '</h2>';

    content += buildCarousel(filmData, meta, index);

    content += '<ul>';
    if (genreDisplay) content += '<li><strong>Genre :</strong> ' + genreDisplay + '</li>';
    if (runtimeDisplay) content += '<li><strong>Duree :</strong> ' + runtimeDisplay + '</li>';
    if (directorDisplay) content += '<li><strong>Realisateur :</strong> ' + directorDisplay + '</li>';
    if (castDisplay) content += '<li><strong>Casting :</strong> ' + castDisplay + '</li>';
    content += '</ul>';

    content += '<p><strong>Le pitch :</strong> ' + meta.pitch + '</p>';
    content += '<p><strong>Pourquoi c\'est comme Inception :</strong> ' + meta.why + '</p>';
  });

  // SECTION : Points communs
  content += '<h2>Pourquoi ces films ressemblent a Inception ?</h2>';
  content += '<p>Au-dela du genre, ce qui reunit ces 8 films avec Inception, c\'est une approche commune du recit :</p>';
  content += '<ul>';
  content += '<li><strong>Narration non lineaire</strong> — le temps ou la causalite sont manipules, pas subis</li>';
  content += '<li><strong>Realite instable</strong> — ce que le personnage (et le spectateur) percoivent n\'est pas fiable</li>';
  content += '<li><strong>Concepts complexes accessibles</strong> — pas besoin d\'un doctorat pour comprendre, juste de l\'attention</li>';
  content += '<li><strong>Forte rejouabilite</strong> — un second visionnage revele toujours quelque chose de nouveau</li>';
  content += '</ul>';

  // SECTION : Selon ton envie
  content += '<h2>Quel film voir selon ton envie ?</h2>';
  content += '<ul>';
  content += '<li><strong>Coherence</strong> — si tu veux la version minimaliste et intelligente, tournee en une nuit</li>';
  content += '<li><strong>Predestination</strong> — si tu veux le twist le plus fort de cette liste</li>';
  content += '<li><strong>Triangle</strong> — si tu veux un vrai casse-tete narratif qui te hantera</li>';
  content += '<li><strong>The Thirteenth Floor</strong> — si tu veux remonter aux sources du concept de niveaux de realite</li>';
  content += '<li><strong>Timecrimes</strong> — si tu veux le paradoxe temporel le plus logique avec le budget le plus bas</li>';
  content += '</ul>';

  // FAQ SEO
  content += '<h2>FAQ : Films comme Inception</h2>';

  content += '<h3>Quels films ressemblent a Inception sans etre de Christopher Nolan ?</h3>';
  content += '<p><strong>Coherence</strong>, <strong>Predestination</strong> et <strong>Triangle</strong> sont les meilleures alternatives. Ils partagent la meme approche de la realite manipulee et de la narration complexe, avec leurs propres identites visuelles et narratives.</p>';

  content += '<h3>Quel film fait reflechir autant qu\'Inception ?</h3>';
  content += '<p><strong>Timecrimes</strong> et <strong>Enemy</strong> sont parfaits pour ca. Le premier te plonge dans un paradoxe temporel imparable, le second dans une ambiance symbolique et troublante qui reste en tete longtemps apres le generique.</p>';

  content += '<h3>Quel film mind-blowing voir apres Inception ?</h3>';
  content += '<p><strong>The Thirteenth Floor</strong> est le classique sous-estime de la liste : sorti en 1999, il pose deja toutes les questions sur les niveaux de realite qu\'Inception popularisera dix ans plus tard. A voir absolument.</p>';

  content += '<h3>Y a-t-il des films comme Inception disponibles sur Netflix ?</h3>';
  content += '<p><strong>Coherence</strong> et <strong>Predestination</strong> ont ete disponibles sur Netflix selon les periodes et les regions. <strong>Source Code</strong> est egalement accessible sur plusieurs plateformes de VOD.</p>';

  // CONCLUSION
  content += '<h2>En resume</h2>';
  content += '<p>Si tu cherches des films comme Inception, cette liste couvre tout le spectre : du film d\'action intelligent (<strong>Source Code</strong>) au huis clos minimaliste (<strong>Coherence</strong>), en passant par le thriller espagnol ultra-logique (<strong>Timecrimes</strong>) et le classique oublie (<strong>The Thirteenth Floor</strong>).</p>';
  content += '<p>Aucun ne copie Inception. Chacun a sa propre vision, son propre langage. C\'est ca qui en fait une vraie liste — pas juste une liste de "films de SF avec des boucles temporelles".</p>';
  content += '<p>Tu en as vu certains ? Tu en as d\'autres a suggerer ? Dis-nous en commentaire.</p>';

  return content;
}

async function createArticle() {
  console.log('Recuperation des donnees TMDB pour les 8 films...\n');
  var filmsData = await getFilmData();

  console.log('\nResume TMDB:');
  filmsData.forEach(function(f) {
    console.log('  ' + f.title + ': ' + f.images.length + ' images, poster: ' + (f.posterUrl ? 'OK' : 'manquant'));
  });

  var articleContent = generateArticleHTML(filmsData);

  var coverImage = null;
  for (var i = 0; i < filmsData.length; i++) {
    if (filmsData[i].backdropUrl) { coverImage = filmsData[i].backdropUrl; break; }
  }
  if (!coverImage) {
    for (var j = 0; j < filmsData.length; j++) {
      if (filmsData[j].posterUrl) { coverImage = filmsData[j].posterUrl; break; }
    }
  }

  var supabaseArticle = {
    title: '8 Films Comme Inception a Voir Absolument (Hors Nolan)',
    slug: 'films-comme-inception-a-voir-absolument',
    content: articleContent,
    excerpt: 'Tu as adore Inception ? Voici 8 films comme Inception (sans Nolan) qui vont te retourner le cerveau : Source Code, Coherence, Predestination, Triangle, Timecrimes et plus.',
    source_url: '',
    scraped_data: {},
    cover_image: coverImage,
    tags: ['Inception', 'films comme Inception', 'Source Code', 'Coherence', 'Predestination', 'Triangle', 'Timecrimes', 'boucle temporelle', 'realite alternative', 'science-fiction'],
    status: 'draft',
    category: 'list',
    generated_by: 'manual',
    metadata: {
      movieTitle: 'Films comme Inception',
      releaseYear: String(new Date().getFullYear()),
      genre: ['Liste', 'Science-Fiction', 'Thriller', 'Mind-Bending'],
    },
    seo: {
      metaTitle: '8 Films Comme Inception a Voir Absolument (Hors Nolan)',
      metaDescription: 'Tu as adore Inception ? Decouvre 8 films similaires : Source Code, Coherence, Predestination, Triangle, Timecrimes. Realite manipulee, narration complexe, twist final.',
      keywords: ['films comme Inception', 'film similaire Inception', 'Inception alternatives', 'film boucle temporelle', 'film realite alternative', 'Source Code', 'Coherence', 'Predestination', 'Triangle', 'Timecrimes', 'film mind-bending', 'film qui fait reflechir'],
    },
    published_at: new Date().toISOString(),
  };

  try {
    var result = await supabase.from('articles').insert([supabaseArticle]).select().single();
    if (result.error) throw result.error;
    console.log('\nArticle cree avec succes en brouillon!');
    console.log('ID: ' + result.data.id);
    console.log('Slug: ' + supabaseArticle.slug);
    console.log('Cover: ' + coverImage);
  } catch (error) {
    console.error('\nErreur:', error.message || error);
  }
}

createArticle().catch(console.error);
