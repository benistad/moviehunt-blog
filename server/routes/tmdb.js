const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService');
const axios = require('axios');

/**
 * GET /api/tmdb/search
 * Recherche un film et retourne ses images
 */
router.get('/search', async (req, res, next) => {
  try {
    const { query, year } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "query" est requis',
      });
    }

    // Rechercher le film
    const movie = await tmdbService.searchMovie(query, year);

    if (!movie) {
      return res.json({
        success: true,
        data: {
          found: false,
          images: [],
        },
      });
    }

    // Récupérer les détails et images
    const details = await tmdbService.getMovieDetails(movie.id);
    const additionalImages = await tmdbService.getMovieImages(movie.id, 20);

    // Construire la liste des images
    const images = [];
    
    // Ajouter le backdrop principal
    if (details.backdrop_path) {
      images.push(`${tmdbService.imageBaseUrl}/original${details.backdrop_path}`);
    }
    
    // Ajouter le poster
    if (details.poster_path) {
      images.push(`${tmdbService.imageBaseUrl}/w500${details.poster_path}`);
    }

    // Ajouter toutes les autres images (backdrops supplémentaires)
    images.push(...additionalImages);

    res.json({
      success: true,
      data: {
        found: true,
        movieId: movie.id,
        title: details.title,
        year: details.release_date ? new Date(details.release_date).getFullYear() : null,
        images: images.filter((img, index, self) => self.indexOf(img) === index), // Dédupliquer
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tmdb/proxy-image
 * Proxy pour les images TMDB (résout les problèmes CORS)
 */
router.get('/proxy-image', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "url" est requis',
      });
    }

    // Vérifier que l'URL provient bien de TMDB
    if (!url.startsWith('https://image.tmdb.org/')) {
      return res.status(400).json({
        success: false,
        error: 'URL non autorisée',
      });
    }

    // Récupérer l'image depuis TMDB
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'MovieHunt Blog/1.0',
      },
    });

    // Définir les headers appropriés
    res.set('Content-Type', response.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache 1 an
    res.set('Access-Control-Allow-Origin', '*');
    
    // Envoyer l'image
    res.send(response.data);
  } catch (error) {
    console.error('Erreur proxy image TMDB:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement de l\'image',
    });
  }
});

module.exports = router;
