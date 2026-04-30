/* eslint-disable */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMDB_KEY = process.env.TMDB_API_KEY;

/* ── Recherche l'ID TMDB par titre ───────────────────────────────── */
async function findTmdbId(title, year) {
  const res = await axios.get('https://api.themoviedb.org/3/search/movie', {
    params: { api_key: TMDB_KEY, query: title, year: year, language: 'fr-FR' },
  });
  const results = res.data.results || [];
  if (!results.length) throw new Error(`Film "${title}" introuvable sur TMDB`);
  const movie = results[0];
  console.log(`  \u2705 TMDB ID trouv\u00e9: ${movie.id} — ${movie.title} (${movie.release_date})`);
  return movie.id;
}

/* ── Récupère posters + backdrops ─────────────────────────────────── */
async function fetchImages(movieId) {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
    params: { api_key: TMDB_KEY },
  });
  const posters   = res.data.posters   || [];
  const backdrops = res.data.backdrops || [];
  console.log(`  \u2705 TMDB images: ${posters.length} posters, ${backdrops.length} backdrops`);
  return { posters, backdrops };
}

/* ── Récupère la photo du réalisateur ────────────────────────────── */
async function fetchDirectorPhoto(movieId) {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
    params: { api_key: TMDB_KEY },
  });
  const director = (res.data.crew || []).find(function(p) { return p.job === 'Director'; });
  if (!director) return null;
  console.log(`  \u2705 R\u00e9alisateur: ${director.name} (id: ${director.id})`);
  try {
    const imgRes = await axios.get(`https://api.themoviedb.org/3/person/${director.id}/images`, {
      params: { api_key: TMDB_KEY },
    });
    const profiles = imgRes.data.profiles || [];
    if (profiles.length > 0) return `https://image.tmdb.org/t/p/w342${profiles[0].file_path}`;
  } catch (e) {
    console.warn('  \u26a0\ufe0f Photo r\u00e9alisateur non trouv\u00e9e');
  }
  return null;
}

/* ── Génère une balise <figure> ──────────────────────────────────── */
function figure(src, alt, caption) {
  return [
    '<figure class="image image-style-align-center">',
    `  <img src="${src}" alt="${alt}" title="${alt}" />`,
    `  <figcaption>${caption}</figcaption>`,
    '</figure>',
  ].join('\n');
}

function imgUrl(filePath, size) {
  return `https://image.tmdb.org/t/p/${size || 'w1280'}${filePath}`;
}

