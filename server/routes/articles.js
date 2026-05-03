const express = require('express');
const axios = require('axios');

async function triggerRevalidation(slug, category) {
  const secret = process.env.REVALIDATION_SECRET;
  const siteUrl = process.env.NEXT_SITE_URL || 'https://www.moviehunt-blog.fr';
  if (!secret) return;
  try {
    await axios.post(`${siteUrl}/api/revalidate`, { secret, slug, type: category }, { timeout: 5000 });
    console.log(`✅ Revalidation déclenchée: /article/${slug}`);
  } catch (e) {
    console.warn(`⚠️ Revalidation échouée pour ${slug}: ${e.message}`);
  }
}
const router = express.Router();
const { Article } = require('../models');
const articleGeneratorService = require('../services/articleGeneratorService');
const aiService = require('../services/aiService');
const {
  urlValidation,
  articleIdValidation,
  articleUpdateValidation,
} = require('../middleware/validator');
const requireAuth = require('../middleware/requireAuth');

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
    const category = req.query.category;

    const query = { status };

    // Filtre par catégorie si fourni
    if (category) {
      query.category = category;
    }

    // Recherche textuelle si fournie
    if (search) {
      query.search = search;
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

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
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

    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
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
router.post('/generate', requireAuth, urlValidation, async (req, res, next) => {
  try {
    const { url, customInstructions } = req.body;

    const result = await articleGeneratorService.generateFromUrl(url, 'manual', customInstructions);

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
 * POST /api/articles/generate-from-prompt
 * Génère un nouvel article depuis un prompt libre
 */
router.post('/generate-from-prompt', requireAuth, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const tmdbService = require('../services/tmdbService');

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le prompt est requis',
      });
    }

    console.log(`📝 Génération d'article depuis prompt: "${prompt.substring(0, 100)}..."`);

    // Extraire les titres de films du prompt avec une regex simple
    // Cherche les patterns : "Titre (année)", numérotés "1. Titre", ou après des emojis
    const filmTitlePatterns = [
      /(?:^|\n)\s*(?:\d+\.\s+|[🎬🔥🧠😱🧩🌀💥😨🕵️⭐]+\s+)([A-ZÀ-Ÿa-zà-ÿ][^(\n]+?)(?:\s*\((\d{4})\))?(?:\n|$)/gm,
    ];

    const extractedFilms = new Map();
    for (const pattern of filmTitlePatterns) {
      let match;
      while ((match = pattern.exec(prompt)) !== null) {
        const title = match[1].trim().replace(/\*+/g, '');
        const year = match[2] || null;
        if (title.length > 2 && title.length < 80) {
          extractedFilms.set(title, year);
        }
      }
    }

    console.log(`🎬 Films détectés dans le prompt: ${[...extractedFilms.keys()].join(', ')}`);

    // Appeler TMDB pour chaque film détecté
    const tmdbImagesMap = {};
    for (const [title, year] of extractedFilms.entries()) {
      try {
        const tmdbData = await tmdbService.enrichMovieData(title, year);
        if (tmdbData) {
          tmdbImagesMap[title] = {
            backdrop: tmdbData.backdropUrl || null,
            poster: tmdbData.posterUrl || null,
            year: tmdbData.year || year,
            genres: tmdbData.genres?.join(', ') || '',
          };
          console.log(`✅ TMDB trouvé pour "${title}"`);
        }
      } catch (err) {
        console.warn(`⚠️ TMDB non trouvé pour "${title}": ${err.message}`);
      }
    }

    console.log(`🖼️ Images TMDB récupérées pour ${Object.keys(tmdbImagesMap).length} films`);

    // Générer l'article avec l'IA en injectant les images TMDB
    const generatedArticle = await aiService.generateArticleFromPrompt(prompt, tmdbImagesMap);

    // Créer un slug à partir du titre
    const slug = generatedArticle.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Créer l'article en base de données
    const article = await Article.create({
      title: generatedArticle.title,
      slug,
      excerpt: generatedArticle.excerpt,
      content: generatedArticle.content,
      tags: generatedArticle.tags,
      status: 'draft',
      seo: generatedArticle.seo,
      coverImage: generatedArticle.coverImage,
      sourceUrl: '', // Pas de source URL pour les articles générés par prompt
      metadata: {
        generatedFromPrompt: true,
        originalPrompt: prompt,
      },
    });

    console.log(`✅ Article créé en brouillon: ${article._id}`);

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article généré avec succès depuis le prompt',
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération depuis prompt:', error);
    next(error);
  }
});

/**
 * POST /api/articles/:id/regenerate
 * Régénère un article existant
 */
router.post('/:id/regenerate', requireAuth, articleIdValidation, async (req, res, next) => {
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
router.put('/:id', requireAuth, [...articleIdValidation, ...articleUpdateValidation], async (req, res, next) => {
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

    if (article.status === 'published') {
      triggerRevalidation(article.slug, article.category).catch(() => {});
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/articles/:id/publish
 * Publie un article (passe de draft à published)
 */
router.post('/:id/publish', requireAuth, articleIdValidation, async (req, res, next) => {
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

    triggerRevalidation(article.slug, article.category).catch(() => {});
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/articles/:id
 * Supprime un article
 */
router.delete('/:id', requireAuth, articleIdValidation, async (req, res, next) => {
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
