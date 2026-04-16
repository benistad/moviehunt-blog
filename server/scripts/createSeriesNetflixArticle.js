require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

const series = [
  {
    title: 'The Playlist',
    originalTitle: 'The Playlist',
    year: 2022,
    country: 'Suède',
    episodes: '6 épisodes',
    genre: 'Drame, Biopic',
    why: 'La naissance de Spotify racontée comme un thriller. Chaque épisode adopte le point de vue d\'un protagoniste différent — le fondateur, l\'avocat, l\'artiste, le développeur. <strong>The Playlist</strong> est une série suédoise Netflix ambitieuse, formellement brillante, qu\'on termine en une nuit sans s\'en rendre compte. Si tu as aimé <em>WeCrashed</em> ou <em>The Social Network</em>, c\'est fait pour toi.',
    hook: 'La naissance de Spotify comme tu ne l\'as jamais vue'
  },
  {
    title: 'La Palma',
    originalTitle: 'La Palma',
    year: 2023,
    country: 'Norvège / Espagne',
    episodes: '4 épisodes',
    genre: 'Thriller, Catastrophe',
    why: 'Un volcan aux Canaries menace de déclencher un méga-tsunami qui pourrait engloutir l\'Atlantique. Quatre épisodes, tension maximale, production impeccable. <strong>La Palma</strong> est la mini-série catastrophe que Netflix aurait dû mettre en avant beaucoup plus — efficace, scientifiquement documentée et impossible à lâcher.',
    hook: 'Le tsunami qui pourrait engloutir l\'Atlantique'
  },
  {
    title: 'La nature sauvage',
    originalTitle: 'Into the Night',
    year: 2020,
    country: 'Belgique',
    episodes: '2 saisons',
    genre: 'Thriller, Science-Fiction, Post-apocalyptique',
    why: 'Un avion détourné par un militaire avec un seul objectif : rester dans la nuit pour survivre. Le soleil tue. <strong>La nature sauvage</strong> (titre original : <em>Into the Night</em>) est la première série Netflix belge — et l\'une des meilleures séries de survie de la plateforme. Tendue, humaine, et avec une prémisse qu\'on n\'a vue nulle part ailleurs.',
    hook: 'Rester dans la nuit pour survivre — le soleil est mortel'
  },
  {
    title: 'L\'éternaute',
    originalTitle: 'El eternauta',
    year: 2025,
    country: 'Argentine',
    episodes: '6 épisodes',
    genre: 'Science-Fiction, Post-apocalyptique, Drame',
    why: 'Adapté du comics argentin culte des années 50, <strong>L\'éternaute</strong> débute par une neige mortelle qui s\'abat sur Buenos Aires et décime la population en quelques minutes. Ce qui suit est une histoire de survie, de résistance et d\'identité nationale d\'une ambition rare pour une série latino. L\'une des sorties Netflix 2025 les plus marquantes — et pourtant presque personne n\'en parle.',
    hook: 'Une neige mortelle s\'abat sur Buenos Aires'
  },
  {
    title: 'Emergencia Radioactiva',
    originalTitle: 'Parot',
    year: 2024,
    country: 'Espagne',
    episodes: '6 épisodes',
    genre: 'Thriller, Drame',
    why: 'Une centrale nucléaire espagnole en situation d\'urgence, une équipe technique qui doit agir en quelques heures, et un contexte politique qui complique tout. <strong>Emergencia Radioactiva</strong> (titre original : <em>Parot</em>) est un thriller à huis clos haletant, très bien documenté techniquement. Si <em>Chernobyl</em> t\'a marqué, cette série est dans la même veine — en moins connu, mais tout aussi efficace.',
    hook: 'Chernobyl version espagnole — aussi efficace, bien moins connue'
  },
  {
    title: 'Un très mauvais pressentiment',
    originalTitle: 'A Very Bad Trip',
    year: 2024,
    country: 'France',
    episodes: '6 épisodes',
    genre: 'Comédie noire, Thriller',
    why: '<strong>Un très mauvais pressentiment</strong> est une comédie noire française qui déraille progressivement en quelque chose de beaucoup plus sombre. Une réunion entre amis, un secret qui remonte, et tout qui part en vrille. Humour noir, tension croissante, casting solide. La série française Netflix qu\'on n\'attendait pas aussi bonne.',
    hook: 'Une comédie française qui déraille en quelque chose de bien plus sombre'
  },
  {
    title: 'The Railway Men',
    originalTitle: 'The Railway Men',
    year: 2023,
    country: 'Inde',
    episodes: '4 épisodes',
    genre: 'Drame historique, Catastrophe',
    why: 'La catastrophe de Bhopal de 1984 — la pire catastrophe industrielle de l\'histoire — racontée du point de vue des cheminots qui ont sauvé des milliers de vies en risquant les leurs. <strong>The Railway Men</strong> est une mini-série indienne Netflix d\'une force émotionnelle rare. Comparable à <em>Chernobyl</em> dans sa capacité à mêler histoire vraie et tension dramatique.',
    hook: 'La catastrophe de Bhopal racontée comme jamais'
  },
  {
    title: 'Les meurtres zen',
    originalTitle: 'The Zen Diaries of Garry Shandling',
    year: 2022,
    country: 'Japon',
    episodes: '8 épisodes',
    genre: 'Policier, Comédie, Thriller',
    why: 'Un détective bouddhiste dans le Japon rural résout des crimes avec une philosophie déconcertante. <strong>Les meurtres zen</strong> est une série policière japonaise Netflix qu\'on pourrait décrire comme un <em>Columbo</em> zen — lente, spirituelle, et bizarrement addictive. Si tu cherches une série policière vraiment différente des procedurals habituels, c\'est celle-là.',
    hook: 'Un Columbo bouddhiste dans le Japon rural'
  },
  {
    title: 'The Days',
    originalTitle: 'The Days',
    year: 2023,
    country: 'Japon',
    episodes: '8 épisodes',
    genre: 'Drame, Historique, Catastrophe',
    why: 'Les 10 premiers jours de la catastrophe de Fukushima, reconstitués de manière chirurgicale. <strong>The Days</strong> est une série japonaise Netflix d\'une rigueur documentaire impressionnante — chaque décision, chaque erreur, chaque hésitation est retracée avec une précision qui donne le frisson. Moins spectaculaire que <em>Chernobyl</em>, mais tout aussi oppressante.',
    hook: 'Les 10 premiers jours de Fukushima — reconstitution chirurgicale'
  },
];

