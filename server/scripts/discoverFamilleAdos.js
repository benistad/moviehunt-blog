require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function discover() {
  const searches = [
    { label: 'FAMILLE', slug: 'quel-film-regarder-en-famille' },
    { label: 'ADOS',    slug: 'idee-de-film-pour-ado-10-films-incontournables' },
  ];

  for (const { label, slug } of searches) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📂 ${label}`);
    console.log('═'.repeat(60));

    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, content, seo')
      .eq('slug', slug);

    if (error || !articles?.length) {
      console.log(`❌ Aucun article trouvé pour "${pattern}"`);
      continue;
    }

    for (const article of articles) {
      console.log(`\n🔖 Titre  : ${article.title}`);
      console.log(`   Slug   : ${article.slug}`);
      console.log(`   Taille : ${article.content.length} caractères`);

      const h2s = [...article.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
      console.log(`\n📋 Sections H2 actuelles :`);
      h2s.forEach((h, i) => console.log(`   ${i + 1}. ${h}`));

      // Extraire les titres de films en gras
      const boldFilms = [...new Set(
        [...article.content.matchAll(/<strong>(.*?)<\/strong>/gi)]
          .map(m => m[1])
          .filter(t => t.length > 2 && t.length < 60 && !t.match(/^(Pourquoi|Si vous|Le film|Pour les|Note|Attention|Important)/i))
      )];
      console.log(`\n🎬 Films/titres en gras détectés (${boldFilms.length}) :`);
      boldFilms.slice(0, 30).forEach(f => console.log(`   - ${f}`));

      console.log(`\n📝 SEO actuel :`);
      console.log(`   metaTitle       : ${article.seo?.metaTitle || '(non défini)'}`);
      console.log(`   metaDescription : ${article.seo?.metaDescription || '(non défini)'}`);
    }
  }
}

discover().catch(console.error);