/* ── Convertit le markdown de l'article en HTML ─────────────────── */
function mdToHtml(md, imageSlots) {
  var slots = imageSlots.slice();
  var lines = md.split('\n');
  var html = [];
  var inP = false;

  function closeP() {
    if (inP) { html.push('</p>'); inP = false; }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (line.trim().startsWith('[TMDB_IMAGE')) {
      closeP();
      var slot = slots.shift();
      if (slot) html.push(slot);
      continue;
    }
    if (/^# /.test(line))  { closeP(); continue; }
    if (/^## /.test(line)) { closeP(); html.push('<h2>' + line.replace(/^## /, '') + '</h2>'); continue; }
    if (/^### /.test(line)){ closeP(); html.push('<h3>' + line.replace(/^### /, '') + '</h3>'); continue; }
    if (line.trim() === '---' || line.trim() === '') { closeP(); continue; }

    var text = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g,     '<em>$1</em>');

    if (!inP) { html.push('<p>'); inP = true; }
    html.push(text);
  }
  closeP();
  return html.join('\n');
}

/* ── Main ────────────────────────────────────────────────────────── */
async function run() {
  console.log('\n\ud83c\udfac Publication de l\'article Longlegs...\n');

  const movieId = await findTmdbId('Longlegs', 2024);
  const { posters, backdrops } = await fetchImages(movieId);
  const directorPhoto = await fetchDirectorPhoto(movieId);

  var imageSlots = [
    posters[0]   ? figure(imgUrl(posters[0].file_path, 'w780'),   'Longlegs (2024) \u2014 affiche officielle', 'Longlegs (2024) \u2014 Thriller occulte avec Nicolas Cage') : null,
    backdrops[1] ? figure(imgUrl(backdrops[1].file_path),          'Longlegs \u2014 atmosph\u00e8re du film d\'Osgood Perkins', 'Extrait de Longlegs (2024)') : (backdrops[0] ? figure(imgUrl(backdrops[0].file_path), 'Longlegs \u2014 sc\u00e8ne du film', 'Extrait de Longlegs (2024)') : null),
    backdrops[3] ? figure(imgUrl(backdrops[3].file_path),          'Nicolas Cage et Maika Monroe dans Longlegs (2024)', 'Nicolas Cage dans Longlegs \u2014 Netflix') : (backdrops[2] ? figure(imgUrl(backdrops[2].file_path), 'Longlegs \u2014 sc\u00e8ne', 'Extrait de Longlegs (2024)') : null),
    directorPhoto ? figure(directorPhoto, 'Osgood Perkins, r\u00e9alisateur de Longlegs (2024)', 'Osgood Perkins \u2014 r\u00e9alisateur et sc\u00e9nariste') : null,
  ].filter(Boolean);

  console.log(`  \u2705 ${imageSlots.length} images pr\u00eates`);

  var mdPath = path.join(__dirname, '../../Claude/longlegs-article.md');
  var mdContent = fs.readFileSync(mdPath, 'utf8');

  var articleStart = mdContent.indexOf('# Nicolas Cage');
  var metaStart    = mdContent.indexOf('## M\u00e9tadonn\u00e9es SEO');
  var articleMd    = mdContent.slice(articleStart, metaStart > -1 ? metaStart : undefined);

  var htmlContent = mdToHtml(articleMd, imageSlots);
  console.log(`  \u2705 Contenu HTML: ${htmlContent.length} caract\u00e8res`);

  var SLUG    = 'longlegs-2024-nicolas-cage-meconnaissable-pepite-netflix';
  var TITLE   = 'Nicolas Cage m\u00e9connaissable : Longlegs, la p\u00e9pite horrifique que vous n\u2019avez pas vue sur Netflix';
  var EXCERPT = 'Nicolas Cage totalement transform\u00e9, une atmosph\u00e8re digne de True Detective et un thriller occulte sur Netflix. Longlegs (2024) est la p\u00e9pite que vous avez rat\u00e9e.';
  var TAGS    = ['Nicolas Cage', 'Longlegs', 'Netflix', 'thriller', 'horreur', 'p\u00e9pite', 'film m\u00e9connu', 'Osgood Perkins'];
  var COVER   = posters[0] ? imgUrl(posters[0].file_path, 'w780') : null;

  var SEO = {
    metaTitle:       'Nicolas Cage m\u00e9connaissable : Longlegs, la p\u00e9pite horrifique oubli\u00e9e sur Netflix',
    metaDescription: 'Nicolas Cage totalement transform\u00e9, une ambiance digne de True Detective et un thriller occulte sur Netflix. Longlegs (2024) est la p\u00e9pite que vous avez rat\u00e9e.',
    keywords:        ['Nicolas Cage Longlegs', 'Longlegs Netflix', 'Longlegs avis', 'Longlegs critique', 'film horreur Netflix 2024', 'Osgood Perkins', 'thriller occulte', 'p\u00e9pite Netflix'],
  };

  var METADATA = {
    movieTitle:  'Longlegs',
    releaseYear: 2024,
    genre:       ['Thriller', 'Horreur'],
    director:    'Osgood Perkins',
    actors:      ['Nicolas Cage', 'Maika Monroe'],
    score:       7,
    tmdbId:      movieId,
  };

  /* Vérifier si l'article existe déjà */
  var existing = (await supabase.from('articles').select('id').eq('slug', SLUG).maybeSingle()).data;

  if (existing) {
    console.log(`\u26a0\ufe0f  Article d\u00e9j\u00e0 existant (id: ${existing.id}) \u2014 mise \u00e0 jour...`);
    var upd = await supabase.from('articles').update({
      title: TITLE, content: htmlContent, excerpt: EXCERPT,
      cover_image: COVER, tags: TAGS, seo: SEO, status: 'published',
      updated_at: new Date().toISOString(),
    }).eq('id', existing.id);
    if (upd.error) { console.error('\u274c', upd.error.message); process.exit(1); }
  } else {
    var ins = await supabase.from('articles').insert({
      title: TITLE, slug: SLUG, content: htmlContent, excerpt: EXCERPT,
      cover_image: COVER, tags: TAGS, seo: SEO,
      source_url: '', status: 'published', category: 'review', generated_by: 'manual',
      metadata: METADATA,
      published_at: new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    }).select().single();
    if (ins.error) { console.error('\u274c', ins.error.message); process.exit(1); }
    console.log(`  ID: ${ins.data.id}`);
  }

  console.log('\n\ud83c\udf89 Article Longlegs publi\u00e9 !');
  console.log(`   URL: /article/${SLUG}`);
}

run().catch(console.error);
