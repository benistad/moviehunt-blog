const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const articleGeneratorService = require('../services/articleGeneratorService');
const {
  urlValidation,
  articleIdValidation,
  articleUpdateValidation,
} = require('../middleware/validator');

/**
 * GET /api/articles
 * Liste tous les articles avec pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'published';
    const search = req.query.search || '';

    const query = { status };

    // Recherche textuelle si fournie
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-scrapedData'),
      Article.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/stats
 * Statistiques des articles
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await articleGeneratorService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/:id
 * Récupère un article par ID
 */
router.get('/:id', articleIdValidation, async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/slug/:slug
 * Récupère un article par slug
 */
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/articles/generate
 * Génère un nouvel article depuis une URL
 */
router.post('/generate', urlValidation, async (req, res, next) => {
  try {
    const { url } = req.body;

    const result = await articleGeneratorService.generateFromUrl(url, 'manual');

    res.status(201).json({
      success: true,
      data: result.article,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/articles/:id/regenerate
 * Régénère un article existant
 */
router.post('/:id/regenerate', articleIdValidation, async (req, res, next) => {
  try {
    const article = await articleGeneratorService.regenerateArticle(req.params.id);

    res.json({
      success: true,
      data: article,
      message: 'Article régénéré avec succès',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/articles/:id
 * Met à jour un article
 */
router.put('/:id', [...articleIdValidation, ...articleUpdateValidation], async (req, res, next) => {
  try {
    const updates = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }

    res.json({
      success: true,
      data: article,
      message: 'Article mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/articles/:id/publish
 * Publie un article (passe de draft à published)
 */
router.post('/:id/publish', articleIdValidation, async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }

    res.json({
      success: true,
      data: article,
      message: 'Article publié avec succès',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/articles/:id
 * Supprime un article
 */
router.delete('/:id', articleIdValidation, async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Article supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/tags/all
 * Récupère tous les tags uniques
 */
router.get('/tags/all', async (req, res, next) => {
  try {
    const tags = await Article.distinct('tags');
    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
