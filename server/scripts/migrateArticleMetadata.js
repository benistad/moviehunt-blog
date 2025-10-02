/**
 * Script de migration pour ajouter le score dans les métadonnées des articles existants
 * 
 * Ce script récupère tous les articles qui ont un score dans scrapedData
 * mais pas dans metadata, et met à jour leurs métadonnées.
 */

require('dotenv').config();
const { Article } = require('../models');

async function migrateArticleMetadata() {
  try {
    console.log('🔄 Début de la migration des métadonnées des articles...\n');

    // Récupérer tous les articles
    const articles = await Article.find({});
    console.log(`📊 ${articles.length} article(s) trouvé(s)\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const article of articles) {
      const needsUpdate = article.scrapedData?.metadata?.score && !article.metadata?.score;

      if (needsUpdate) {
        console.log(`📝 Mise à jour: "${article.title}"`);
        console.log(`   Score: ${article.scrapedData.metadata.score}/10`);

        // Mettre à jour les métadonnées
        const updatedMetadata = {
          ...article.metadata,
          score: article.scrapedData.metadata.score,
          hunted: article.scrapedData.metadata.hunted || false,
          hiddenGem: article.scrapedData.metadata.hiddenGem || false,
        };

        // Si les métadonnées sont vides, copier toutes les métadonnées du scrapedData
        if (!article.metadata || Object.keys(article.metadata).length === 0) {
          Object.assign(updatedMetadata, {
            movieTitle: article.scrapedData.metadata.movieTitle,
            releaseYear: article.scrapedData.metadata.releaseYear,
            genre: article.scrapedData.metadata.genre,
            director: article.scrapedData.metadata.director,
            actors: article.scrapedData.metadata.actors,
          });
        }

        await Article.findByIdAndUpdate(
          article.id,
          { metadata: updatedMetadata },
          { new: true }
        );

        updatedCount++;
        console.log(`   ✅ Métadonnées mises à jour\n`);
      } else if (article.metadata?.score) {
        console.log(`⏭️  Ignoré: "${article.title}" (score déjà présent: ${article.metadata.score}/10)`);
        skippedCount++;
      } else {
        console.log(`⚠️  Ignoré: "${article.title}" (pas de score dans scrapedData)`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`✅ Articles mis à jour: ${updatedCount}`);
    console.log(`⏭️  Articles ignorés: ${skippedCount}`);
    console.log(`📈 Total: ${articles.length}`);
    console.log('='.repeat(60));

    if (updatedCount > 0) {
      console.log('\n✨ Migration terminée avec succès !');
      console.log('💡 Les logos de notation s\'afficheront maintenant sur ces articles.');
    } else {
      console.log('\n💡 Aucune mise à jour nécessaire.');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateArticleMetadata()
  .then(() => {
    console.log('\n👋 Migration terminée. Vous pouvez fermer ce script.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