async function searchTmdb(title, originalTitle, year) {
  var queries = [title, originalTitle].filter(function(t, i, arr) { return arr.indexOf(t) === i; });
  for (var q = 0; q < queries.length; q++) {
    try {
      var r = await axios.get(TMDB_BASE + '/search/tv', {
        params: { api_key: TMDB_KEY, query: queries[q], first_air_date_year: year, language: 'fr-FR', include_adult: false }
      });
      if (r.data.results && r.data.results.length > 0) {
        console.log('  OK "' + queries[q] + '": ' + r.data.results[0].name + ' (id=' + r.data.results[0].id + ')');
        return r.data.results[0];
      }
      // sans année
      var r2 = await axios.get(TMDB_BASE + '/search/tv', {
        params: { api_key: TMDB_KEY, query: queries[q], language: 'fr-FR', include_adult: false }
      });
      if (r2.data.results && r2.data.results.length > 0) {
        console.log('  OK "' + queries[q] + '" (sans année): ' + r2.data.results[0].name + ' (id=' + r2.data.results[0].id + ')');
        return r2.data.results[0];
      }
    } catch (e) { console.error('  Erreur: ' + e.message); }
  }
  console.log('  AUCUN résultat pour "' + title + '"');
  return null;
}

async function getDetails(id) {
  try {
    var r = await axios.get(TMDB_BASE + '/tv/' + id, {
      params: { api_key: TMDB_KEY, language: 'fr-FR', append_to_response: 'credits,aggregate_credits' }
    });
    return r.data;
  } catch (e) { return null; }
}

