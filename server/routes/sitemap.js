const express = require('express');
const router = express.Router();
const { Article } = require('../models');

/**
 * GET /api/sitemap.xml
 * Génère le sitemap XML dynamiquement
 */
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    // Force l'URL de production
    const siteUrl = 'https://www.moviehunt-blog.fr';
    
    // Récupérer tous les articles publiés
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .exec();

    // Générer le XML du sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Page d'accueil
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}/</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // Articles
    articles.forEach(article => {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/article/${article.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(article.updatedAt || article.publishedAt).toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
