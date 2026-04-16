require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

const films = [
  { title: 'Love and Monsters',                         year: 2020, imdb: '6.9', genre: 'Aventure, Science-Fiction, Comédie', mood: 'Feel good & aventure', why: 'Fun, attachant et parfaitement calibré pour une soirée sans prise de tête. Dylan O\'Brien traverse un monde post-apocalyptique envahi de créatures géantes — c\'est inventif, rythmé et bourré de charme. <strong>Love and Monsters</strong> est le genre de film Netflix qu\'on lance sans attentes et qu\'on finit avec le sourire.' },
  { title: 'The Fundamentals of Caring',                year: 2016, imdb: '7.3', genre: 'Comédie, Drame',                     mood: 'Feel good & humain',   why: 'Un road trip improbable entre un aidant en reconversion et son patient sarcastique. Simple en apparence, mais <strong>The Fundamentals of Caring</strong> est d\'une justesse rare. Paul Rudd est parfait, et le film ne tombe jamais dans la mièvrerie. L\'un des meilleurs films Netflix méconnus.' },
  { title: 'The Call',                                  year: 2020, imdb: '7.1', genre: 'Thriller, Fantastique',              mood: 'Thriller tendu',       why: 'Deux femmes communiquent par téléphone… mais elles sont séparées de 20 ans. Ce thriller coréen de Netflix est un modèle de tension croissante : chaque échange téléphonique peut tout changer. <strong>The Call</strong> est implacable, inventif et difficile à lâcher.' },
  { title: 'The Night Comes for Us',                    year: 2018, imdb: '7.0', genre: 'Action, Thriller',                   mood: 'Action brutale',       why: 'Un film de gangsters indonésien d\'une violence choréographiée impressionnante. <strong>The Night Comes for Us</strong> est probablement le film d\'action Netflix le plus sous-estimé de ces dernières années. Si tu aimes John Wick pour sa maîtrise du combat filmé, ce film est fait pour toi ce soir.' },
  { title: 'I Don\'t Feel at Home in This World Anymore', year: 2017, imdb: '6.9', genre: 'Comédie, Thriller, Crime',          mood: 'Décalé & original',    why: 'Grand Prix à Sundance, passé totalement inaperçu. Une femme fatiguée du monde décide de reprendre son destin en main après un cambriolage banal — et ça déraille. <strong>I Don\'t Feel at Home in This World Anymore</strong> est bizarre, drôle et surprenant. Un vrai ovni Netflix.' },
  { title: 'Gerald\'s Game',                            year: 2017, imdb: '6.5', genre: 'Horreur, Thriller',                  mood: 'Huis clos psychologique', why: 'Adapté de Stephen King par Mike Flanagan, <strong>Gerald\'s Game</strong> se déroule presque entièrement dans une chambre. Une femme menottée à un lit, seule, qui commence à halluciner. C\'est claustrophobe, intense et psychologiquement dérangeant — bien au-delà du simple film d\'horreur.' },
  { title: 'El practicante',                            year: 2020, imdb: '6.6', genre: 'Thriller',                           mood: 'Thriller dérangeant',  why: 'Un secouriste contrôlant et jaloux devient obsessionnel après un accident qui le laisse paralysé. <strong>The Paramedic</strong> (titre original : El practicante) est un thriller espagnol Netflix oppressant et efficace, avec Mario Casas en forme rare. Difficile de ne pas être mal à l\'aise.' },
  { title: 'The Discovery',                             year: 2017, imdb: '6.3', genre: 'Drame, Science-Fiction, Romance',    mood: 'Réflexion & ambiance', why: 'Et si la preuve scientifique de l\'au-delà déclenchait une vague de suicides à travers le monde ? <strong>The Discovery</strong> pose une question vertigineuse et y répond avec une mise en scène froide, mélancolique et un casting solide (Robert Redford, Jason Segel). Un film Netflix qui prend son temps et marque les esprits.' },
  { title: 'The Siege of Jadotville',                   year: 2016, imdb: '7.2', genre: 'Guerre, Action, Drame',              mood: 'Guerre & tension',     why: 'En 1961, 155 soldats irlandais de l\'ONU tiennent tête à 3 000 mercenaires au Congo. Basé sur des faits réels et longtemps ignoré par l\'histoire officielle. <strong>The Siege of Jadotville</strong> est tendu, bien réalisé et rend hommage à des hommes dont le courage n\'a jamais été reconnu.' },
  { title: 'Cargo',                                     year: 2017, imdb: '6.3', genre: 'Drame, Horreur, Aventure',           mood: 'Touchant & différent',  why: 'Dans un outback australien ravagé par une épidémie zombie, un père infecté a 48 heures pour trouver un foyer à son bébé. <strong>Cargo</strong> n\'est pas un film de zombies ordinaire — c\'est un film sur la parentalité, le sacrifice et l\'amour. Avec Martin Freeman, sobre et bouleversant.' },
];

