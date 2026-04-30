const axios = require('axios');
const fs = require('fs');

const TMDB_API_KEY = 'adaae6de59a1a0ef031be9c4b22907b0';
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = [
  { title: "Fractured", year: 2019 },
  { title: "Contratiempo", year: 2016 },
  { title: "Coherence", year: 2013 },
  { title: "The Visit", year: 2015 },
  { title: "Predestination", year: 2014 },
  { title: "The Gift", year: 2015 },
  { title: "The Invitation", year: 2015 }
];

async function fetchMovieImages(movieId) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      params: { api_key: TMDB_API_KEY }
    });
    const images = response.data.backdrops.slice(0, 3).map(img => `https://image.tmdb.org/t/p/original${img.file_path}`);
    return images;
  } catch (error) {
    console.error(`Error fetching images for movie ${movieId}:`, error.message);
    return [];
  }
}

async function searchMovies() {
  const results = [];
  for (const movie of movies) {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: movie.title,
          year: movie.year,
          language: 'fr-FR'
        }
      });
      
      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        const images = await fetchMovieImages(result.id);
        results.push({
          title: movie.title,
          id: result.id,
          poster: `https://image.tmdb.org/t/p/original${result.poster_path}`,
          images: images
        });
      }
    } catch (error) {
      console.error(`Error searching ${movie.title}:`, error.message);
    }
  }
  
  fs.writeFileSync('tmdb_results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to tmdb_results.json');
}

searchMovies();
