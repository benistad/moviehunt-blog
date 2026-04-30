require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SLUG = 'idee-de-film-pour-ado-10-films-incontournables';

/* ── Descriptions extraites du contenu existant ───────────────────────── */

const FILMS = {
  trumanShow: `<h3>The Truman Show (1998)</h3>
<p>Un homme mène une vie parfaite… jusqu'à ce qu'il découvre qu'il vit dans un immense plateau télé. À la fois drôle, troublant et visionnaire, <strong>The Truman Show</strong> questionne notre rapport à l'image et à la liberté. Jim Carrey y livre une performance magistrale, loin de ses rôles comiques habituels.</p>
<p><strong>Pourquoi le voir ?</strong> Un film que tout ado devrait voir au moins une fois pour réfléchir à ce qu'est vivre vraiment. Disponible sur <strong>Netflix</strong>.</p>`,

  readyPlayerOne: `<h3>Ready Player One (2018)</h3>
<p>Bienvenue dans l'OASIS, un monde virtuel où tout est possible. Spielberg signe une aventure épique bourrée de références à la pop culture. Les effets visuels sont spectaculaires et l'histoire pose des questions pertinentes sur notre rapport au virtuel.</p>
<p><strong>Pourquoi le voir ?</strong> Le film parfait pour les ados gamers ou rêveurs. Disponible sur <strong>Disney+ (Star)</strong>.</p>`,

  cerclePiotes: `<h3>Le Cercle des poètes disparus (1989)</h3>
<p>Un professeur hors du commun enseigne à ses élèves à penser par eux-mêmes. Derrière les blazers et les vers de poésie se cache une réflexion puissante sur la pression scolaire, la liberté et la passion. Robin Williams y est inoubliable dans le rôle du professeur Keating.</p>
<p><strong>Pourquoi le voir ?</strong> Un classique bouleversant qui continue d'inspirer des générations. <em>Carpe Diem !</em> Disponible sur <strong>Prime Video</strong>.</p>`,

  meanGirls: `<h3>Mean Girls (2004)</h3>
<p>Au lycée, les apparences règnent… et les "Plastics" dictent la loi. <strong>Mean Girls</strong> reste la comédie culte sur les clans, la popularité et la recherche d'identité. Derrière l'humour, une vraie satire des codes adolescents.</p>
<p><strong>Pourquoi le voir ?</strong> Indispensable pour une soirée fun mais pas si légère qu'elle en a l'air. Les répliques sont devenues iconiques. Disponible sur <strong>Netflix</strong>.</p>`,

  mondeCharlie: `<h3>Le Monde de Charlie (2012)</h3>
<p>Un adolescent timide tente de trouver sa place après un passé difficile. Porté par Logan Lerman, Emma Watson et Ezra Miller, ce film parle de solitude, d'amitié et de renaissance avec une sincérité rare.</p>
<p><strong>Pourquoi le voir ?</strong> Un film qui touche droit au cœur. Parfait pour ceux qui se sentent différents ou en décalage. Disponible sur <strong>Netflix</strong>.</p>`,

  hungerGames: `<h3>Hunger Games (2012)</h3>
<p>Katniss Everdeen, héroïne courageuse d'un monde où les adolescents s'affrontent pour survivre. Derrière l'action spectaculaire, <strong>Hunger Games</strong> aborde la résistance, la manipulation médiatique et la soif de liberté. Jennifer Lawrence est parfaite dans ce rôle.</p>
<p><strong>Pourquoi le voir ?</strong> Une saga forte et inspirante avec une héroïne féminine puissante. Disponible sur <strong>Netflix</strong>.</p>`,

  wayWayBack: `<h3>The Way Way Back (2013)</h3>
<p>Un adolescent mal dans sa peau passe l'été dans une station balnéaire où il trouve un job inattendu dans un parc aquatique. Steve Carell et Sam Rockwell sont excellents.</p>
<p><strong>Pourquoi le voir ?</strong> Drôle, touchant et sincère : un vrai petit bijou de cinéma indépendant. Disponible sur <strong>Prime Video</strong>.</p>`,

  singStreet: `<h3>Sing Street (2016)</h3>
<p>Dans le Dublin des années 80, un ado monte un groupe pour impressionner une fille. Un film musical plein d'énergie et d'émotion, avec une bande-son irrésistible.</p>
<p><strong>Pourquoi le voir ?</strong> Parfait pour ceux qui rêvent de liberté et de création. Les chansons sont addictives et l'histoire est touchante. Disponible sur <strong>Netflix</strong>.</p>`,

  spectacularNow: `<h3>The Spectacular Now (2013)</h3>
<p>Deux adolescents que tout oppose apprennent à se connaître. Ce drame doux-amer aborde la transition vers l'âge adulte avec une justesse rare. Miles Teller et Shailene Woodley sont remarquables.</p>
<p><strong>Pourquoi le voir ?</strong> Un film sensible sur les doutes et les premiers choix de vie. Disponible sur <strong>Prime Video</strong>.</p>`,

  chronicle: `<h3>Chronicle (2012)</h3>
<p>Trois lycéens obtiennent des super-pouvoirs et découvrent que tout pouvoir a un prix. Un film nerveux et original tourné comme un found footage, entre science-fiction et drame psychologique.</p>
<p><strong>Pourquoi le voir ?</strong> Une approche réaliste et sombre des super-héros. Le format found footage rend l'histoire encore plus immersive. Disponible sur <strong>Prime Video</strong>.</p>`,
};

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, slug, seo')
    .eq('slug', SLUG)
    .single();

  if (error || !article) { console.error('❌', error?.message); process.exit(1); }
  console.log(`✅ Article : "${article.title}"`);

  /* ── Nouveau contenu HTML ────────────────────────────────────────────── */
  const newContent = `<h2>Quel film regarder avec un ado ce soir ?</h2>
<p>Quel film regarder avec un ado ce soir ? Voici une sélection rapide :</p>
<ol>
<li><strong>The Truman Show</strong> — drame/réflexion, dès 13 ans, disponible sur Netflix</li>
<li><strong>Ready Player One</strong> — action/SF, dès 12 ans, disponible sur Disney+ (Star)</li>
<li><strong>Mean Girls</strong> — comédie, dès 12 ans, disponible sur Netflix</li>
<li><strong>Hunger Games</strong> — action/aventure, dès 12 ans, disponible sur Netflix</li>
<li><strong>Le Monde de Charlie</strong> — drame, dès 14 ans, disponible sur Netflix</li>
</ol>

<h2>Films pour ados de 12-13 ans</h2>
<p>À 12-13 ans, les adolescents sont prêts pour des films plus complexes émotionnellement, mais apprécient encore l'aventure et l'humour. Voici nos recommandations pour cet âge charnière.</p>
${FILMS.readyPlayerOne}
${FILMS.meanGirls}
${FILMS.hungerGames}
${FILMS.wayWayBack}

<h2>Films pour ados de 14-15 ans</h2>
<p>Dès 14-15 ans, les ados peuvent aborder des films au ton plus mature, avec des thèmes comme l'identité, la pression sociale ou l'amitié mise à l'épreuve. Ces films leur parlent directement.</p>
${FILMS.trumanShow}
${FILMS.cerclePiotes}
${FILMS.mondeCharlie}
${FILMS.spectacularNow}
<p>Si vous cherchez un film à voir avec votre ado de 15 ans, <strong>Le Monde de Charlie</strong> et <strong>The Truman Show</strong> sont deux valeurs sûres qui plaisent aussi bien aux parents qu'aux adolescents.</p>

<h2>Films d'action pour ados</h2>
<p>Le film d'action reste l'un des genres préférés des adolescents, garçons et filles confondus. Pour éviter les films trop violents ou trop puérils, voici notre sélection d'action calibrée pour un public ado.</p>
${FILMS.readyPlayerOne}
${FILMS.hungerGames}
${FILMS.chronicle}

<h2>Films drôles pour ados</h2>
<p>Pour une soirée détendue, rien ne vaut une bonne comédie. Ces films drôles pour ados fonctionnent aussi bien entre amis qu'en famille — et les parents risquent de rire autant que les ados.</p>
${FILMS.meanGirls}
${FILMS.wayWayBack}
${FILMS.singStreet}

<h2>Films cultes à faire découvrir à un ado</h2>
<p>Certains films ont marqué des générations et méritent d'être (re)découverts. Ces films cultes pour ados sont des références incontournables — parfaits pour initier un adolescent au cinéma qui a compté.</p>
${FILMS.trumanShow}
${FILMS.cerclePiotes}
${FILMS.meanGirls}

<h2>Films pour fille ado</h2>
<p>Les films pensés pour un public adolescent féminin ne se limitent pas aux romances. Voici une sélection qui mêle aventure, émotions et personnages féminins forts — des films que les filles ados adorent et que les parents apprécient aussi.</p>
${FILMS.hungerGames}
${FILMS.meanGirls}
${FILMS.mondeCharlie}
${FILMS.singStreet}

<h2>Questions fréquentes sur les films pour ados</h2>
<p><strong>Quel film regarder avec un ado ?</strong><br>
Tout dépend de l'âge et des goûts. Pour un ado de 12-13 ans, <strong>Ready Player One</strong> est une valeur sûre. Pour un ado de 14-15 ans, <strong>The Truman Show</strong> est souvent très apprécié.</p>
<p><strong>Quel film d'action choisir pour un ado ?</strong><br>
<strong>Ready Player One</strong> et <strong>Hunger Games</strong> sont nos deux recommandations prioritaires : suffisamment rythmés pour captiver, sans violence excessive.</p>
<p><strong>Quels films cultes faire découvrir à un adolescent ?</strong><br>
Parmi les incontournables : <strong>The Truman Show</strong>, <strong>Le Cercle des poètes disparus</strong> et <strong>Mean Girls</strong>. Ces films ont marqué des générations et restent accessibles aujourd'hui.</p>
<p><strong>Quel film pour une fille ado ?</strong><br>
<strong>Hunger Games</strong> et <strong>Le Monde de Charlie</strong> sont deux excellentes options avec des personnages féminins forts et des histoires qui parlent aux adolescentes.</p>
<p><strong>Quel film regarder avec un ado de 15 ans ?</strong><br>
<strong>The Truman Show</strong> est une recommandation phare : suffisamment mature pour intéresser un ado de cet âge, sans contenu inapproprié.</p>`;

  /* ── SEO + schemas ───────────────────────────────────────────────────── */
  const newSeo = {
    metaTitle: 'Films pour ados : 10 idées incontournables par genre et par âge | MovieHunt',
    metaDescription: 'Action, comédie, films cultes... Découvrez nos meilleures recommandations de films pour ados de 12 à 15 ans, que ce soit pour une soirée seul ou en famille.',
    keywords: ['film pour ado', 'films ados', 'film ado 12 ans', 'film ado 14 ans',
      'film action ado', 'film drôle ado', 'film fille ado', 'films cultes ado',
      'quel film regarder avec un ado', 'idée film pour ado'],
    faq: [
      { question: 'Quel film regarder avec un ado ?',
        answer: 'Pour un ado de 12-13 ans, Ready Player One (Disney+) est une valeur sûre. Pour un ado de 14-15 ans, The Truman Show (Netflix) est souvent très apprécié.' },
      { question: 'Quel film d\'action choisir pour un ado ?',
        answer: 'Ready Player One et Hunger Games sont les deux recommandations prioritaires : suffisamment rythmés pour captiver, sans violence excessive.' },
      { question: 'Quels films cultes faire découvrir à un adolescent ?',
        answer: 'The Truman Show, Le Cercle des poètes disparus et Mean Girls sont des incontournables à faire découvrir à un ado.' },
      { question: 'Quel film pour une fille ado ?',
        answer: 'Hunger Games et Le Monde de Charlie sont deux excellentes options avec des personnages féminins forts et des histoires qui parlent aux adolescentes.' },
      { question: 'Quel film regarder avec un ado de 15 ans ?',
        answer: 'The Truman Show est une recommandation phare : suffisamment mature pour intéresser un ado de cet âge, sans contenu inapproprié.' },
    ],
    itemList: [
      { name: 'The Truman Show' },
      { name: 'Ready Player One' },
      { name: 'Le Cercle des poètes disparus' },
      { name: 'Mean Girls' },
      { name: 'Le Monde de Charlie' },
      { name: 'Hunger Games' },
      { name: 'The Way Way Back' },
      { name: 'Sing Street' },
      { name: 'The Spectacular Now' },
      { name: 'Chronicle' },
    ],
    itemListName: 'Meilleurs films pour ados',
  };

  const { error: updateError } = await supabase
    .from('articles')
    .update({
      title: 'Films pour ados : nos meilleures idées par genre et par âge',
      content: newContent,
      seo: newSeo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', article.id);

  if (updateError) { console.error('❌', updateError.message); process.exit(1); }

  console.log('🎉 Article ADOS mis à jour !');
  console.log(`   Titre : Films pour ados : nos meilleures idées par genre et par âge`);
  console.log(`   Taille contenu : ${newContent.length} caractères`);
}

run().catch(console.error);