async function searchTmdb(title, year) {
  try {
    console.log('  Recherche TMDB: "' + title + '" (' + year + ')');
    var r = await axios.get(TMDB_BASE + '/search/movie', {
      params: { api_key: TMDB_KEY, query: title, year: year, language: 'fr-FR', include_adult: false }
    });
    if (r.data.results && r.data.results.length > 0) {
      var m = r.data.results[0];
      console.log('  OK: ' + m.title + ' (id=' + m.id + ')');
      return m;
    }
    // retry sans année
    var r2 = await axios.get(TMDB_BASE + '/search/movie', {
      params: { api_key: TMDB_KEY, query: title, language: 'fr-FR', include_adult: false }
    });
    if (r2.data.results && r2.data.results.length > 0) {
      var m2 = r2.data.results[0];
      console.log('  OK (sans année): ' + m2.title + ' (id=' + m2.id + ')');
      return m2;
    }
    console.log('  AUCUN résultat pour "' + title + '"');
    return null;
  } catch (e) {
    console.error('  Erreur TMDB search: ' + e.message);
    return null;
  }
}

async function getDetails(id) {
  try {
    var r = await axios.get(TMDB_BASE + '/movie/' + id, {
      params: { api_key: TMDB_KEY, language: 'fr-FR', append_to_response: 'credits' }
    });
    return r.data;
  } catch (e) { return null; }
}

async function getVariedImages(id, title) {
  try {
    var r = await axios.get(TMDB_BASE + '/movie/' + id + '/images', {
      params: { api_key: TMDB_KEY, include_image_language: 'en,null' }
    });
    var backdrops = r.data.backdrops || [];
    var posters   = r.data.posters   || [];

    // Dédoublonner et espacer les backdrops
    var seen = {};
    var filtered = backdrops.filter(function(b) {
      if (seen[b.file_path]) return false;
      seen[b.file_path] = true;
      return true;
    });

    var picked = [];
    if (filtered.length >= 6) {
      var step = Math.floor(filtered.length / 3);
      picked = [filtered[0], filtered[step], filtered[step * 2]];
    } else {
      picked = filtered.slice(0, 3);
    }

    var images = picked.map(function(b) { return IMG_BASE + '/original' + b.file_path; });
    posters.slice(0, 2).forEach(function(p) { images.push(IMG_BASE + '/w500' + p.file_path); });

    console.log('  ' + title + ': ' + images.length + ' images');
    return images;
  } catch (e) {
    console.error('  Erreur images ' + title + ': ' + e.message);
    return [];
  }
}