async function getVariedImages(id) {
  try {
    var r = await axios.get(TMDB_BASE + '/tv/' + id + '/images', {
      params: { api_key: TMDB_KEY, include_image_language: 'en,null,fr' }
    });
    var backdrops = r.data.backdrops || [];
    var posters   = r.data.posters   || [];

    var seen = {};
    var filtered = backdrops.filter(function(b) {
      if (seen[b.file_path]) return false;
      seen[b.file_path] = true;
      return true;
    });
    var picked = filtered.length >= 6
      ? [filtered[0], filtered[Math.floor(filtered.length / 3)], filtered[Math.floor(filtered.length * 2 / 3)]]
      : filtered.slice(0, 3);
    var images = picked.map(function(b) { return IMG_BASE + '/original' + b.file_path; });
    posters.slice(0, 2).forEach(function(p) { images.push(IMG_BASE + '/w500' + p.file_path); });
    return images;
  } catch (e) { return []; }
}

function buildCarousel(images, serie) {
  if (!images || images.length === 0) return '';
  var alts = [
    serie.title + ' ' + serie.year + ' - série Netflix à voir',
    serie.title + ' Netflix - ' + serie.genre.split(',')[0].trim().toLowerCase(),
    serie.title + ' - série Netflix méconnue ' + serie.country,
    serie.title + ' ' + serie.year + ' - affiche officielle',
    serie.title + ' - scène de la série Netflix',
  ];
  var html = '<div class="film-carousel" style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; overflow-x: auto; overflow-y: hidden; margin: 20px 0; padding: 10px 0;">';
  images.forEach(function(url, i) {
    var proxy = '/api/tmdb/proxy-image?url=' + encodeURIComponent(url);
    html += '<img src="' + proxy + '" alt="' + alts[i % alts.length] + '" title="' + serie.title + ' - image ' + (i + 1) + '" style="height: 280px; width: auto; border-radius: 10px; flex-shrink: 0; display: block;" loading="lazy" decoding="async" />';
  });
  html += '</div>';
  return html;
}

function buildSerieSection(serie, index, details, images) {
  var creator = '';
  var cast = '';
  var seasons = '';
  var nbEpisodes = serie.episodes;

  if (details) {
    var creators = details.created_by || [];
    if (creators.length > 0) creator = creators.map(function(c) { return c.name; }).join(', ');
    var castArr = (details.aggregate_credits || details.credits || {}).cast || [];
    cast = castArr.slice(0, 3).map(function(a) { return a.name; }).join(', ');
    if (details.number_of_seasons) seasons = details.number_of_seasons + ' saison' + (details.number_of_seasons > 1 ? 's' : '');
    if (details.number_of_episodes) nbEpisodes = (seasons ? seasons + ', ' : '') + details.number_of_episodes + ' épisodes';
  }

  var synopsis = details ? (details.overview || '') : '';

  var html = '';
  html += '<h2>' + index + '. ' + serie.title + ' (' + serie.year + ') : ' + serie.hook + '</h2>';
  html += buildCarousel(images, serie);
  html += '<ul>';
  html += '<li><strong>Genre :</strong> ' + serie.genre + '</li>';
  html += '<li><strong>Pays :</strong> ' + serie.country + '</li>';
  html += '<li><strong>Format :</strong> ' + nbEpisodes + '</li>';
  if (creator) html += '<li><strong>Créateur :</strong> ' + creator + '</li>';
  if (cast) html += '<li><strong>Casting :</strong> ' + cast + '</li>';
  html += '</ul>';
  if (synopsis) html += '<p><strong>Le pitch :</strong> ' + synopsis + '</p>';
  html += '<p><strong>Pourquoi la regarder :</strong> ' + serie.why + '</p>';
  return html;
}

