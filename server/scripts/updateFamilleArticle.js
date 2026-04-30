require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SLUG = 'quel-film-regarder-en-famille';

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, seo')
    .eq('slug', SLUG)
    .single();

  if (error || !article) { console.error('❌', error?.message); process.exit(1); }
  console.log(`✅ Article : "${article.title}"`);

  /* ── Extraire les blocs de chaque film ─────────────────────────────── */
  const filmBlocks = {};
  const sections = article.content.split(/(?=<h2[^>]*>)/i);
  for (const block of sections) {
    const h2 = block.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (h2) filmBlocks[h2[1].trim()] = block;
  }

  // Regroupements thématiques
  const FILMS_AVENTURE   = ['1. Roudram Ranam Rudhiram (RRR)', '2. Jungle Cruise', '3. Free Guy', '8. Hunt for the Wilderpeople'];
  const FILMS_DIX_ANS    = ['9. Captain Fantastic', '10. October Sky', '4. Dans l\'ombre de Mary', '5. Jusqu\'au bout du rêve'];
  const FILMS_CLASSIQUES = ['11. Seabiscuit', '7. Newsies', '6. Le Fondateur'];

  const getBlock = (key) => filmBlocks[key] || '';
  const allFilmNames = Object.keys(filmBlocks).filter(k => /^\d+\./.test(k));

  /* ── Nouveau contenu HTML ────────────────────────────────────────────── */
  const newContent = `<h2>Quel film regarder en famille ce soir ?</h2>
<p>Quel film regarder en famille ce soir ? Voici une sélection rapide selon ce que vous cherchez :</p>
<ol>
<li><strong>RRR</strong> — aventure/action épique, idéal dès 12 ans, disponible sur Netflix</li>
<li><strong>Captain Fantastic</strong> — drame touchant, idéal dès 10 ans, disponible sur Prime Video</li>
<li><strong>Hunt for the Wilderpeople</strong> — aventure comique, idéal dès 10 ans, disponible sur Netflix</li>
<li><strong>Free Guy</strong> — comédie d'action, idéal dès 10 ans, disponible sur Disney+</li>
<li><strong>Jungle Cruise</strong> — aventure familiale, idéal dès 8 ans, disponible sur Disney+</li>
</ol>

<h2>Nos idées de films en famille avec des enfants dès 10 ans</h2>
<p>Les enfants à partir de 10 ans peuvent accéder à des films plus ambitieux, avec des intrigues plus complexes et des émotions plus nuancées. Voici nos recommandations pour une soirée ciné-club en famille avec des enfants de cet âge.</p>
${getBlock('9. Captain Fantastic')}
${getBlock('10. October Sky')}
${getBlock('4. Dans l\'ombre de Mary')}
${getBlock('5. Jusqu\'au bout du rêve')}

<h2>Les meilleurs films d'aventure à voir en famille</h2>
<p>Le film d'aventure reste le genre le plus consensuel pour une soirée en famille : assez palpitant pour les ados, accessible pour les plus jeunes, et rarement ennuyeux pour les parents. Voici nos incontournables.</p>
${getBlock('1. Roudram Ranam Rudhiram (RRR)')}
${getBlock('2. Jungle Cruise')}
${getBlock('3. Free Guy')}
${getBlock('8. Hunt for the Wilderpeople')}

<h2>Idées de films en famille selon votre humeur</h2>
<p>Selon l'humeur du moment, voici comment orienter votre choix :</p>
<p><strong>Vous voulez rire ensemble →</strong> <strong>Free Guy</strong>, <strong>Jungle Cruise</strong>, <strong>Newsies</strong></p>
<p><strong>Vous voulez vivre une aventure →</strong> <strong>RRR</strong>, <strong>Hunt for the Wilderpeople</strong></p>
<p><strong>Vous voulez un film qui fait réfléchir →</strong> <strong>Captain Fantastic</strong>, <strong>Le Fondateur</strong></p>
<p><strong>Vous voulez un classique indémodable →</strong> <strong>Seabiscuit</strong>, <strong>October Sky</strong></p>

<h2>Films en famille à voir absolument au moins une fois</h2>
<p>Certains films transcendent les générations et méritent d'être vus ensemble au moins une fois. Ces incontournables sont accessibles dès 8-10 ans et laissent généralement une impression durable, aussi bien chez les enfants que chez les adultes.</p>
${getBlock('9. Captain Fantastic')}
${getBlock('8. Hunt for the Wilderpeople')}
${getBlock('11. Seabiscuit')}

<h2>Questions fréquentes sur les films en famille</h2>
<p><strong>Quel film regarder en famille ce soir ?</strong><br>
Pour une soirée rapide à choisir : <strong>RRR</strong> pour de l'action et de l'aventure (dès 12 ans, Netflix), <strong>Free Guy</strong> pour rire ensemble (dès 10 ans, Disney+), ou <strong>Captain Fantastic</strong> pour un film qui touche et fait réfléchir (dès 10 ans, Prime Video).</p>
<p><strong>Quel film regarder en famille avec des enfants de 10 ans ?</strong><br>
À partir de 10 ans, <strong>Captain Fantastic</strong> et <strong>October Sky</strong> sont d'excellentes options : des films avec de vrais personnages, de vraies émotions, accessibles et stimulants pour cet âge.</p>
<p><strong>Quel film d'aventure regarder en famille ?</strong><br>
Pour une soirée aventure, <strong>Hunt for the Wilderpeople</strong> est notre recommandation numéro 1 : drôle, touchant, accessible dès 10 ans. Pour les familles qui veulent du grand spectacle, <strong>RRR</strong> est un choc cinématographique comme rarement.</p>
<p><strong>Quel film familial convient à tous les âges ?</strong><br>
<strong>Jungle Cruise</strong> reste l'option la plus universelle : accessible dès 8 ans, rythmé, avec suffisamment d'humour pour que les parents restent éveillés.</p>`;

  /* ── SEO + schemas ───────────────────────────────────────────────────── */
  const newSeo = {
    metaTitle: 'Quel film regarder en famille ce soir ? Nos meilleures idées | MovieHunt',
    metaDescription: 'Films d'aventure, comédies, classiques... On vous aide à choisir le film parfait pour une soirée en famille, selon l'âge de vos enfants et votre humeur du moment.',
    keywords: ['film en famille', 'quel film regarder en famille', 'film famille enfants 10 ans',
      'film aventure famille', 'film famille ce soir', 'RRR', 'Captain Fantastic', 'Hunt for the Wilderpeople'],
    faq: [
      { question: 'Quel film regarder en famille ce soir ?',
        answer: 'RRR (Netflix, dès 12 ans), Free Guy (Disney+, dès 10 ans) ou Captain Fantastic (Prime Video, dès 10 ans) sont trois excellents choix selon votre humeur.' },
      { question: 'Quel film regarder en famille avec des enfants de 10 ans ?',
        answer: 'Captain Fantastic et October Sky sont idéaux dès 10 ans : accessibles, émouvants et stimulants.' },
      { question: 'Quel film d\'aventure regarder en famille ?',
        answer: 'Hunt for the Wilderpeople (dès 10 ans) et RRR (dès 12 ans) sont nos recommandations prioritaires pour une soirée aventure en famille.' },
      { question: 'Quel film familial convient à tous les âges ?',
        answer: 'Jungle Cruise est la valeur sûre universelle : accessible dès 8 ans, rythmé et amusant pour toute la famille.' },
    ],
    itemList: [
      { name: 'RRR (Roudram Ranam Rudhiram)' },
      { name: 'Jungle Cruise' },
      { name: 'Free Guy' },
      { name: 'Dans l\'ombre de Mary' },
      { name: 'Jusqu\'au bout du rêve' },
      { name: 'Le Fondateur' },
      { name: 'Newsies' },
      { name: 'Hunt for the Wilderpeople' },
      { name: 'Captain Fantastic' },
      { name: 'October Sky' },
      { name: 'Seabiscuit' },
    ],
    itemListName: 'Meilleurs films à regarder en famille',
  };

  const { error: updateError } = await supabase
    .from('articles')
    .update({
      title: 'Quel film regarder en famille ce soir ? Nos meilleures idées par âge et par humeur',
      content: newContent,
      seo: newSeo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', article.id);

  if (updateError) { console.error('❌', updateError.message); process.exit(1); }

  console.log('🎉 Article FAMILLE mis à jour !');
  console.log(`   Titre : Quel film regarder en famille ce soir ? Nos meilleures idées par âge et par humeur`);
  console.log(`   Taille contenu : ${newContent.length} caractères`);
}

run().catch(console.error);
