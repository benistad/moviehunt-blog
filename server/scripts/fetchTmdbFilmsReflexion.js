require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');
const fs = require('fs');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = [
  { title: 'The Man from Earth', year: 2007 },
  { title: 'Aniara', year: 2018 },
  { title: 'The Double', year: 2013 },
  { title: 'Another Earth', year: 2011 },
  { title: 'The Congress', year: 2013 },
  { title: 'Mr. Nobody', year: 2009 },
  { title: 'The Sunset Limited', year: 2011 },
  { title: 'High Life', year: 2018 },
  { title: 'Timecrimes', year: 2007 },
  { title: 'Primer', year: 2004 },
];

async function fetchMovieData(movie) {
  const search = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: TMDB_API_KEY, query: movie.title, year: movie.year, language: 'fr-FR' }
  });
  if (!search.data.results.length) {
    console.warn(`⚠️ Non trouvé: ${movie.title}`);
    return null;
  }
  const result = search.data.results[0];
  const imagesRes = await axios.get(`${BASE_URL}/movie/${result.id}/images`, {
    params: { api_key: TMDB_API_KEY }
  });
  const filtered = imagesRes.data.backdrops.filter(b =>
    b.iso_639_1 === null || b.iso_639_1 === 'en' || b.iso_639_1 === 'fr'
  );
  const backdrops = filtered.slice(0, 3).map(b => `https://image.tmdb.org/t/p/original${b.file_path}`);
  return {
    title: movie.title,
    year: movie.year,
    tmdbId: result.id,
    poster: `https://image.tmdb.org/t/p/w342${result.poster_path}`,
    backdrops,
    genres: result.genre_ids,
  };
}

async function run() {
  const results = [];
  for (const m of movies) {
    console.log(`🔍 Recherche: ${m.title} (${m.year})`);
    const data = await fetchMovieData(m);
    if (data) {
      results.push(data);
      console.log(`  ✅ poster: ${data.poster}`);
      console.log(`  📸 backdrops: ${data.backdrops.length}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  fs.writeFileSync(require('path').join(__dirname, 'tmdb_reflexion.json'), JSON.stringify(results, null, 2));
  console.log('\n✅ Résultats sauvegardés dans tmdb_reflexion.json');
}

run().catch(console.error);
