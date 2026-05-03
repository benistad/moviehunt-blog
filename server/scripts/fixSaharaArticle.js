require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OLD_SLUG = 'matthew-mcconaughey-et-penelope-cruz-dans-le-film-d-aventure-que-personne-ne-connait';
const NEW_SLUG = 'sahara-film-aventure-mcconaughey-2005';

const BACKDROP1 = 'https://image.tmdb.org/t/p/original/vRV5cKlfvqqPp86qhep72o1JMKk.jpg';
const BACKDROP2 = 'https://image.tmdb.org/t/p/original/yV2XwKndgi2JI4R7U1eoLNyT5KF.jpg';

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, content, seo, title')
    .eq('slug', OLD_SLUG)
    .single();

  if (error) { console.error('❌', error.message); process.exit(1); }
  console.log('✅ Article trouvé:', article.title);

  let content = article.content;

  // 1. Ajouter image backdrop après le 2e paragraphe d'introduction
  const imageIntro = `\n<figure class="image image-style-align-center"><img src="${BACKDROP1}" alt="Sahara (2005) — Matthew McConaughey dans un film d'aventure méconnu comme Indiana Jones" title="Sahara (2005) : McConaughey en aventurier dans le désert africain" /><figcaption>Sahara (2005) — Matthew McConaughey et Steve Zahn en pleine aventure</figcaption></figure>\n`;

  // Insérer après le 2e </p> de l'intro (après "Réalisé par Breck Eisner...")
  content = content.replace(
    /(<\/p>)(\s*<h2>C'est quoi Sahara)/,
    `$1${imageIntro}$2`
  );

  // 2. Ajouter image backdrop2 après la section synopsis (avant "Ce qui fonctionne")
  const imageSynopsis = `\n<figure class="image image-style-align-center"><img src="${BACKDROP2}" alt="Sahara (2005) — scène d'action avec McConaughey et Penélope Cruz dans le désert" title="Sahara (2005) : un film d'aventure dans la tradition des Indiana Jones" /><figcaption>Sahara (2005) — l'aventure en plein désert africain</figcaption></figure>\n`;

  content = content.replace(
    /(<\/p>)(\s*<h2>Ce qui fonctionne)/,
    `$1${imageSynopsis}$2`
  );

  // 3. Ajouter liens internes dans la section verdict
  // Lien vers "10 films méconnus Netflix" et "quel film regarder ce soir"
  content = content.replace(
    `Si vous avez aimé Benjamin Gates ou les Indiana Jones, Sahara vous plaira.`,
    `Si vous avez aimé Benjamin Gates ou les Indiana Jones, Sahara vous plaira. Et si vous cherchez d'autres pépites méconnues du même acabit, notre sélection des <a href="/article/10-films-meconnus-netflix-2026">meilleurs films méconnus sur Netflix</a> ou notre <a href="/article/quel-film-regarder-ce-soir-guide-2026">guide pour choisir quoi regarder ce soir</a> sont faits pour vous.`
  );

  // 4. Corriger le H2 "Conclusion" générique
  content = content.replace(
    '<h2>Conclusion</h2>',
    '<h2>Sahara (2005) : une pépite méconnue à (re)découvrir</h2>'
  );

  // 5. Mettre à jour les keywords SEO
  const updatedSeo = {
    ...article.seo,
    keywords: [
      'Sahara critique',
      'Sahara 2005 avis',
      'film Matthew McConaughey méconnu',
      'Penélope Cruz aventure',
      'film comme Indiana Jones',
      'film comme Indiana Jones 2005',
      'meilleur film aventure méconnu',
      'Sahara McConaughey film aventure',
      'film aventure chasse au trésor',
      'critique film aventure 2005',
    ],
    metaTitle: 'Sahara (2005) : film d\'aventure méconnu comme Indiana Jones',
    metaDescription: 'Critique de Sahara (2005), film d\'aventure avec Matthew McConaughey et Penélope Cruz. Le Indiana Jones méconnu à voir absolument.',
  };

  // 6. Mise à jour en base
  const { error: e2 } = await supabase
    .from('articles')
    .update({
      slug: NEW_SLUG,
      content,
      seo: updatedSeo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', article.id);

  if (e2) { console.error('❌ Update error:', e2.message); process.exit(1); }
  console.log('✅ Article mis à jour en base');
  console.log('  - Nouveau slug:', NEW_SLUG);
  console.log('  - Images TMDB ajoutées: 2');
  console.log('  - Liens internes ajoutés: 2');
  console.log('  - H2 Conclusion: corrigé');
  console.log('  - Keywords SEO: mis à jour');
}

run().catch(console.error);