function buildCarousel(images, film, index) {
  if (!images || images.length === 0) return '';
  var altVariants = [
    film.title + ' ' + film.year + ' - film Netflix à voir ce soir',
    film.title + ' ' + film.year + ' - ' + film.genre.split(',')[0].trim().toLowerCase() + ' Netflix',
    film.title + ' ' + film.year + ' - film Netflix bien noté',
    film.title + ' - affiche officielle Netflix ' + film.year,
    film.title + ' - scène du film Netflix',
  ];

  var html = '<div class="film-carousel" style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; overflow-x: auto; overflow-y: hidden; margin: 20px 0; padding: 10px 0;">';
  images.forEach(function(url, i) {
    var proxy = '/api/tmdb/proxy-image?url=' + encodeURIComponent(url);
    html += '<img src="' + proxy + '" alt="' + altVariants[i % altVariants.length] + '" title="' + film.title + ' - image ' + (i + 1) + '" style="height: 280px; width: auto; border-radius: 10px; flex-shrink: 0; display: block;" loading="lazy" decoding="async" />';
  });
  html += '</div>';
  return html;
}

function buildFilmSection(film, index, details, images) {
  var director = '';
  var cast = '';
  if (details && details.credits) {
    var directorObj = (details.credits.crew || []).find(function(c) { return c.job === 'Director'; });
    if (directorObj) director = directorObj.name;
    cast = (details.credits.cast || []).slice(0, 3).map(function(a) { return a.name; }).join(', ');
  }
  var runtime = details ? details.runtime : null;
  var synopsis = details ? (details.overview || '') : '';

  var html = '';
  html += '<h2>' + index + '. ' + film.title + ' (' + film.year + ') : ' + film.mood + '</h2>';
  html += buildCarousel(images, film, index);
  html += '<ul>';
  html += '<li><strong>Genre :</strong> ' + film.genre + '</li>';
  if (runtime) html += '<li><strong>Durée :</strong> ' + runtime + ' min</li>';
  if (director) html += '<li><strong>Réalisateur :</strong> ' + director + '</li>';
  if (cast) html += '<li><strong>Casting :</strong> ' + cast + '</li>';
  html += '<li><strong>Note IMDb :</strong> ' + film.imdb + '/10</li>';
  html += '</ul>';
  if (synopsis) html += '<p><strong>Le pitch :</strong> ' + synopsis + '</p>';
  html += '<p><strong>Pourquoi ce soir :</strong> ' + film.why + '</p>';
  return html;
}

