const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy pour les images TMDB
router.get('/image/*', async (req, res) => {
  try {
    const imagePath = req.params[0];
    const imageUrl = `https://image.tmdb.org/t/p/original/${imagePath}`;
    
    // Récupérer l'image depuis TMDB
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // Définir les headers CORS et cache
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000', // Cache 1 an
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    });
    
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Erreur proxy image:', error.message);
    res.status(404).json({ error: 'Image non trouvée' });
  }
});

module.exports = router;