async function main() {
  console.log('Récupération des données TMDB pour les 9 séries...\n');

  var seriesData = [];
  for (var i = 0; i < series.length; i++) {
    var s = series[i];
    console.log('[' + (i + 1) + '/9] ' + s.title);
    var tmdb = await searchTmdb(s.title, s.originalTitle, s.year);
    var details = null;
    var images = [];
    if (tmdb) {
      details = await getDetails(tmdb.id);
      images = await getVariedImages(tmdb.id);
      console.log('  Images: ' + images.length);
    }
    seriesData.push({ serie: s, tmdb: tmdb, details: details, images: images });
    await new Promise(function(r) { setTimeout(r, 400); });
  }

  // ---- HTML ----
  var content = '';

  // Intro — 3 paragraphes, SEO-first
  content += '<p>Netflix propose chaque mois des dizaines de nouvelles séries — et l\'algorithme en met toujours les mêmes en avant. Résultat : des pépites internationales passent complètement inaperçues. Cette liste de <strong>séries Netflix méconnues</strong> existe pour corriger ça.</p>';
  content += '<p>Pas de <em>Stranger Things</em>, pas de <em>La Casa de Papel</em>. Ici, on parle de <strong>9 séries Netflix peu connues</strong> venues de Suède, du Japon, d\'Argentine, d\'Inde ou d\'Espagne — des séries qu\'on ne voit pas dans les classements mais qui méritent largement leur place dans le top de la plateforme.</p>';
  content += '<p>Thriller, catastrophe, biopic, comédie noire, science-fiction : il y en a pour tous les goûts. Et surtout : toutes sont disponibles (ou ont été disponibles) sur Netflix.</p>';

  // Sections séries
  seriesData.forEach(function(sd, i) {
    content += buildSerieSection(sd.serie, i + 1, sd.details, sd.images);
  });

  // Section "Selon ton humeur"
  content += '<h2>Quelle série Netflix peu connue regarder selon ton humeur ?</h2>';
  content += '<p>Impossible de choisir parmi ces <strong>séries Netflix méconnues</strong> ? Voici un guide rapide :</p>';
  content += '<ul>';
  content += '<li><strong>Tu veux un biopic haletant</strong> → <strong>The Playlist</strong> (2022). La naissance de Spotify vue comme un thriller en 6 points de vue différents.</li>';
  content += '<li><strong>Tu veux un thriller catastrophe intense</strong> → <strong>La Palma</strong> (2023) ou <strong>The Days</strong> (2023). L\'un pour la fiction, l\'autre pour la rigueur documentaire de Fukushima.</li>';
  content += '<li><strong>Tu veux de la SF originale</strong> → <strong>La nature sauvage</strong> (2020) ou <strong>L\'éternaute</strong> (2025). Deux visions très différentes de l\'apocalypse.</li>';
  content += '<li><strong>Tu veux un thriller nucléaire à huis clos</strong> → <strong>Emergencia Radioactiva</strong> (2024). Version espagnole de Chernobyl, aussi efficace et bien moins connue.</li>';
  content += '<li><strong>Tu veux rire avant que ça déraille</strong> → <strong>Un très mauvais pressentiment</strong> (2024). La comédie noire française qu\'on n\'attendait pas.</li>';
  content += '<li><strong>Tu veux une série historique bouleversante</strong> → <strong>The Railway Men</strong> (2023). Bhopal 1984, raconté avec une force émotionnelle rare.</li>';
  content += '<li><strong>Tu veux quelque chose de vraiment différent</strong> → <strong>Les meurtres zen</strong> (2022). Un détective bouddhiste dans le Japon rural. Rien d\'autre à ajouter.</li>';
  content += '</ul>';
  content += '<p>Ces <strong>séries Netflix peu connues</strong> ont toutes en commun d\'avoir été produites en dehors des États-Unis, avec des prises de risque que les grandes productions évitent. C\'est exactement ce qui les rend précieuses.</p>';

  // Pourquoi ces séries sont sous le radar
  content += '<h2>Pourquoi ces séries Netflix sont-elles si peu connues ?</h2>';
  content += '<p>L\'algorithme Netflix favorise les contenus qui génèrent des clics rapides. Une miniature colorée, un acteur connu, un titre en anglais — et le contenu remonte dans les recommandations. Les séries internationales, même excellentes, sont pénalisées : peu de doublage de qualité, pas de marketing agressif, fenêtre de découvrabilité réduite.</p>';
  content += '<p>Pourtant, <strong>The Playlist</strong> a été comparée aux meilleures séries biopics américaines. <strong>The Railway Men</strong> a reçu des critiques dithyrambiques en Inde et en Angleterre. <strong>L\'éternaute</strong> est l\'adaptation d\'un comics considéré comme le <em>Watchmen</em> argentin. Ces séries méritent bien mieux que l\'anonymat dans lequel Netflix les laisse.</p>';

  // Résumé
  content += '<h2>En résumé : les meilleures séries Netflix méconnues à voir</h2>';
  content += '<p>Si tu cherches des <strong>séries Netflix originales et peu connues</strong>, cette liste couvre un spectre large :</p>';
  content += '<ul>';
  content += '<li><strong>The Playlist</strong> — biopic Spotify, formel et brillant (Suède)</li>';
  content += '<li><strong>La Palma</strong> — thriller catastrophe en 4 épisodes (Norvège/Espagne)</li>';
  content += '<li><strong>La nature sauvage</strong> — SF de survie, première série belge Netflix</li>';
  content += '<li><strong>L\'éternaute</strong> — SF post-apo ambitieuse (Argentine, 2025)</li>';
  content += '<li><strong>Emergencia Radioactiva</strong> — urgence nucléaire à huis clos (Espagne)</li>';
  content += '<li><strong>Un très mauvais pressentiment</strong> — comédie noire qui déraille (France)</li>';
  content += '<li><strong>The Railway Men</strong> — catastrophe de Bhopal, force émotionnelle rare (Inde)</li>';
  content += '<li><strong>Les meurtres zen</strong> — policier bouddhiste japonais, addictif</li>';
  content += '<li><strong>The Days</strong> — Fukushima, reconstitution chirurgicale (Japon)</li>';
  content += '</ul>';
  content += '<p>Tu en as vu une ou plusieurs ? Dis-nous laquelle t\'a le plus surpris.</p>';

  // FAQ — 5 questions longue traîne
  content += '<h2>FAQ : Séries Netflix méconnues à voir absolument</h2>';
  content += '<h3>Quelle est la meilleure série Netflix peu connue à regarder en ce moment ?</h3>';
  content += '<p><strong>L\'éternaute</strong> (2025) est la sortie la plus récente et la plus ambitieuse de cette liste — une SF post-apocalyptique argentine adaptée d\'un comics culte. <strong>The Playlist</strong> (2022) reste la plus universellement appréciée si tu préfères un biopic haletant.</p>';
  content += '<h3>Quelles séries Netflix internationales méritent d\'être vues ?</h3>';
  content += '<p>Cette liste entière est internationale : suédoise (<strong>The Playlist</strong>), japonaise (<strong>The Days</strong>, <strong>Les meurtres zen</strong>), argentine (<strong>L\'éternaute</strong>), indienne (<strong>The Railway Men</strong>), espagnole (<strong>Emergencia Radioactiva</strong>, <strong>La Palma</strong>), belge (<strong>La nature sauvage</strong>), française (<strong>Un très mauvais pressentiment</strong>). Netflix produit des séries de qualité sur tous les continents — l\'algorithme ne les met juste jamais en avant.</p>';
  content += '<h3>Y a-t-il des séries Netflix comme Chernobyl ?</h3>';
  content += '<p>Oui : <strong>The Days</strong> (Fukushima, Japon), <strong>Emergencia Radioactiva</strong> (centrale nucléaire, Espagne) et <strong>The Railway Men</strong> (catastrophe de Bhopal, Inde) sont toutes trois dans la même veine — catastrophe industrielle ou technologique, point de vue humain, rigueur documentaire. Les trois méritent d\'être mises aux côtés de <em>Chernobyl</em>.</p>';
  content += '<h3>Quelles courtes séries Netflix peut-on regarder en une soirée ?</h3>';
  content += '<p><strong>La Palma</strong> (4 épisodes), <strong>L\'éternaute</strong> (6 épisodes) et <strong>Emergencia Radioactiva</strong> (6 épisodes) sont parfaites pour un marathon d\'une soirée. <strong>The Railway Men</strong> également avec ses 4 épisodes denses.</p>';
  content += '<h3>Quelles séries Netflix peu connues sont disponibles en français ?</h3>';
  content += '<p>Toutes les séries de cette liste sont disponibles avec sous-titres français, et la plupart avec doublage français : <strong>La Palma</strong>, <strong>La nature sauvage</strong> (production belge francophone à l\'origine), <strong>L\'éternaute</strong>, <strong>Emergencia Radioactiva</strong> et <strong>Un très mauvais pressentiment</strong> (production française). <strong>The Playlist</strong>, <strong>The Days</strong>, <strong>Les meurtres zen</strong> et <strong>The Railway Men</strong> sont disponibles en VO sous-titrée.</p>';

  // Cover image
  var coverImage = '';
  for (var j = 0; j < seriesData.length; j++) {
    if (seriesData[j].tmdb && seriesData[j].tmdb.backdrop_path) {
      coverImage = IMG_BASE + '/original' + seriesData[j].tmdb.backdrop_path;
      break;
    }
  }

  var wordCount = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(function(w) { return w.length > 0; }).length;
  console.log('\nMots: ' + wordCount);

  var excerpt = '9 séries Netflix méconnues à voir absolument : thrillers, SF, drames historiques venus du monde entier. The Playlist, L\'éternaute, The Days, La Palma et bien d\'autres.';
  var metaDescription = 'Séries Netflix peu connues mais excellentes : The Playlist, L\'éternaute, The Days, La Palma, Emergencia Radioactiva, The Railway Men. Notre sélection internationale.';
  console.log('excerpt len: ' + excerpt.length);
  console.log('metaDesc len: ' + metaDescription.length);

  var article = {
    title: '9 Séries Netflix Méconnues à Voir Absolument',
    slug: '9-series-netflix-meconnues-a-voir-absolument',
    content: content,
    excerpt: excerpt,
    cover_image: coverImage,
    source_url: 'https://www.moviehunt-blog.fr',
    scraped_data: {},
    tags: ['Netflix', 'séries Netflix', 'série méconnue', 'The Playlist', 'L\'éternaute', 'The Days', 'La Palma', 'série internationale', 'série catastrophe', 'The Railway Men'],
    status: 'draft',
    category: 'list',
    generated_by: 'manual',
    metadata: {
      movieTitle: 'Séries Netflix méconnues',
      releaseYear: '2026',
      genre: ['Drame', 'Thriller', 'Science-Fiction', 'Historique', 'Catastrophe'],
    },
    seo: {
      metaTitle: '9 Séries Netflix Méconnues à Voir Absolument (2025-2026)',
      metaDescription: metaDescription,
      keywords: [
        'séries Netflix méconnues',
        'séries Netflix peu connues',
        'meilleure série Netflix inconnue',
        'série Netflix internationale',
        'The Playlist Netflix',
        'L\'éternaute Netflix',
        'The Days Netflix Fukushima',
        'série Netflix comme Chernobyl',
        'La Palma Netflix',
        'The Railway Men Netflix',
        'série Netflix sous-estimée',
        'séries Netflix originales 2025',
      ],
    },
    published_at: new Date().toISOString(),
  };

  var result = await supabase.from('articles').insert([article]).select('id, slug, title').single();
  if (result.error) { console.error('Erreur Supabase:', result.error); return; }

  console.log('\nArticle créé en brouillon!');
  console.log('ID   : ' + result.data.id);
  console.log('Slug : ' + result.data.slug);
  console.log('URL  : https://www.moviehunt-blog.fr/article/' + result.data.slug);
}

main().catch(console.error);
