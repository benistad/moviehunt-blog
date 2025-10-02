const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Article, UrlQueue } = require('../models');
const articleGeneratorService = require('../services/articleGeneratorService');

/**
 * GET /api/import/films/available
{{ ... }}
 * Récupère la liste de tous les films disponibles sur MovieHunt
 */
router.get('/films/available', async (req, res, next) => {
  try {
    const films = await scraperService.getAllFilms();
    
    res.json({
      success: true,
      data: {
        films,
        count: films.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/import/films/bulk
 * Importe plusieurs films en une seule fois
 */
router.post('/films/bulk', async (req, res, next) => {
  try {
    const { slugs, limit } = req.body;
    
    let filmsToImport = [];
    
    if (slugs && Array.isArray(slugs)) {
      // Importer les slugs spécifiés
      filmsToImport = slugs;
    } else {
      // Importer tous les films disponibles (avec limite optionnelle)
      const allFilms = await scraperService.getAllFilms();
      filmsToImport = allFilms.map(f => f.slug);
      
      if (limit && limit > 0) {
        filmsToImport = filmsToImport.slice(0, limit);
      }
    }
    
    // Ajouter les films à la queue
    const addedToQueue = [];
    const alreadyExists = [];
    
    for (const slug of filmsToImport) {
      const url = scraperService.buildFilmUrl(slug);
      
      // Vérifier si déjà en queue ou déjà traité
      const existingQueue = await UrlQueue.findOne({ url });
      
      if (!existingQueue) {
        await UrlQueue.create({
          url,
          addedBy: 'auto',
          status: 'pending',
        });
        addedToQueue.push(slug);
      } else {
        alreadyExists.push(slug);
      }
    }
    
    res.json({
      success: true,
      data: {
        addedToQueue: addedToQueue.length,
        alreadyExists: alreadyExists.length,
        total: filmsToImport.length,
        slugs: {
          added: addedToQueue,
          existing: alreadyExists,
        },
      },
      message: `${addedToQueue.length} films ajoutés à la queue`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/import/films/all
 * Importe TOUS les films disponibles sur MovieHunt
 * ATTENTION: Peut prendre beaucoup de temps
 */
router.post('/films/all', async (req, res, next) => {
  try {
    const allFilms = await scraperService.getAllFilms();
    
    const addedToQueue = [];
    const alreadyExists = [];
    
    for (const film of allFilms) {
      const url = scraperService.buildFilmUrl(film.slug);
      
      const existingQueue = await UrlQueue.findOne({ url });
      
      if (!existingQueue) {
        await UrlQueue.create({
          url,
          addedBy: 'auto',
          status: 'pending',
        });
        addedToQueue.push(film.slug);
      } else {
        alreadyExists.push(film.slug);
      }
    }
    
    res.json({
      success: true,
      data: {
        totalFilms: allFilms.length,
        addedToQueue: addedToQueue.length,
        alreadyExists: alreadyExists.length,
      },
      message: `${addedToQueue.length} films ajoutés à la queue sur ${allFilms.length} disponibles`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/import/film/:slug
 * Importe un film spécifique par son slug
 */
router.post('/film/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { generateNow } = req.body;
    
    const url = scraperService.buildFilmUrl(slug);
    
    if (generateNow) {
      // Générer immédiatement
      const result = await articleGeneratorService.generateFromUrl(url, 'manual');
      
      res.status(201).json({
        success: true,
        data: result.article,
        message: 'Film importé et article généré avec succès',
      });
    } else {
      // Ajouter à la queue
      const existingQueue = await UrlQueue.findOne({ url });
      
      if (existingQueue) {
        return res.json({
          success: true,
          message: 'Film déjà en queue',
          data: existingQueue,
        });
      }
      
      const queueItem = await UrlQueue.create({
        url,
        addedBy: 'manual',
        status: 'pending',
      });
      
      res.status(201).json({
        success: true,
        data: queueItem,
        message: 'Film ajouté à la queue',
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/import/stats
 * Statistiques d'import
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [allFilms, queueCount, completedCount] = await Promise.all([
      scraperService.getAllFilms(),
      UrlQueue.countDocuments({ status: { $in: ['pending', 'processing'] } }),
      UrlQueue.countDocuments({ status: 'completed' }),
    ]);
    
    res.json({
      success: true,
      data: {
        availableOnMovieHunt: allFilms.length,
        inQueue: queueCount,
        imported: completedCount,
        remaining: allFilms.length - completedCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
