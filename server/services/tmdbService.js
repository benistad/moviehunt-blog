const axios = require('axios');

class TMDBService {
  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error('❌ ERREUR: TMDB_API_KEY est requis dans .env');
    }
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p';
  }

  /**
   * Recherche un film par titre et année
   */
  async searchMovie(title, year = null) {
    try {

      console.log(`🎬 Recherche TMDB: "${title}" ${year ? `(${year})` : ''}`);

      const params = {
        api_key: this.apiKey,
        query: title,
        language: 'fr-FR',
        include_adult: false,
      };

      if (year) {
        params.year = year;
      }

      const response = await axios.get(`${this.baseUrl}/search/movie`, { params });

      if (response.data.results && response.data.results.length > 0) {
        const movie = response.data.results[0];
        console.log(`✅ Film trouvé sur TMDB: ${movie.title} (${movie.id})`);
        return movie;
      }

      console.log(`⚠️ Aucun résultat TMDB pour "${title}"`);
      return null;
    } catch (error) {
      console.error(`❌ Erreur recherche TMDB: ${error.message}`);
      return null;
    }
  }

  /**
   * Récupère les détails complets d'un film
   */
  async getMovieDetails(movieId) {
    try {

      const params = {
        api_key: this.apiKey,
        language: 'fr-FR',
        append_to_response: 'credits,images,videos',
      };

      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur détails TMDB: ${error.message}`);
      return null;
    }
  }

  /**
   * Enrichit les données d'un film avec TMDB
   */
  async enrichMovieData(movieTitle, year = null) {
    try {
      // Rechercher le film
      const searchResult = await this.searchMovie(movieTitle, year);
      if (!searchResult) {
        return null;
      }

      // Récupérer les détails complets
      const details = await this.getMovieDetails(searchResult.id);
      if (!details) {
        return null;
      }

      // Construire les URLs des images
      const posterUrl = details.poster_path 
        ? `${this.imageBaseUrl}/w500${details.poster_path}` 
        : null;
      
      const backdropUrl = details.backdrop_path 
        ? `${this.imageBaseUrl}/original${details.backdrop_path}` 
        : null;

      // Extraire les informations du casting
      const cast = details.credits?.cast?.slice(0, 10).map(actor => ({
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path 
          ? `${this.imageBaseUrl}/w185${actor.profile_path}` 
          : null,
      })) || [];

      const crew = details.credits?.crew || [];
      const director = crew.find(person => person.job === 'Director');

      // Retourner les données enrichies
      return {
        tmdbId: details.id,
        title: details.title,
        originalTitle: details.original_title,
        releaseDate: details.release_date,
        year: details.release_date ? new Date(details.release_date).getFullYear() : null,
        runtime: details.runtime,
        genres: details.genres?.map(g => g.name) || [],
        synopsis: details.overview || '',
        tagline: details.tagline || '',
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        popularity: details.popularity,
        posterUrl,
        backdropUrl,
        director: director ? {
          name: director.name,
          profile_path: director.profile_path 
            ? `${this.imageBaseUrl}/w185${director.profile_path}` 
            : null,
        } : null,
        cast,
        budget: details.budget,
        revenue: details.revenue,
        productionCompanies: details.production_companies?.map(c => c.name) || [],
        spokenLanguages: details.spoken_languages?.map(l => l.french_name || l.name) || [],
      };
    } catch (error) {
      console.error(`❌ Erreur enrichissement TMDB: ${error.message}`);
      return null;
    }
  }

  /**
   * Récupère plusieurs images pour un film
   */
  async getMovieImages(movieId, count = 20) {
    try {

      const params = {
        api_key: this.apiKey,
        include_image_language: 'fr,en,null', // Images en français, anglais et sans langue
      };

      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/images`, { params });
      
      const images = [];
      
      // Ajouter les backdrops (images horizontales)
      const backdrops = response.data.backdrops?.slice(0, count).map(img => 
        `${this.imageBaseUrl}/original${img.file_path}`
      ) || [];
      images.push(...backdrops);
      
      // Ajouter les posters (images verticales)
      const posters = response.data.posters?.slice(0, Math.floor(count / 2)).map(img => 
        `${this.imageBaseUrl}/w500${img.file_path}`
      ) || [];
      images.push(...posters);

      return images;
    } catch (error) {
      console.error(`❌ Erreur images TMDB: ${error.message}`);
      return [];
    }
  }

  /**
   * Formate les données TMDB pour l'utilisation dans les articles
   */
  formatForArticle(tmdbData) {
    if (!tmdbData) {
      return null;
    }

    return {
      coverImage: tmdbData.backdropUrl || tmdbData.posterUrl,
      metadata: {
        movieTitle: tmdbData.title,
        releaseYear: tmdbData.year?.toString() || '',
        genre: tmdbData.genres,
        director: tmdbData.director?.name || '',
        actors: tmdbData.cast?.map(c => c.name) || [],
        runtime: tmdbData.runtime,
        tmdbRating: tmdbData.voteAverage,
        synopsis: tmdbData.synopsis,
      },
      tmdbData: tmdbData,
    };
  }
}

module.exports = new TMDBService();
