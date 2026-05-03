require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, content, seo')
    .eq('slug', 'send-help-survivre-n-est-qu-un-debut-sur-l-ile-deserte')
    .single();

  if (error) { console.error('❌', error.message); process.exit(1); }
  console.log('✅ Article trouvé');

  let content = article.content;

  // 1. Remplacer le H2 "Introduction" par H1
  content = content.replace('<h2>Introduction</h2>', '<h1>Send Help (2026) : Rachel McAdams contre son image, sur une île déserte</h1>');

  // 2. Ajouter le bloc Rachel McAdams après l'introduction (après la figure)
  const rachelBlock = `<h2>Rachel McAdams dans Send Help : un rôle à contre-emploi total</h2><p>Ce qui frappe d'emblée dans <i>Send Help</i>, c'est le pari pris sur Rachel McAdams. L'actrice, connue pour ses rôles glamours dans <i>Mean Girls</i>, <i>The Notebook</i> ou <i>Spotlight</i>, apparaît ici délibérément rendue ingrate : cheveux ternes et mal coiffés, teint terne, vêtements informes et sans forme. La chef décoratrice Chiara Tripodi a travaillé systématiquement contre la photogénie naturelle de l'actrice pour construire Linda Liddle, cette stratège d'entreprise que personne ne remarque.</p><p>C'est précisément ce contre-emploi qui rend le film fascinant. La transformation de Linda sur l'île — physique autant que psychologique — n'en est que plus saisissante : au fil des jours, le "déguisement" s'efface, et Rachel McAdams réapparaît littéralement sous nos yeux. Sam Raimi utilise ce mécanisme comme une métaphore visuelle de la libération du personnage. C'est l'une des utilisations les plus intelligentes d'une star que le cinéma récent ait proposée.</p>`;

  content = content.replace(
    /(<\/figure>)(\s*<h2>Synopsis)/,
    `$1\n${rachelBlock}\n$2`
  );

  // 3. Ajouter le bloc "Send Help et les meilleurs films de survie" avant la conclusion
  const survieBlock = `<h2>Send Help et les meilleurs films de survie sur île déserte</h2><p>Le film de survie sur île déserte est un sous-genre à part entière, avec ses codes et ses incontournables. <i>Send Help</i> s'inscrit dans cette tradition aux côtés de <i>Cast Away</i>, <i>The Beach</i> ou <i>Jungle</i>. Là où ces films misent souvent sur la solitude ou l'espoir, <i>Send Help</i> choisit d'explorer la tension entre les personnages comme moteur principal — un choix qui le distingue clairement de ses prédécesseurs. Pour les amateurs de films de survie en milieu hostile, <i>Send Help</i> est une option sérieuse. Il ne réinvente pas le genre, mais il en maîtrise les ressorts avec suffisamment de rigueur pour satisfaire les fans.</p>`;

  content = content.replace(
    /(<\/p>)(\s*<h2>Conclusion)/,
    `$1\n${survieBlock}\n$2`
  );

  // 4. Mettre à jour SEO
  const updatedSeo = {
    ...article.seo,
    metaTitle: 'Send Help (2026) : Rachel McAdams méconnaissable dans le thriller de survie de Sam Raimi',
    metaDescription: 'Rachel McAdams joue contre son image dans Send Help : volontairement ingrate, elle se transforme sous nos yeux sur une île déserte. Le pari le plus audacieux de sa carrière ? Notre avis.',
    keywords: [
      'Send Help critique',
      'Send Help 2026 avis',
      'Rachel McAdams Send Help',
      'Sam Raimi Send Help',
      'film survie île déserte',
      'film comme Cast Away',
      'thriller survie 2026',
      'Rachel McAdams contre-emploi',
      'film horreur comédie 2026',
      'critique film survie'
    ]
  };

  // 5. Mise à jour en base
  const { error: e2 } = await supabase
    .from('articles')
    .update({
      content,
      seo: updatedSeo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', article.id);

  if (e2) { console.error('❌ Update error:', e2.message); process.exit(1); }
  console.log('✅ Article Send Help mis à jour');
  console.log('  - H1 ajouté');
  console.log('  - Bloc Rachel McAdams ajouté');
  console.log('  - Bloc films de survie ajouté');
  console.log('  - Meta title: mis à jour');
  console.log('  - Meta description: mise à jour');
  console.log('  - Keywords: mis à jour');
}

run().catch(console.error);
