require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateArticleCover() {
  const articleSlug = '10-films-meconnus-netflix-2026';
  const newCoverImage = '/images/10-films-netflix-2026.png';
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({ cover_image: newCoverImage })
      .eq('slug', articleSlug)
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }
    
    console.log('✅ Image de couverture mise à jour avec succès!');
    console.log(`📄 Article: ${data[0].title}`);
    console.log(`🖼️  Nouvelle cover_image: ${data[0].cover_image}`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

updateArticleCover().catch(console.error);
