const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware pour ajouter les headers CORS sur toutes les réponses
router.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
  });
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

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
    
    // Définir les headers supplémentaires
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 an
    });
    
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Erreur proxy image:', error.message);
    res.status(404).json({ error: 'Image non trouvée' });
  }
});

module.exports = router;
