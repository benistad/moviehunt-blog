require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const tmdbService = require('../services/tmdbService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 4 films principaux (carousel + détail) + 6 films secondaires (mention courte)
const mainFilms = [
  { title: 'The Fundamentals of Caring', year: 2016, mood: 'feel_good' },
  { title: 'The Call', year: 2020, mood: 'suspense' },
  { title: 'Coherence', year: 2013, mood: 'cerebral' },
  { title: 'Cargo', year: 2017, mood: 'emotion' },
];

const secondaryFilms = [
  { title: 'Wheelman', year: 2017, category: 'rythme' },
  { title: 'Extraction', year: 2020, category: 'rythme' },
  { title: 'Predestination', year: 2014, category: 'reflexion' },
  { title: 'The Discovery', year: 2017, category: 'reflexion' },
  { title: "Gerald's Game", year: 2017, category: 'derangeant' },
  { title: 'The Invitation', year: 2015, category: 'derangeant' },
];

async function fetchFilmFull(film) {
  console.log('\nTMDB: ' + film.title + ' (' + film.year + ')');
  try {
    const movieData = await tmdbService.searchMovie(film.title, film.year);
    if (!movieData) return Object.assign({}, film, { images: [], posterUrl: null, backdropUrl: null, genres: '', runtime: '', director: '', cast: '', overview: '' });

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
    const overview = (details && details.overview) ? details.overview : '';

    const posterUrl = movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : null;
    const backdropUrl = movieData.backdrop_path ? 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path : null;

    console.log('  OK - ' + images.length + ' images, ' + genres);
    return Object.assign({}, film, {
      tmdbId: movieData.id,
      posterUrl: posterUrl,
      backdropUrl: backdropUrl,
      images: images.slice(0, 5),
      genres: genres,
      runtime: runtime,
      director: director,
      cast: cast,
      overview: overview,
    });
  } catch (err) {
    console.warn('  Erreur: ' + err.message);
    return Object.assign({}, film, { images: [], posterUrl: null, backdropUrl: null, genres: '', runtime: '', director: '', cast: '', overview: '' });
  }
}

async function fetchAll() {
  const main = [];
  for (const f of mainFilms) {
    main.push(await fetchFilmFull(f));
    await new Promise(function(r) { setTimeout(r, 300); });
  }
  const secondary = [];
  for (const f of secondaryFilms) {
    secondary.push(await fetchFilmFull(f));
    await new Promise(function(r) { setTimeout(r, 300); });
  }
  return { main: main, secondary: secondary };
}

const editorial = {
  'The Fundamentals of Caring': {
    moodLabel: 'Film feel good à voir ce soir',
    moodEmoji: '😄',
    moodColor: '#10b981',
    altKeyword: 'film feel good à voir ce soir',
    pitch: "Ben, écrivain en deuil, se reconvertit en aide-soignant pour Trevor, un adolescent en fauteuil roulant. Ils partent ensemble sur la route, et leur road-trip improbable va tout changer.",
    why: "<strong>The Fundamentals of Caring</strong> est exactement le genre de film qu'il te faut un soir où tu n'as l'énergie de rien. Paul Rudd y est touchant sans en faire trop, l'écriture est tendre sans être mièvre, et tu ressors avec le sourire. C'est un feel good intelligent — pas une comédie débile, juste un film qui fait du bien.",
    bestFor: "Une soirée fatigante après le boulot, un dimanche pluvieux, une envie d'humanité simple.",
  },
  'The Call': {
    moodLabel: 'Film à suspense pour ce soir',
    moodEmoji: '😱',
    moodColor: '#dc2626',
    altKeyword: 'film à suspense ce soir Netflix',
    pitch: "Une jeune femme reçoit un appel d'une inconnue qui prétend l'appeler depuis le passé — depuis sa propre maison, vingt ans plus tôt. Le lien va virer au cauchemar.",
    why: "Ce <strong>The Call</strong> coréen (à ne pas confondre avec celui avec Halle Berry) est une bombe de tension. Le concept téléphone-entre-deux-époques aurait pu être casse-gueule, mais le film en tire un thriller psychologique implacable. <strong>Park Shin-hye</strong> face à <strong>Jeon Jong-seo</strong> : duel d'actrices mémorable. Disponible sur Netflix.",
    bestFor: "Une soirée où tu veux serrer ton coussin, pas dormir tout de suite, et avoir un truc à raconter le lendemain.",
  },
  'Coherence': {
    moodLabel: 'Film intelligent à voir ce soir',
    moodEmoji: '🧠',
    moodColor: '#7c3aed',
    altKeyword: 'film intelligent à voir ce soir',
    pitch: "Huit amis dînent ensemble le soir où une comète passe au-dessus de la ville. Une coupure d'électricité plus tard, leur réalité se met à se dédoubler — et eux avec.",
    why: "<strong>Coherence</strong> a été tourné en cinq jours, dans une seule maison, avec un budget ridicule. C'est aussi l'un des meilleurs films de SF cérébrale des dix dernières années. Pas d'effets spéciaux : juste une idée vertigineuse, sept acteurs et un dîner qui dérape. Tu y penseras encore trois jours plus tard.",
    bestFor: "Une soirée où tu veux te faire surprendre intellectuellement — seul ou avec quelqu'un qui aime débriefer.",
  },
  'Cargo': {
    moodLabel: 'Film touchant pour ce soir',
    moodEmoji: '💔',
    moodColor: '#ec4899',
    altKeyword: 'film touchant ce soir Netflix',
    pitch: "Dans une Australie ravagée par une infection, un père cherche un foyer pour sa petite fille avant de succomber lui-même. 48 heures pour la sauver.",
    why: "<strong>Cargo</strong> n'est pas un film de zombies. C'est un film sur la paternité, déguisé en post-apocalyptique. <strong>Martin Freeman</strong> y est bouleversant, le rythme est lent et juste, et la fin te prend à la gorge. Si tu veux pleurer ce soir sans regarder un mélo facile, c'est celui-là.",
    bestFor: "Une soirée où tu acceptes d'être ému — et tu as un mouchoir pas loin.",
  },
};

function proxy(url) { return '/api/tmdb/proxy-image?url=' + encodeURIComponent(url); }

function buildCarousel(film, ed) {
  if (!film.images || film.images.length === 0) {
    if (film.posterUrl) {
      return '<figure class="image image-style-align-center" style="margin:20px 0;">'
        + '<img src="' + proxy(film.posterUrl) + '" alt="' + film.title + ' ' + film.year + ' - ' + ed.altKeyword + '" title="' + film.title + ' (' + film.year + ')" style="max-height:400px;border-radius:10px;" loading="lazy" decoding="async" />'
        + '<figcaption>' + film.title + ' (' + film.year + ')' + (film.genres ? ' — ' + film.genres : '') + '</figcaption>'
        + '</figure>';
    }
    return '';
  }
  var alts = [
    film.title + ' ' + film.year + ' - ' + ed.altKeyword,
    film.title + ' film ' + film.year + ' - quel film regarder ce soir',
    film.title + ' ' + film.year + ' - ' + (film.genres.split(',')[0] || 'film').toLowerCase().trim() + ' à voir ce soir',
    film.title + ' - idée film ce soir',
    film.title + ' ' + film.year + ' - ' + ed.altKeyword,
  ];
  var html = '<div class="film-carousel" style="display:flex;flex-direction:row;gap:10px;overflow-x:auto;overflow-y:hidden;margin:20px 0;padding:10px 0;flex-wrap:nowrap;">';
  film.images.forEach(function(url, i) {
    html += '<img src="' + proxy(url) + '" alt="' + alts[i % alts.length] + '" title="' + film.title + ' - image ' + (i + 1) + '" style="height:280px;width:auto;border-radius:10px;flex-shrink:0;display:block;" loading="lazy" decoding="async" />';
  });
  return html + '</div>';
}

function buildMainFilmBlock(film, index) {
  const ed = editorial[film.title];
  let block = '';

  // H2 SEO orienté humeur
  block += '<h2>' + (index + 1) + '. ' + ed.moodEmoji + ' ' + ed.moodLabel + ' : ' + film.title + ' (' + film.year + ')</h2>';

  block += buildCarousel(film, ed);

  // Métadonnées
  block += '<ul>';
  if (film.genres) block += '<li><strong>Genre :</strong> ' + film.genres + '</li>';
  if (film.runtime) block += '<li><strong>Durée :</strong> ' + film.runtime + '</li>';
  if (film.director) block += '<li><strong>Réalisateur :</strong> ' + film.director + '</li>';
  if (film.cast) block += '<li><strong>Casting :</strong> ' + film.cast + '</li>';
  block += '</ul>';

  block += '<p><strong>Le pitch :</strong> ' + ed.pitch + '</p>';
  block += '<p><strong>Pourquoi le regarder ce soir :</strong> ' + ed.why + '</p>';
  block += '<p><strong>Idéal pour :</strong> ' + ed.bestFor + '</p>';

  return block;
}

function buildSecondarySection(films) {
  const groups = {
    rythme: { emoji: '🔥', title: 'Si tu veux du rythme ce soir', linkLabel: '10 Films Netflix à voir ce soir', linkUrl: '/article/10-films-netflix-a-voir-ce-soir-2026' },
    reflexion: { emoji: '🧩', title: 'Si tu veux réfléchir ce soir', linkLabel: '8 Films comme Inception à voir absolument', linkUrl: '/article/films-comme-inception-a-voir-absolument' },
    derangeant: { emoji: '😨', title: 'Si tu veux être dérangé ce soir', linkLabel: '7 Films avec un plot twist incroyable', linkUrl: '/article/7-films-plot-twist-incroyable' },
  };

  let html = '<h2>🎯 Autres idées de films à voir ce soir selon ton envie</h2>';
  html += "<p>Aucun des quatre films plus haut ne te tente ? Voici 6 autres idées triées par envie. Pour chaque catégorie, on te donne aussi un article complet pour creuser.</p>";

  Object.keys(groups).forEach(function(key) {
    const g = groups[key];
    const filmsInGroup = films.filter(function(f) { return f.category === key; });
    html += '<h3>' + g.emoji + ' ' + g.title + '</h3>';
    html += '<div style="display:flex;flex-direction:row;gap:16px;flex-wrap:wrap;margin:16px 0;">';
    filmsInGroup.forEach(function(f) {
      const img = f.posterUrl ? proxy(f.posterUrl) : (f.backdropUrl ? proxy(f.backdropUrl) : '');
      html += '<div style="flex:1;min-width:240px;max-width:340px;background:#fafafa;border:1px solid #e8e8e8;border-radius:12px;padding:12px;display:flex;gap:12px;align-items:center;">';
      if (img) {
        html += '<img src="' + img + '" alt="' + f.title + ' ' + f.year + ' - film à voir ce soir" title="' + f.title + ' (' + f.year + ')" style="width:80px;height:auto;border-radius:8px;flex-shrink:0;" loading="lazy" decoding="async" />';
      }
      html += '<div><p style="margin:0;font-weight:700;font-size:0.95rem;color:#1a1a1a;">' + f.title + '</p>';
      html += '<p style="margin:2px 0 0;font-size:0.82rem;color:#666;">' + f.year + (f.genres ? ' · ' + f.genres.split(',')[0] : '') + '</p></div></div>';
    });
    html += '</div>';
    html += '<p style="font-size:0.93rem;">→ <a href="' + g.linkUrl + '" style="color:#e50914;font-weight:600;">Voir aussi : ' + g.linkLabel + '</a></p>';
  });

  return html;
}

function buildHowToChoose() {
  let html = '<h2>🧠 Comment choisir un film à regarder ce soir en 30 secondes ?</h2>';
  html += "<p>La paralysie du choix devant Netflix est une vraie chose. Voici une méthode simple, testée, qui marche à tous les coups :</p>";

  html += '<div style="background:#f7f7f7;border:1px solid #e5e5e5;border-radius:12px;padding:20px 24px;margin:20px 0;">';
  html += '<ol style="margin:0;padding-left:22px;">';
  html += '<li style="margin:10px 0;"><strong>Évalue ton énergie.</strong> Tu es lessivé ou éveillé ? Si lessivé, vise un feel good (<strong>The Fundamentals of Caring</strong>) ou un film court. Si éveillé, tu peux te permettre un film cérébral (<strong>Coherence</strong>).</li>';
  html += '<li style="margin:10px 0;"><strong>Évalue ton temps.</strong> Tu as 1h30 ou 2h30 devant toi ? Adapte. Pas la peine de lancer un film de 2h45 si tu vas dormir au bout d\'une heure.</li>';
  html += '<li style="margin:10px 0;"><strong>Évalue ton envie.</strong> Tu veux fuir ta journée (feel good, action), la digérer (drame), ou la transformer (cérébral, twist) ? Cette question décide de tout.</li>';
  html += '<li style="margin:10px 0;"><strong>Décide en 30 secondes maximum.</strong> Le pire n\'est pas de choisir un film moyen — c\'est de passer 45 minutes à choisir et ne plus avoir le temps de le regarder.</li>';
  html += '</ol></div>';

  html += "<p><strong>La règle d'or :</strong> un bon film vaut mieux qu'un choix parfait. <em>Choisis vite, regarde, ajuste demain.</em></p>";

  html += "<h3>Les 3 pièges classiques quand on cherche un film ce soir</h3>";
  html += "<p><strong>Piège 1 : ouvrir Netflix sans idée préalable.</strong> L'algorithme te propose ce qu'il sait déjà que tu vas cliquer — c'est-à-dire pas grand-chose de nouveau. Décide ton humeur AVANT d'allumer la télé.</p>";
  html += "<p><strong>Piège 2 : choisir un film trop ambitieux pour ton état.</strong> Lancer <strong>Coherence</strong> ou <strong>Predestination</strong> à 23h après une grosse journée, c'est se garantir une déception. Ces films exigent ton cerveau entier — réserve-les pour un samedi après-midi pluvieux.</p>";
  html += "<p><strong>Piège 3 : céder à la pression du \"film culte\".</strong> Tu n'as pas envie ce soir de regarder ce drame de 3h que tout le monde adore. Ce n'est pas grave. Le bon film ce soir, c'est celui qui correspond à <em>ton</em> envie, pas à un consensus.</p>";

  return html;
}

function buildInternalLinking() {
  let html = '<h2>🔗 À explorer aussi sur MovieHunt Blog</h2>';
  html += "<p>Tu cherches d'autres idées pour ce soir ou pour les soirs à venir ? Voici nos sélections les plus populaires :</p>";
  html += '<ul>';
  html += '<li><a href="/article/10-films-netflix-a-voir-ce-soir-2026" style="color:#e50914;font-weight:500;">10 Films Netflix à voir ce soir : sélection 2026</a> — la suite logique de cet article</li>';
  html += '<li><a href="/article/films-comme-inception-a-voir-absolument" style="color:#e50914;font-weight:500;">8 Films comme Inception à voir absolument</a> — pour les soirs où tu veux te faire retourner le cerveau</li>';
  html += '<li><a href="/article/10-thrillers-sous-cotes-a-voir-absolument" style="color:#e50914;font-weight:500;">10 Thrillers sous-cotés à voir absolument</a> — pour les amateurs de tension</li>';
  html += '<li><a href="/article/7-films-plot-twist-incroyable" style="color:#e50914;font-weight:500;">7 Films avec un plot twist incroyable</a> — quand tu veux être dérangé</li>';
  html += '<li><a href="/article/9-series-netflix-meconnues-a-voir-absolument" style="color:#e50914;font-weight:500;">9 Séries Netflix méconnues à voir absolument</a> — si tu veux du long format</li>';
  html += '<li><a href="/article/10-films-meconnus-netflix-2026" style="color:#e50914;font-weight:500;">10 Films méconnus sur Netflix à voir absolument en 2026</a> — pour sortir des sentiers battus</li>';
  html += '</ul>';
  return html;
}

function buildFAQ() {
  let html = '<h2>💡 FAQ : Quel film regarder ce soir ?</h2>';

  html += '<h3>Quel film regarder ce soir sur Netflix ?</h3>';
  html += "<p>Pour une soirée tendue, <strong>The Call</strong> (2020) est imparable. Pour quelque chose de touchant, <strong>Cargo</strong> avec Martin Freeman fonctionne très bien. Et si tu veux un feel good, <strong>The Fundamentals of Caring</strong> avec Paul Rudd est exactement ce qu'il te faut. Les trois sont disponibles sur Netflix France.</p>";

  html += '<h3>Quel bon film voir ce soir si je suis fatigué ?</h3>';
  html += "<p>Vise un feel good court. <strong>The Fundamentals of Caring</strong> (97 min) est parfait : sympathique, émouvant, jamais lourd. Évite les films cérébraux comme <strong>Coherence</strong> ou <strong>Predestination</strong> si ton cerveau est en mode veille — tu vas perdre le fil.</p>";

  html += '<h3>Quel film regarder ce soir en couple ?</h3>';
  html += "<p>Tout dépend de votre humeur commune. Pour une soirée légère et complice : <strong>The Fundamentals of Caring</strong>. Pour partager un suspense : <strong>The Call</strong>. Pour pleurer ensemble : <strong>Cargo</strong>. Pour débriefer pendant deux heures après : <strong>Coherence</strong>. Évite les films trop violents pour un premier rendez-vous ciné.</p>";

  html += '<h3>Quel film regarder ce soir sans réfléchir ?</h3>';
  html += "<p>Vise l'action ou le feel good. Côté action efficace, <strong>Wheelman</strong> (2017, Netflix) est un thriller de course-poursuite ramassé en 1h22 — zéro temps mort. Côté feel good, <strong>The Fundamentals of Caring</strong> coche toutes les cases. Les deux te demandent zéro effort intellectuel.</p>";

  html += '<h3>Quel film à voir ce soir si je veux quelque chose de différent ?</h3>';
  html += "<p><strong>Coherence</strong> (2013) est l'arme absolue : un dîner entre amis qui devient une expérience de pensée vertigineuse, tourné en cinq jours dans une maison. Tu n'auras jamais rien vu de pareil. <strong>The Discovery</strong> (2017, Netflix) joue dans la même catégorie sur l'au-delà.</p>";

  html += '<h3>Comment choisir un film à voir ce soir rapidement ?</h3>';
  html += "<p>Trois questions, 30 secondes : 1) Tu es fatigué ou éveillé ? 2) Tu as 1h30 ou 3h ? 3) Tu veux fuir, digérer ou être surpris ? Réponds, choisis dans la catégorie correspondante de cet article, et lance. Le pire ennemi d'une soirée ciné, c'est l'indécision.</p>";

  html += '<h3>Quel film à voir ce soir gratuitement et en streaming ?</h3>';
  html += "<p>Si tu as Netflix : <strong>The Call</strong>, <strong>Cargo</strong>, <strong>The Fundamentals of Caring</strong>, <strong>Wheelman</strong>, <strong>Gerald's Game</strong> et <strong>The Discovery</strong> y sont disponibles (vérifie selon ton pays). Sur Prime Video, tu peux trouver <strong>Coherence</strong> et <strong>Predestination</strong> en VOD ou abonnement Mubi/Shudder selon les rotations.</p>";

  return html;
}

function generateArticleHTML(filmsData) {
  let content = '';

  // Bloc réponse rapide (featured snippet)
  content += '<div style="background:#fafafa;border:1px solid #e8e8e8;border-left:5px solid #e50914;border-radius:12px;padding:22px 26px;margin-bottom:28px;">';
  content += '<p style="font-size:0.78rem;color:#e50914;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px;">Réponse rapide</p>';
  content += '<p style="font-size:1.05rem;margin:0 0 10px;line-height:1.7;color:#1a1a1a;">Quel film regarder ce soir ? Selon ton humeur : <strong style="color:#e50914;">The Fundamentals of Caring</strong> (feel good), <strong style="color:#e50914;">The Call</strong> (suspense), <strong style="color:#e50914;">Coherence</strong> (cérébral), <strong style="color:#e50914;">Cargo</strong> (émotion). Détails, bandes-annonces et alternatives ci-dessous.</p>';
  content += '<p style="font-size:0.88rem;color:#666;margin:0;">12 idées au total, classées par envie ↓</p></div>';

  // Intro
  content += "<p>Tu ne sais pas <strong>quel film regarder ce soir</strong> ? Tu n'es pas seul : chaque soir, des dizaines de milliers de personnes tapent exactement cette requête sur Google. Et la plupart finissent par passer plus de temps à chercher un film qu'à le regarder. Ce guide est conçu pour résoudre ça en moins de deux minutes.</p>";
  content += "<p>L'idée est simple : tu choisis ton humeur, on te donne <strong>le bon film</strong> pour ce soir. Pas de top 100 indigeste, pas de films que tu connais déjà par cœur, pas de blockbusters dont tu as déjà vu la bande-annonce vingt fois. Juste 4 choix précis selon ton état du moment, plus 6 alternatives si aucun ne te parle.</p>";
  content += "<p>Pourquoi cette approche par humeur fonctionne mieux qu'un classique top 50 ? Parce que <strong>le meilleur film à regarder ce soir n'existe pas dans l'absolu</strong>. Il existe par rapport à toi, à ta journée, à ta fatigue, à ton envie. Le même <em>Coherence</em> sera génial un soir où tu es éveillé et catastrophique un soir où tu rentres à 22h après dix heures de boulot.</p>";
  content += "<p><strong>Tous les films de cet article sont vérifiés, datés, et accompagnés d'un verdict honnête</strong> — pas de copier-coller de synopsis Netflix. Si on dit qu'un film est sur Netflix, c'est qu'il y est (au moment de l'écriture, en France). Si on dit qu'il fait pleurer, c'est qu'on l'a vérifié.</p>";

  // (Bloc humeur visuel retiré — les H2 ci-dessous suffisent)

  // Films principaux
  filmsData.main.forEach(function(film, i) {
    content += buildMainFilmBlock(film, i);
  });

  // Films secondaires
  content += buildSecondarySection(filmsData.secondary);

  // Comment choisir
  content += buildHowToChoose();

  // Recherches fréquentes (renforcement SEO long-tail)
  content += '<h2>🔍 Les questions les plus posées sur quel film regarder ce soir</h2>';
  content += "<p>Voici les recherches qui reviennent chaque soir sur Google. Si tu en reconnais une, tu trouveras la réponse dans la FAQ plus bas :</p>";
  content += '<ul>';
  content += '<li><em>"quel film regarder ce soir"</em> — la question la plus tapée, et la plus large</li>';
  content += '<li><em>"film à voir ce soir Netflix"</em> — restreinte à la plateforme la plus utilisée</li>';
  content += '<li><em>"bon film à voir ce soir"</em> — pour ceux qui veulent une garantie qualité</li>';
  content += '<li><em>"idée film ce soir"</em> — pour ceux qui veulent juste un déclencheur</li>';
  content += '<li><em>"film à regarder en couple ce soir"</em> — la requête la plus contextualisée</li>';
  content += '<li><em>"film à voir ce soir sans réfléchir"</em> — l\'option fatigue</li>';
  content += '</ul>';
  content += "<p>Toutes ces requêtes mènent à la même vérité : il n'existe pas de meilleur film universel ce soir. Il existe le bon film <strong>pour toi, ce soir</strong>.</p>";

  // Maillage interne
  content += buildInternalLinking();

  // FAQ
  content += buildFAQ();

  // Conclusion
  content += '<h2>🚀 Conclusion : choisis vite, et regarde</h2>';
  content += "<p>Tu as maintenant 12 films triés selon 4 humeurs, une méthode pour choisir en 30 secondes, et 6 articles complémentaires pour les soirs suivants. Tu n'as plus aucune excuse pour passer une heure à scroller Netflix.</p>";
  content += "<p><strong>La règle :</strong> un bon film vaut mieux qu'un choix parfait. Les meilleurs souvenirs de ciné ne viennent presque jamais des films qu'on a longtemps cherchés — ils viennent de ceux qu'on a lancés vite, parfois par hasard.</p>";
  content += "<p><em>Ce soir, tu choisis dans cet article. Demain, tu reviens nous dire lequel.</em></p>";

  return content;
}

async function createArticle() {
  console.log('Récupération des données TMDB...\n');
  const filmsData = await fetchAll();

  console.log('\nRésumé:');
  filmsData.main.forEach(function(f) { console.log('  [main] ' + f.title + ': ' + f.images.length + ' images, poster: ' + (f.posterUrl ? 'OK' : 'manquant')); });
  filmsData.secondary.forEach(function(f) { console.log('  [sec ] ' + f.title + ': poster: ' + (f.posterUrl ? 'OK' : 'manquant')); });

  const articleContent = generateArticleHTML(filmsData);
  const wordCount = articleContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(function(w) { return w.length > 0; }).length;
  console.log('\nMots: ' + wordCount);

  const coverImage = filmsData.main[0].backdropUrl || filmsData.main[0].posterUrl || filmsData.main[1].backdropUrl;

  const supabaseArticle = {
    title: "Quel Film Regarder Ce Soir ? 12 Idées Selon Ton Humeur (Guide 2026)",
    slug: 'quel-film-regarder-ce-soir-guide-2026',
    content: articleContent,
    excerpt: "Quel film regarder ce soir ? 12 idées triées par humeur : feel good, suspense, cérébral, émotion. The Fundamentals of Caring, The Call, Coherence, Cargo et 8 autres.",
    source_url: '',
    scraped_data: {},
    cover_image: coverImage,
    tags: ['quel film regarder ce soir', 'film à voir ce soir', 'idée film soirée', 'film Netflix ce soir', 'film en couple', 'The Call', 'Coherence', 'Cargo', 'The Fundamentals of Caring'],
    status: 'draft',
    category: 'list',
    generated_by: 'manual',
    metadata: {
      movieTitle: 'Quel film regarder ce soir',
      releaseYear: '2026',
      genre: ['Liste', 'Guide', 'Recommandations'],
    },
    seo: {
      metaTitle: "Quel Film Regarder Ce Soir ? 12 Idées Selon Ton Humeur (2026)",
      metaDescription: "Quel film regarder ce soir ? Guide 2026 : 12 films triés par humeur (feel good, suspense, cérébral, émotion). The Call, Coherence, Cargo et plus.",
      keywords: [
        'quel film regarder ce soir',
        'film à voir ce soir',
        'film à voir ce soir Netflix',
        'bon film à voir ce soir',
        'idée film ce soir',
        'film à regarder en couple',
        'film feel good ce soir',
        'film suspense ce soir',
        'film intelligent ce soir',
        'film touchant ce soir',
        'The Fundamentals of Caring',
        'The Call film coréen',
        'Coherence film',
        'Cargo Martin Freeman',
        'film à voir ce soir sans réfléchir',
        'comment choisir un film ce soir',
      ],
    },
    published_at: new Date().toISOString(),
  };

  try {
    const result = await supabase.from('articles').insert([supabaseArticle]).select().single();
    if (result.error) throw result.error;
    console.log('\n✅ Article créé en brouillon !');
    console.log('   ID    : ' + result.data.id);
    console.log('   Slug  : ' + supabaseArticle.slug);
    console.log('   Cover : ' + coverImage);
    console.log('   URL   : https://www.moviehunt-blog.fr/admin/edit/' + result.data.id);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message || error);
  }
}

createArticle().catch(console.error);