async function main() {
  console.log('Récupération des données TMDB pour les 10 films...\n');

  var filmsData = [];
  for (var i = 0; i < films.length; i++) {
    var film = films[i];
    var tmdb = await searchTmdb(film.title, film.year);
    var details = null;
    var images = [];
    if (tmdb) {
      details = await getDetails(tmdb.id);
      images = await getVariedImages(tmdb.id, film.title);
    }
    filmsData.push({ film: film, tmdb: tmdb, details: details, images: images });
    await new Promise(function(r) { setTimeout(r, 350); });
  }

  // Construire le HTML
  var content = '';

  // Intro
  content += '<p>Tu ouvres Netflix et tu passes dix minutes à faire défiler les miniatures sans rien choisir ? On connaît. Cette liste de <strong>10 films Netflix à voir ce soir</strong> règle le problème : des films bien notés, efficaces, et surtout moins évidents que les habituels suspects.</p>';
  content += '<p>Pas de films survus ici. Que tu aies envie de rire, frissonner, réfléchir ou juste regarder de l\'action bien faite — il y en a pour tout le monde. Et tous sont (ou ont été) disponibles sur <strong>Netflix</strong>.</p>';
  content += '<p>Voici notre sélection <strong>films Netflix à voir ce soir</strong> — édition 2026.</p>';

  // Sections films
  filmsData.forEach(function(fd, i) {
    content += buildFilmSection(fd.film, i + 1, fd.details, fd.images);
  });

  // Section "Selon ton humeur"
  content += '<h2>Quel film Netflix choisir selon ton humeur ce soir ?</h2>';
  content += '<p>Difficile de choisir parmi ces <strong>films Netflix à voir ce soir</strong> ? Voici un guide rapide :</p>';
  content += '<ul>';
  content += '<li><strong>Tu veux du feel good et de l\'aventure</strong> → <strong>Love and Monsters</strong> (2020). Parfait pour se détendre.</li>';
  content += '<li><strong>Tu veux rire et être touché en même temps</strong> → <strong>The Fundamentals of Caring</strong> (2016). Un road trip humain et drôle.</li>';
  content += '<li><strong>Tu veux du thriller tendu et intelligent</strong> → <strong>The Call</strong> (2020). Deux époques, un téléphone, une tension implacable.</li>';
  content += '<li><strong>Tu veux de l\'action ultra maîtrisée</strong> → <strong>The Night Comes for Us</strong> (2018). Le film d\'action Netflix le plus sous-estimé.</li>';
  content += '<li><strong>Tu veux quelque chose d\'original et décalé</strong> → <strong>I Don\'t Feel at Home in This World Anymore</strong> (2017). Un ovni primé à Sundance.</li>';
  content += '<li><strong>Tu veux un huis clos psychologique</strong> → <strong>Gerald\'s Game</strong> (2017). Stephen King adapté par Mike Flanagan — efficace.</li>';
  content += '<li><strong>Tu veux réfléchir avec une ambiance froide</strong> → <strong>The Discovery</strong> (2017). Un film qui pose des grandes questions.</li>';
  content += '<li><strong>Tu veux un film de guerre basé sur des faits réels</strong> → <strong>The Siege of Jadotville</strong> (2016). Tendu et méconnu.</li>';
  content += '<li><strong>Tu veux être touché et sortir du lot</strong> → <strong>Cargo</strong> (2017). Un zombie movie qui parle de parentalité.</li>';
  content += '</ul>';
  content += '<p>Ces films Netflix à voir ce soir couvrent tous les genres et tous les niveaux d\'intensité. Le seul critère commun : ils méritent tous bien plus d\'attention qu\'ils n\'en ont reçu.</p>';

  // Conclusion
  content += '<h2>En résumé : pourquoi ces films Netflix ?</h2>';
  content += '<p>Les algorithmes Netflix poussent toujours les mêmes contenus. Cette liste existe pour contrebalancer ça. Chaque film ici a une vraie identité — un scénario construit, une mise en scène qui respecte le spectateur, et un point de vue.</p>';
  content += '<p>Ce n\'est pas une liste de films à grand spectacle. C\'est une liste de <strong>films Netflix bien notés et sous-estimés</strong> qui méritent d\'être vus ce soir plutôt que de noisette en noisette sur l\'interface.</p>';
  content += '<p>Tu en as vu certains ? Tu as d\'autres suggestions de films Netflix méconnus ? Dis-nous en commentaire.</p>';

  // FAQ — 5 questions minimum
  content += '<h2>FAQ : Films Netflix à voir ce soir</h2>';
  content += '<h3>Quel bon film Netflix regarder ce soir ?</h3>';
  content += '<p><strong>The Call</strong> (2020) et <strong>The Siege of Jadotville</strong> (2016) sont d\'excellents choix tous genres confondus. Le premier pour le thriller tendu, le second pour le film de guerre basé sur des faits réels. Les deux sont peu connus et très efficaces.</p>';
  content += '<h3>Quel film Netflix bien noté et peu connu ?</h3>';
  content += '<p><strong>I Don\'t Feel at Home in This World Anymore</strong> (2017) est une vraie pépite — Grand Prix du jury à Sundance, passé complètement sous les radars. <strong>The Fundamentals of Caring</strong> (7.3 sur IMDb) est également largement méconnu malgré sa qualité.</p>';
  content += '<h3>Quel film Netflix original à voir absolument ?</h3>';
  content += '<p><strong>Cargo</strong> (2017) et <strong>The Discovery</strong> (2017) sortent vraiment du lot. L\'un réinvente le film de zombies en récit sur la parentalité. L\'autre explore philosophiquement les conséquences de la preuve de l\'au-delà. Les deux sont des productions Netflix peu mises en avant.</p>';
  content += '<h3>Quel film Netflix d\'action voir ce soir ?</h3>';
  content += '<p><strong>The Night Comes for Us</strong> (2018) est la réponse. Ce film d\'action indonésien est chorégraphié avec une précision proche de John Wick, avec une brutalité assumée. Probablement le meilleur film d\'action disponible sur Netflix dont tu n\'as jamais entendu parler.</p>';
  content += '<h3>Quel film Netflix regarder quand on ne sait pas quoi choisir ?</h3>';
  content += '<p>Lance <strong>Love and Monsters</strong> (2020) — fun, aventureux, et efficace en toutes circonstances. Ou <strong>The Fundamentals of Caring</strong> si tu veux quelque chose de plus humain et posé. Les deux fonctionnent parfaitement pour une soirée sans prise de tête.</p>';

  // Récupérer la cover image (backdrop du 1er film trouvé)
  var coverImage = '';
  for (var j = 0; j < filmsData.length; j++) {
    if (filmsData[j].tmdb && filmsData[j].tmdb.backdrop_path) {
      coverImage = IMG_BASE + '/original' + filmsData[j].tmdb.backdrop_path;
      break;
    }
  }

  var wordCount = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(function(w) { return w.length > 0; }).length;
  console.log('\nMots dans l\'article: ' + wordCount);

  var article = {
    title: '10 Films Netflix à Voir Ce Soir : Sélection 2026',
    slug: '10-films-netflix-a-voir-ce-soir-2026',
    content: content,
    excerpt: 'Tu ouvres Netflix et tu ne sais pas quoi regarder ? Voici 10 films Netflix à voir ce soir : bien notés, efficaces et moins évidents que les habituels. Sélection 2026.',
    cover_image: coverImage,
    tags: ['Netflix', 'films Netflix', 'film à voir ce soir', 'Love and Monsters', 'The Call', 'Cargo', 'Gerald\'s Game', 'film action Netflix', 'thriller Netflix', 'film Netflix méconnu'],
    status: 'published',
    category: 'list',
    generated_by: 'manual',
    source_url: '',
    scraped_data: {},
    metadata: {
      movieTitle: 'Films Netflix à voir ce soir',
      releaseYear: '2026',
      genre: ['Action', 'Thriller', 'Drame', 'Comédie', 'Science-Fiction'],
    },
    seo: {
      metaTitle: '10 Films Netflix à Voir Ce Soir (Sélection 2026)',
      metaDescription: 'Que regarder sur Netflix ce soir ? 10 films bien notés et méconnus : The Call, Love and Monsters, Cargo, Gerald\'s Game, The Siege of Jadotville et plus.',
      keywords: [
        'films Netflix à voir ce soir',
        'que regarder sur Netflix',
        'meilleur film Netflix',
        'film Netflix méconnu',
        'film Netflix bien noté',
        'film Netflix 2026',
        'The Call Netflix',
        'Love and Monsters Netflix',
        'Cargo Netflix',
        'film action Netflix',
        'thriller Netflix sous-coté',
        'que voir sur Netflix ce soir',
      ],
    },
    published_at: new Date().toISOString(),
  };

  console.log('metaDesc len: ' + article.seo.metaDescription.length);
  console.log('excerpt len : ' + article.excerpt.length);

  var result = await supabase
    .from('articles')
    .insert([article])
    .select('id, slug, title')
    .single();

  if (result.error) {
    console.error('Erreur insertion Supabase:', result.error);
    return;
  }

  console.log('\nArticle publié avec succès!');
  console.log('ID   : ' + result.data.id);
  console.log('Slug : ' + result.data.slug);
  console.log('Titre: ' + result.data.title);
  console.log('URL  : https://www.moviehunt-blog.fr/article/' + result.data.slug);
}

main().catch(console.error);
