const { Article, UrlQueue } = require('../models');
const scraperService = require('./scraperService');
const aiService = require('./aiService');
const tmdbService = require('./tmdbService');

class ArticleGeneratorService {
  /**
   * Génère un article complet depuis une URL
   */
  async generateFromUrl(url, addedBy = 'manual') {
    let queueItem = null;

    try {
      console.log(`📝 Début de génération pour: ${url}`);

      // Vérifier si l'URL est valide
      if (!scraperService.isValidMovieHuntUrl(url)) {
        throw new Error('URL invalide: doit être une URL de moviehunt.fr');
      }

      // Vérifier si l'article existe déjà
      const existingArticle = await Article.findOne({ sourceUrl: url });
      if (existingArticle) {
        console.log(`⚠️ Article déjà existant pour cette URL`);
        return {
          success: true,
          article: existingArticle,
          message: 'Article déjà existant',
        };
      }

      // Ajouter à la queue ou récupérer l'entrée existante
      queueItem = await UrlQueue.findOne({ url });
      if (!queueItem) {
        queueItem = await UrlQueue.create({
          url,
          addedBy,
          status: 'pending',
        });
      }

      // Mettre à jour le statut
      queueItem.status = 'processing';
      await queueItem.save();

      // Étape 1: Scraper l'URL
      const scrapedData = await scraperService.scrapeUrl(url);

      // Étape 1.5: Enrichir avec les données TMDB
      const movieTitle = scrapedData.metadata?.movieTitle || scrapedData.title;
      const movieYear = scrapedData.metadata?.releaseYear;
      
      let tmdbData = null;
      if (movieTitle) {
        tmdbData = await tmdbService.enrichMovieData(movieTitle, movieYear);
        
        if (tmdbData) {
          console.log(`✅ Données TMDB récupérées pour "${movieTitle}"`);
          
          // Enrichir les métadonnées avec TMDB
          scrapedData.metadata = {
            ...scrapedData.metadata,
            tmdbSynopsis: tmdbData.synopsis,
            tmdbRating: tmdbData.voteAverage,
            runtime: tmdbData.runtime,
            budget: tmdbData.budget,
            revenue: tmdbData.revenue,
            tagline: tmdbData.tagline,
          };
          
          // Utiliser les images TMDB si disponibles
          if (tmdbData.backdropUrl) {
            scrapedData.images = [tmdbData.backdropUrl, tmdbData.posterUrl, ...scrapedData.images];
          }
          
          // Enrichir le casting
          if (tmdbData.cast && tmdbData.cast.length > 0) {
            scrapedData.metadata.actors = tmdbData.cast.map(c => c.name);
          }
          
          if (tmdbData.director) {
            scrapedData.metadata.director = tmdbData.director.name;
          }
        }
      }

      // Étape 2: Générer l'article avec l'IA
      const generatedArticle = await aiService.generateArticle(scrapedData, url);

      // Étape 3: Créer l'article dans la base de données (en brouillon par défaut)
      const article = await Article.create({
        title: generatedArticle.title,
        content: generatedArticle.content,
        excerpt: generatedArticle.excerpt,
        sourceUrl: url,
        scrapedData: scrapedData,
        coverImage: generatedArticle.coverImage,
        tags: generatedArticle.tags,
        metadata: generatedArticle.metadata,
        seo: generatedArticle.seo,
        status: 'draft', // Créé en brouillon par défaut
        generatedBy: addedBy,
      });

      // Mettre à jour la queue
      queueItem.status = 'completed';
      queueItem.articleId = article._id;
      queueItem.processedAt = new Date();
      await queueItem.save();

      console.log(`✅ Article généré avec succès: ${article.title}`);

      return {
        success: true,
        article,
        message: 'Article généré avec succès',
      };
    } catch (error) {
      console.error(`❌ Erreur de génération: ${error.message}`);

      // Mettre à jour la queue en cas d'erreur
      if (queueItem) {
        queueItem.status = 'failed';
        queueItem.error = error.message;
        queueItem.retryCount += 1;
        await queueItem.save();
      }

      throw error;
    }
  }

  /**
   * Traite les URLs en attente dans la queue
   */
  async processQueue(limit = 5) {
    try {
      const pendingUrls = await UrlQueue.find({ status: 'pending' })
        .limit(limit)
        .sort({ createdAt: 1 });

      console.log(`📋 Traitement de ${pendingUrls.length} URLs en attente`);

      const results = [];

      for (const urlItem of pendingUrls) {
        try {
          const result = await this.generateFromUrl(urlItem.url, urlItem.addedBy);
          results.push({
            url: urlItem.url,
            success: true,
            articleId: result.article._id,
          });
        } catch (error) {
          results.push({
            url: urlItem.url,
            success: false,
            error: error.message,
          });
        }

        // Pause entre chaque génération pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      return results;
    } catch (error) {
      console.error(`❌ Erreur de traitement de la queue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Réessaye les URLs en échec
   */
  async retryFailed(maxRetries = 3) {
    try {
      const failedUrls = await UrlQueue.find({
        status: 'failed',
        retryCount: { $lt: maxRetries },
      }).limit(10);

      console.log(`🔄 Nouvelle tentative pour ${failedUrls.length} URLs en échec`);

      for (const urlItem of failedUrls) {
        try {
          await this.generateFromUrl(urlItem.url, urlItem.addedBy);
        } catch (error) {
          console.error(`❌ Échec de la nouvelle tentative pour ${urlItem.url}`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Erreur de réessai: ${error.message}`);
      throw error;
    }
  }

  /**
   * Régénère un article existant
   */
  async regenerateArticle(articleId) {
    try {
      const article = await Article.findById(articleId);
      if (!article) {
        throw new Error('Article non trouvé');
      }

      console.log(`🔄 Régénération de l'article: ${article.title}`);

      // Scraper à nouveau l'URL
      const scrapedData = await scraperService.scrapeUrl(article.sourceUrl);

      // Générer un nouveau contenu
      const generatedArticle = await aiService.generateArticle(scrapedData, article.sourceUrl);

      // Mettre à jour l'article
      article.title = generatedArticle.title;
      article.content = generatedArticle.content;
      article.excerpt = generatedArticle.excerpt;
      article.scrapedData = scrapedData;
      article.coverImage = generatedArticle.coverImage;
      article.tags = generatedArticle.tags;
      article.metadata = generatedArticle.metadata;
      article.seo = generatedArticle.seo;

      await article.save();

      console.log(`✅ Article régénéré avec succès`);

      return article;
    } catch (error) {
      console.error(`❌ Erreur de régénération: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtient les statistiques de génération
   */
  async getStats() {
    try {
      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        pendingUrls,
        processingUrls,
        failedUrls,
      ] = await Promise.all([
        Article.countDocuments(),
        Article.countDocuments({ status: 'published' }),
        Article.countDocuments({ status: 'draft' }),
        UrlQueue.countDocuments({ status: 'pending' }),
        UrlQueue.countDocuments({ status: 'processing' }),
        UrlQueue.countDocuments({ status: 'failed' }),
      ]);

      return {
        articles: {
          total: totalArticles,
          published: publishedArticles,
          draft: draftArticles,
        },
        queue: {
          pending: pendingUrls,
          processing: processingUrls,
          failed: failedUrls,
        },
      };
    } catch (error) {
      console.error(`❌ Erreur de récupération des stats: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ArticleGeneratorService();
