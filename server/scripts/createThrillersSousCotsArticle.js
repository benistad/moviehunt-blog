require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const tmdbService = require('../services/tmdbService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const films = [
  { title: 'Calibre', year: 2018 },
  { title: 'The Gift', year: 2015 },
  { title: 'Hush', year: 2016 },
  { title: 'Coherence', year: 2013 },
  { title: 'The Invitation', year: 2015 },
  { title: 'Green Room', year: 2015 },
  { title: 'El cuerpo del delito', year: 2016, tmdbFallback: true },
  { title: "Gerald's Game", year: 2017 },
  { title: 'Exam', year: 2009 },
  { title: 'Before I Go to Sleep', year: 2014 },
];

async function getFilmData() {
  const filmsData = [];

  for (const film of films) {
    console.log('\n Recherche TMDB: ' + film.title + ' (' + film.year + ')');

    try {
      const movieData = await tmdbService.searchMovie(film.title, film.year);

      if (movieData) {
        const images = await tmdbService.getMovieImages(movieData.id, 8);
        const details = await tmdbService.getMovieDetails(movieData.id);

        const genres = (details && details.genres) ? details.genres.map(function(g) { return g.name; }).join(', ') : '';
        const runtime = (details && details.runtime) ? details.runtime + ' min' : '';
        const director = (details && details.credits && details.credits.crew)
          ? (details.credits.crew.find(function(p) { return p.job === 'Director'; }) || {}).name || ''
          : '';
        const cast = (details && details.credits && details.credits.cast)
          ? details.credits.cast.slice(0, 3).map(function(a) { return a.name; }).join(', ')
          : '';

        const posterUrl = movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : null;
        const backdropUrl = movieData.backdrop_path ? 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path : null;

        filmsData.push({
          title: film.title,
          year: film.year,
          tmdbId: movieData.id,
          posterUrl: posterUrl,
          backdropUrl: backdropUrl,
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

const properFilmsMeta = [
  {
    title: 'Calibre',
    displayTitle: 'Calibre (2018) : La tension a l\'etat brut',
    pitch: 'Deux amis partent pour un week-end de chasse dans les Highlands ecossais. Un coup de feu accidentel, et leur vie bascule dans un cauchemar sans retour.',
    why: '<strong>Calibre</strong> est une bombe a retardement. Pas d\'action spectaculaire, pas d\'effets speciaux : juste deux hommes coinces dans un village rural, paralyses par la culpabilite et la peur. La tension est constante, presque insoutenable. C\'est le genre de film qui te reste dans la tete longtemps apres le generique.',
    altTag: 'Calibre 2018 - thriller ecossais sous-estime',
  },
  {
    title: 'The Gift',
    displayTitle: 'The Gift (2015) : Mefie-toi du passe',
    pitch: 'Un couple s\'installe dans une nouvelle ville. Un ancien camarade de lycee reapparait dans leur vie, et son comportement etrange va faire remonter de vieux secrets.',
    why: '<strong>The Gift</strong>, c\'est Joel Edgerton en mode triple menace : realisateur, scenariste et acteur principal. Le film joue brillamment sur l\'ambiguite - tu ne sais jamais vraiment qui est le monstre - jusqu\'a un retournement final devastateur.',
    altTag: 'The Gift 2015 - thriller psychologique Joel Edgerton',
  },
  {
    title: 'Hush',
    displayTitle: 'Hush (2016) : Le silence qui tue',
    pitch: 'Maddie, une romanciere sourde et muette, vit seule dans une maison isolee en foret. Un soir, un tueur masque frappe a sa fenetre.',
    why: 'Ce que Mike Flanagan reussit avec <strong>Hush</strong>, c\'est de transformer un concept minimaliste en seance d\'angoisse pure. Le fait que l\'heroine soit sourde renverse les codes du genre : pas de cri, pas d\'appel au secours. Juste l\'ingeniosite contre la brutalite.',
    altTag: 'Hush 2016 - thriller heroine sourde Netflix',
  },
  {
    title: 'Coherence',
    displayTitle: 'Coherence (2013) : La soiree qui bifurque',
    pitch: 'Une comete passe au-dessus d\'une soiree entre amis. L\'electricite coupe. Et la realite, progressivement, commence a se fracturer.',
    why: '<strong>Coherence</strong> a ete tourne en une nuit, avec 50 000 dollars, sans script complet. Le resultat est siderant : un thriller de SF qui te fait douter de tout, construit sur l\'improvisation et l\'intelligence. Preuve qu\'une idee solide vaut mieux que n\'importe quel budget.',
    altTag: 'Coherence 2013 - thriller science-fiction minimaliste',
  },
  {
    title: 'The Invitation',
    displayTitle: 'The Invitation (2015) : Un diner qui derange',
    pitch: 'Will accepte l\'invitation de son ex-femme pour un diner dans leur ancienne maison. Tout semble normal... sauf que l\'atmosphere devient de plus en plus pesante.',
    why: 'La force de <strong>The Invitation</strong>, c\'est sa patience. Karyn Kusama prend le temps d\'installer un malaise diffus, presque imperceptible, avant de tout faire basculer. Tu passes le film a douter avec Will : est-il paranoiaque, ou a-t-il raison ? La reponse, quand elle vient, est marquante.',
    altTag: 'The Invitation 2015 - thriller ambiance diner angoissant',
  },
  {
    title: 'Green Room',
    displayTitle: 'Green Room (2015) : Pieges sans issue',
    pitch: 'Un groupe de punk-rock joue dans un bar neo-nazi isole. Ils tombent par hasard sur un meurtre. Des lors, la seule issue est de survivre.',
    why: '<strong>Green Room</strong> est brut, violent, sans une seconde de repit. Jeremy Saulnier transforme un huis clos en machine de guerre. Patrick Stewart en chef de gang implacable est l\'une des surprises de casting les plus efficaces de la decennie.',
    altTag: 'Green Room 2015 - thriller survie Patrick Stewart',
  },
  {
    title: 'The Invisible Guest',
    displayTitle: 'The Invisible Guest (2016) : Le scenario en beton',
    pitch: 'Un homme d\'affaires se retrouve accuse du meurtre de sa maitresse. Il engage une avocate pour preparer sa defense. Et plus ils creusent, plus la verite se complique.',
    why: 'Oriol Paulo signe avec <strong>The Invisible Guest</strong> (Contralovers en espagnol) un thriller a tiroirs d\'une precision chirurgicale. Chaque revelation en cache une autre. C\'est le genre de film qu\'on voit rarement venir, et qui donne envie de le revoir immediatement.',
    altTag: 'The Invisible Guest 2016 - thriller espagnol retournements',
  },
  {
    title: "Gerald's Game",
    displayTitle: "Gerald's Game (2017) : Seule avec ses demons",
    pitch: 'Jessie et son mari partent en week-end dans un chalet isole. Son mari meurt d\'une crise cardiaque et elle se retrouve menottee au lit, seule, sans telephone, sans secours possible.',
    why: 'Mike Flanagan adapte un roman de Stephen King repute inadaptable - et il y parvient brillamment. <strong>Gerald\'s Game</strong> vit dans la tete de son heroine autant que dans la piece ou elle est coincee. Un huis clos etouffant sur le trauma, la survie et la resilience.',
    altTag: "Gerald's Game 2017 - Stephen King huis clos Netflix",
  },
  {
    title: 'Exam',
    displayTitle: 'Exam (2009) : La salle ou tout peut arriver',
    pitch: 'Huit candidats sont convoques pour le dernier entretien du poste le plus convoite du monde. Une feuille, un stylo, une seule consigne. A partir de la, tout derape.',
    why: '<strong>Exam</strong> est un tour de force avec trois fois rien. Une salle, huit acteurs, un concept. Le film explore ce que la competition et la pression font aux humains : alliances, trahisons, paranoia. Efficace du debut a la fin.',
    altTag: 'Exam 2009 - thriller huis clos recrutement',
  },
  {
    title: 'Before I Go to Sleep',
    displayTitle: 'Before I Go to Sleep (2014) : La memoire en miettes',
    pitch: 'Christine se reveille chaque matin sans aucun souvenir de sa vie passee. Un medecin lui conseille de tenir un journal video. Ce qu\'elle y decouvre va tout remettre en question.',
    why: 'Nicole Kidman est excellente dans ce thriller cerebral qui joue sur la memoire et la confiance. <strong>Before I Go to Sleep</strong> est solide, efficacement construit, et son twist final delivre. Le genre de film qu\'on regarde d\'une traite.',
    altTag: 'Before I Go to Sleep 2014 - thriller memoire Nicole Kidman',
  },
];

function buildCarousel(filmData, meta, index) {
  var content = '';

  if (filmData && filmData.images && filmData.images.length > 0) {
    content += '<div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0; padding: 10px 0;">';
    filmData.images.forEach(function(imageUrl, imgIndex) {
      var proxyUrl = '/api/tmdb/proxy-image?url=' + encodeURIComponent(imageUrl);
      content += '<img src="' + proxyUrl + '" alt="' + meta.altTag + '" title="' + meta.title + ' - image ' + (imgIndex + 1) + '" style="height: 280px; width: auto; border-radius: 10px; flex-shrink: 0;" loading="lazy" decoding="async" />';
    });
    content += '</div>';
  } else if (filmData && filmData.posterUrl) {
    var proxyPoster = '/api/tmdb/proxy-image?url=' + encodeURIComponent(filmData.posterUrl);
    var yr = (filmData && filmData.year) ? filmData.year : '';
    var gn = (filmData && filmData.genres) ? filmData.genres : '';
    content += '<figure class="image image-style-align-center">';
    content += '<img src="' + proxyPoster + '" alt="' + meta.altTag + '" title="' + meta.title + ' - affiche officielle" />';
    content += '<figcaption>' + meta.title + ' (' + yr + ') - ' + gn + '</figcaption>';
    content += '</figure>';
  }

  return content;
}

function generateArticleHTML(filmsData) {
  var content = '';

  content += '<p>Tu cherches un bon thriller... mais tu tombes toujours sur les memes titres ? Les listes habituelles ressortent eternellement <em>Gone Girl</em>, <em>Shutter Island</em> ou <em>Seven</em>. C\'est bien, mais on connait.</p>';
  content += '<p>Ce qu\'on te propose ici, c\'est autre chose : <strong>10 thrillers sous-cotes</strong> qui meritent largement plus d\'attention. Pas de blockbusters, pas de casting cinq etoiles imposes par un studio. Juste des films efficaces, tendus, et souvent oublies au fond des catalogues.</p>';
  content += '<p>Si tu en cherches un pour ce soir, tu es au bon endroit.</p>';

  properFilmsMeta.forEach(function(meta, index) {
    var filmData = filmsData[index];
    var genreDisplay = (filmData && filmData.genres && filmData.genres.length > 0) ? filmData.genres : '';
    var castDisplay = (filmData && filmData.cast && filmData.cast.length > 0) ? filmData.cast : '';
    var directorDisplay = (filmData && filmData.director && filmData.director.length > 0) ? filmData.director : '';
    var runtimeDisplay = (filmData && filmData.runtime && filmData.runtime.length > 0) ? filmData.runtime : '';

    content += '<h2>' + (index + 1) + '. ' + meta.displayTitle + '</h2>';

    content += buildCarousel(filmData, meta, index);

    content += '<ul>';
    if (genreDisplay) content += '<li><strong>Genre :</strong> ' + genreDisplay + '</li>';
    if (runtimeDisplay) content += '<li><strong>Duree :</strong> ' + runtimeDisplay + '</li>';
    if (directorDisplay) content += '<li><strong>Realisateur :</strong> ' + directorDisplay + '</li>';
    if (castDisplay) content += '<li><strong>Casting :</strong> ' + castDisplay + '</li>';
    content += '</ul>';

    content += '<p><strong>Le pitch :</strong> ' + meta.pitch + '</p>';
    content += '<p><strong>Pourquoi ca vaut le detour :</strong> ' + meta.why + '</p>';
  });

  content += '<h2>En resume : les thrillers efficaces n\'ont pas besoin d\'etre connus</h2>';
  content += '<p>Ces 10 films partagent un point commun : ils ne comptent pas sur leur reputation pour te tenir en haleine. Pas de nom bankable, pas de budget colossal - juste un concept solide et une execution qui tient ses promesses.</p>';
  content += '<p>Si tu ne devais en retenir que trois pour ce soir :</p>';
  content += '<ul>';
  content += '<li><strong>Coherence</strong> si tu veux reflechir</li>';
  content += '<li><strong>Calibre</strong> si tu veux du stress pur</li>';
  content += '<li><strong>The Invitation</strong> si tu aimes les ambiances derangeantes</li>';
  content += '</ul>';
  content += '<p>Et si tu en vois un que tu avais loupe : viens nous dire ce que tu en as pense.</p>';

  content += '<h2>FAQ : Thrillers sous-estimes a voir absolument</h2>';
  content += '<h3>Ou regarder ces thrillers sous-cotes ?</h3>';
  content += '<p>La plupart sont disponibles sur Netflix, Amazon Prime Video ou en VOD. <strong>Coherence</strong>, <strong>Hush</strong> et <strong>Gerald\'s Game</strong> sont notamment sur Netflix. <strong>The Invisible Guest</strong> est disponible sur plusieurs plateformes de VOD.</p>';
  content += '<h3>Quel est le meilleur thriller sous-estime de cette liste ?</h3>';
  content += '<p><strong>Coherence</strong> est souvent cite comme le plus impressionnant compte tenu de son budget derisoire. <strong>The Invisible Guest</strong> est le plus malin niveau scenario. Et <strong>Calibre</strong> est probablement le plus efficacement angoissant.</p>';
  content += '<h3>Ces films sont-ils adaptes a tout le monde ?</h3>';
  content += '<p><strong>Green Room</strong> est violent et deconseille aux ames sensibles. Les autres sont accessibles, avec des niveaux de tension variables. <strong>Coherence</strong> et <strong>Exam</strong> sont les plus cerebraux et les moins graphiques.</p>';

  return content;
}

async function createArticle() {
  console.log('Recuperation des donnees TMDB pour les 10 thrillers...\n');
  var filmsData = await getFilmData();

  console.log('\nResume TMDB:');
  filmsData.forEach(function(f) {
    console.log('  ' + f.title + ': ' + f.images.length + ' images, poster: ' + (f.posterUrl ? 'OK' : 'manquant'));
  });

  var articleContent = generateArticleHTML(filmsData);
  var coverImage = filmsData[0] && filmsData[0].backdropUrl ? filmsData[0].backdropUrl
    : (filmsData[0] && filmsData[0].posterUrl ? filmsData[0].posterUrl
    : (filmsData[1] && filmsData[1].backdropUrl ? filmsData[1].backdropUrl : null));

  var article = {
    title: '10 Thrillers Sous-Cotes a Voir Absolument',
    slug: '10-thrillers-sous-cotes-a-voir-absolument',
    excerpt: 'Tu cherches un bon thriller mais tu tombes toujours sur les memes titres ? Voici 10 thrillers sous-estimes, efficaces et oublies, qui meritent largement plus d\'attention.',
    content: articleContent,
    category: 'list',
    tags: ['thriller', 'films sous-cotes', 'Coherence', 'Calibre', 'The Invitation', 'huis clos', 'tension', 'recommandations'],
    status: 'draft',
    coverImage: coverImage,
    metadata: {
      movieTitle: '10 Thrillers Sous-Cotes',
      releaseYear: '2026',
      genre: ['Liste', 'Thriller', 'Recommandations'],
    },
    seo: {
      metaTitle: '10 Thrillers Sous-Cotes a Voir Absolument',
      metaDescription: '10 thrillers sous-estimes qui meritent votre attention : Calibre, Coherence, The Gift, Hush, Green Room et bien d\'autres. Notre selection des films oublies mais redoutables.',
      keywords: ['thrillers sous-cotes', 'thriller meconnu', 'Coherence film', 'Calibre 2018', 'The Invisible Guest', 'films thriller a voir', 'meilleur thriller independant', 'Hush Netflix', 'Green Room film'],
    },
  };

  var supabaseArticle = {
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    source_url: '',
    scraped_data: {},
    cover_image: article.coverImage,
    tags: article.tags,
    status: article.status,
    category: article.category,
    generated_by: 'manual',
    metadata: article.metadata || {},
    seo: article.seo || {},
    published_at: new Date().toISOString(),
  };

  try {
    var result = await supabase.from('articles').insert([supabaseArticle]).select().single();
    if (result.error) throw result.error;
    console.log('\nArticle cree avec succes en brouillon!');
    console.log('ID: ' + result.data.id);
    console.log('Slug: ' + article.slug);
    console.log('Cover: ' + coverImage);
    console.log('URL: https://www.moviehunt-blog.fr/article/' + article.slug);
  } catch (error) {
    console.error('\nErreur lors de la creation de l\'article:', error.message || error);
  }
}

createArticle().catch(console.error);
