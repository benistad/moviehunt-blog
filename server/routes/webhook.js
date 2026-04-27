const express = require('express');
const router = express.Router();
const articleGeneratorService = require('../services/articleGeneratorService');
const { urlValidation } = require('../middleware/validator');

/**
 * POST /api/webhook/moviehunt
 * Webhook pour recevoir les notifications de nouvelles pages MovieHunt
 * 
 * Format attendu:
 * {
 *   "url": "https://moviehunt.fr/...",
 *   "event": "page.created",
 *   "timestamp": "2025-09-30T15:24:10+02:00"
 * }
 */
router.post('/moviehunt', urlValidation, async (req, res, next) => {
  try {
    // Vérification du secret partagé pour empêcher tout déclenchement non autorisé
    const expected = process.env.WEBHOOK_SECRET;
    const provided = req.headers['x-webhook-secret'];
    if (!expected || provided !== expected) {
      return res.status(401).json({
        success: false,
        error: 'Webhook non autorisé',
      });
    }

    const { url, event } = req.body;

    console.log(`🔔 Webhook reçu: ${event} - ${url}`);

    // Vérifier le type d'événement
    if (event !== 'page.created' && event !== 'page.updated') {
      return res.status(400).json({
        success: false,
        error: 'Type d\'événement non supporté',
      });
    }

    // Générer l'article de manière asynchrone
    articleGeneratorService.generateFromUrl(url, 'webhook')
      .then(result => {
        console.log(`✅ Article généré depuis webhook: ${result.article.title}`);
      })
      .catch(error => {
        console.error(`❌ Erreur de génération depuis webhook: ${error.message}`);
      });

    // Répondre immédiatement au webhook
    res.status(202).json({
      success: true,
      message: 'Webhook reçu, génération en cours',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/webhook/health
 * Endpoint de santé pour vérifier que le webhook fonctionne
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook opérationnel',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
