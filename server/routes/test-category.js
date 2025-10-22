const express = require('express');
const router = express.Router();
const Article = require('../models/supabase/Article');

/**
 * POST /api/test-category
 * Endpoint de test pour vérifier la sauvegarde de category
 */
router.post('/', async (req, res) => {
  try {
    const { articleId, category } = req.body;
    
    if (!articleId || !category) {
      return res.status(400).json({
        success: false,
        error: 'articleId et category sont requis',
      });
    }

    const logs = [];
    
    logs.push(`📝 Test de mise à jour de category`);
    logs.push(`📝 Article ID: ${articleId}`);
    logs.push(`📝 Nouvelle category: ${category}`);
    
    // Récupérer l'article avant
    const articleBefore = await Article.findById(articleId);
    logs.push(`📝 Category AVANT: ${articleBefore.category}`);
    
    // Mettre à jour
    const articleAfter = await Article.findByIdAndUpdate(
      articleId,
      { category },
      { new: true }
    );
    
    logs.push(`📝 Category APRÈS: ${articleAfter.category}`);
    logs.push(`✅ Mise à jour ${articleBefore.category === articleAfter.category ? 'ÉCHOUÉE' : 'RÉUSSIE'}`);
    
    res.json({
      success: true,
      logs,
      before: {
        id: articleBefore._id,
        title: articleBefore.title,
        category: articleBefore.category,
      },
      after: {
        id: articleAfter._id,
        title: articleAfter.title,
        category: articleAfter.category,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
