const express = require('express');
const router = express.Router();
const { UrlQueue } = require('../models');
const articleGeneratorService = require('../services/articleGeneratorService');

/**
 * GET /api/queue
 * Liste les URLs en queue
 */
router.get('/', async (req, res, next) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};

    const queueItems = await UrlQueue.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('articleId', 'title slug');

    res.json({
      success: true,
      data: queueItems,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/queue/process
 * Traite les URLs en attente
 */
router.post('/process', async (req, res, next) => {
  try {
    const limit = parseInt(req.body.limit) || 5;
    const results = await articleGeneratorService.processQueue(limit);

    res.json({
      success: true,
      data: results,
      message: `${results.length} URLs traitées`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/queue/retry
 * Réessaye les URLs en échec
 */
router.post('/retry', async (req, res, next) => {
  try {
    await articleGeneratorService.retryFailed();

    res.json({
      success: true,
      message: 'Nouvelle tentative lancée pour les URLs en échec',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/queue/:id
 * Supprime une entrée de la queue
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const queueItem = await UrlQueue.findByIdAndDelete(req.params.id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        error: 'Entrée non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Entrée supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
