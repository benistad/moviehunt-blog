require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, slug, content')
    .eq('slug', 'idee-de-film-pour-ado-10-films-incontournables')
    .single();

  if (error || !article) { console.error('❌', error?.message); process.exit(1); }

  console.log(`\n📄 CONTENU BRUT (${article.content.length} chars) :\n`);
  console.log(article.content);
}

run().catch(console.error);
