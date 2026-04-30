/* eslint-disable */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'adaae6de59a1a0ef031be9c4b22907b0';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

const SLUG = 'idee-de-film-pour-ado-10-films-incontournables';

/* ── Films à rechercher sur TMDB ─────────────────────────────────────── */
const FILMS_DATA = [
  {
    key: "trumanShow", tmdbQuery: "The Truman Show", year: 1998,
    displayTitle: "The Truman Show (1998)", platform: "Netflix", genre: "Drame", minAge: 13,
    desc: "Un homme m\u00e8ne une vie parfaite\u2026 jusqu\u2019\u00e0 ce qu\u2019il d\u00e9couvre qu\u2019il vit dans un immense plateau t\u00e9l\u00e9. <strong>The Truman Show</strong> questionne notre rapport \u00e0 l\u2019image et \u00e0 la libert\u00e9. Jim Carrey y livre une performance magistrale.",
    why: "Un film que tout ado devrait voir au moins une fois pour r\u00e9fl\u00e9chir \u00e0 ce qu\u2019est vivre vraiment.",
  },
  {
    key: "readyPlayerOne", tmdbQuery: "Ready Player One", year: 2018,
    displayTitle: "Ready Player One (2018)", platform: "Disney+ (Star)", genre: "Action / SF", minAge: 12,
    desc: "Bienvenue dans l\u2019OASIS, un monde virtuel o\u00f9 tout est possible. Spielberg signe une aventure \u00e9pique bourr\u00e9e de r\u00e9f\u00e9rences \u00e0 la pop culture. Les effets visuels sont spectaculaires.",
    why: "Le film parfait pour les ados gamers ou r\u00eaveurs.",
  },
  {
    key: "cerclePiotes", tmdbQuery: "Dead Poets Society", year: 1989,
    displayTitle: "Le Cercle des po\u00e8tes disparus (1989)", platform: "Prime Video", genre: "Drame", minAge: 13,
    desc: "Un professeur hors du commun enseigne \u00e0 ses \u00e9l\u00e8ves \u00e0 penser par eux-m\u00eames. Robin Williams y est inoubliable dans le r\u00f4le du professeur Keating.",
    why: "Un classique bouleversant qui continue d\u2019inspirer des g\u00e9n\u00e9rations. <em>Carpe Diem\u00a0!</em>",
  },
  {
    key: "meanGirls", tmdbQuery: "Mean Girls", year: 2004,
    displayTitle: "Mean Girls (2004)", platform: "Netflix", genre: "Com\u00e9die", minAge: 12,
    desc: "Au lyc\u00e9e, les Plastics dictent la loi. <strong>Mean Girls</strong> reste la com\u00e9die culte sur les clans et la recherche d\u2019identit\u00e9. Derri\u00e8re l\u2019humour, une vraie satire des codes adolescents.",
    why: "Indispensable pour une soir\u00e9e fun. Les r\u00e9pliques sont devenues iconiques.",
  },
  {
    key: "mondeCharlie", tmdbQuery: "The Perks of Being a Wallflower", year: 2012,
    displayTitle: "Le Monde de Charlie (2012)", platform: "Netflix", genre: "Drame", minAge: 14,
    desc: "Un adolescent timide tente de trouver sa place apr\u00e8s un pass\u00e9 difficile. Port\u00e9 par Logan Lerman, Emma Watson et Ezra Miller, ce film parle de solitude et de renaissance.",
    why: "Un film qui touche droit au c\u0153ur. Parfait pour ceux qui se sentent diff\u00e9rents.",
  },
  {
    key: "hungerGames", tmdbQuery: "The Hunger Games", year: 2012,
    displayTitle: "Hunger Games (2012)", platform: "Netflix", genre: "Action", minAge: 12,
    desc: "Katniss Everdeen, h\u00e9ro\u00efne courageuse d\u2019un monde o\u00f9 les adolescents s\u2019affrontent pour survivre. <strong>Hunger Games</strong> aborde la r\u00e9sistance et la soif de libert\u00e9. Jennifer Lawrence est parfaite.",
    why: "Une saga forte et inspirante avec une h\u00e9ro\u00efne f\u00e9minine puissante.",
  },
  {
    key: "wayWayBack", tmdbQuery: "The Way Way Back", year: 2013,
    displayTitle: "The Way Way Back (2013)", platform: "Prime Video", genre: "Com\u00e9die", minAge: 12,
    desc: "Un adolescent mal dans sa peau passe l\u2019\u00e9t\u00e9 dans une station baln\u00e9aire o\u00f9 il trouve un job inattendu dans un parc aquatique. Steve Carell et Sam Rockwell sont excellents.",
    why: "Dr\u00f4le, touchant et sinc\u00e8re\u00a0: un vrai bijou de cin\u00e9ma ind\u00e9pendant.",
  },
  {
    key: "singStreet", tmdbQuery: "Sing Street", year: 2016,
    displayTitle: "Sing Street (2016)", platform: "Netflix", genre: "Musical", minAge: 12,
    desc: "Dans le Dublin des ann\u00e9es 80, un ado monte un groupe pour impressionner une fille. Un film musical plein d\u2019\u00e9nergie et d\u2019\u00e9motion, avec une bande-son irr\u00e9sistible.",
    why: "Parfait pour ceux qui r\u00eavent de libert\u00e9 et de cr\u00e9ation.",
  },
  {
    key: "spectacularNow", tmdbQuery: "The Spectacular Now", year: 2013,
    displayTitle: "The Spectacular Now (2013)", platform: "Prime Video", genre: "Drame", minAge: 14,
    desc: "Deux adolescents que tout oppose apprennent \u00e0 se conna\u00eetre. Ce drame doux-amer aborde la transition vers l\u2019\u00e2ge adulte avec une justesse rare.",
    why: "Un film sensible sur les doutes et les premiers choix de vie.",
  },
  {
    key: "chronicle", tmdbQuery: "Chronicle", year: 2012,
    displayTitle: "Chronicle (2012)", platform: "Prime Video", genre: "SF", minAge: 13,
    desc: "Trois lyc\u00e9ens obtiennent des super-pouvoirs et d\u00e9couvrent que tout pouvoir a un prix. Un film nerveux entre science-fiction et drame psychologique, tourn\u00e9 en found footage.",
    why: "Une approche r\u00e9aliste et sombre des super-h\u00e9ros. Le format found footage rend l\u2019histoire immersive.",
  },
];

/* ── Appel TMDB pour un film ────────────────────────────────────────── */
async function fetchPoster(film) {
  try {
    const res = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query: film.tmdbQuery, year: film.year, language: 'fr-FR' },
    });
    const result = res.data.results[0];
    if (result && result.poster_path) {
      console.log(`  ${film.displayTitle} → ${result.poster_path}`);
      return { thumb: `${TMDB_IMG}${result.poster_path}`, full: `https://image.tmdb.org/t/p/w780${result.poster_path}` };
    }
    console.log(`  Pas d'affiche pour ${film.displayTitle}`);
  } catch (e) {
    console.warn(`  TMDB error (${film.tmdbQuery}): ${e.message}`);
  }
  return null;
}

/* ── Recherche d'un lien interne dans Supabase ──────────────────────── */
async function findInternalSlug(film) {
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug')
      .ilike('title', `%${film.tmdbQuery}%`)
      .eq('status', 'published')
      .limit(1)
      .single();
    if (data) { console.log(`  Lien interne trouvé pour ${film.displayTitle}: /article/${data.slug}`); return `/article/${data.slug}`; }
  } catch (_) {}
  return null;
}

/* ── Carte film HTML complète ─────────────────────────────────────────── */
function filmCard(film, poster, internalSlug) {
  const posterBlock = poster
    ? `<a href="${poster.full}" target="_blank" rel="noopener" title="Agrandir l'affiche" style="flex-shrink:0;display:block;">
  <img src="${poster.thumb}" alt="Affiche ${film.displayTitle}" loading="lazy"
       style="width:90px;min-width:90px;height:135px;object-fit:cover;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.18);cursor:zoom-in;" />
</a>`
    : '';
  const titleTag = internalSlug
    ? `<a href="${internalSlug}" style="color:inherit;text-decoration:none;border-bottom:2px solid #dc2626;">${film.displayTitle}</a>`
    : film.displayTitle;
  const badges = [
    film.genre   ? `<span style="background:#dc2626;color:#fff;font-size:0.72em;font-weight:600;padding:2px 10px;border-radius:9999px;">${film.genre}</span>` : '',
    film.minAge  ? `<span style="background:#f3f4f6;color:#374151;font-size:0.72em;font-weight:600;padding:2px 10px;border-radius:9999px;">Dès ${film.minAge} ans</span>` : '',
    film.platform ? `<span style="background:#111827;color:#fff;font-size:0.72em;font-weight:600;padding:2px 10px;border-radius:9999px;">${film.platform}</span>` : '',
  ].filter(Boolean).join('');
  return [
    `<div style="display:flex;gap:16px;align-items:flex-start;margin:20px 0;padding:20px;background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">`,
    posterBlock,
    `<div style="flex:1;min-width:0;">`,
    `<h3 style="margin:0 0 6px;">${titleTag}</h3>`,
    `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">${badges}</div>`,
    `<p style="margin:0 0 8px;font-size:0.95em;line-height:1.5;">${film.desc}</p>`,
    `<p style="margin:0;font-size:0.88em;color:#374151;"><strong>Pourquoi le voir ?</strong> ${film.why}</p>`,
    `</div>`,
    `</div>`,
  ].join('\n');
}

async function run() {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, slug, seo')
    .eq('slug', SLUG)
    .single();

  if (error || !article) { console.error('❌', error?.message); process.exit(1); }
  console.log(`✅ Article : "${article.title}"`);

  /* ── Récupérer les affiches TMDB + liens internes */
  console.log('\n Récupération des affiches TMDB et liens internes...');
  const posters = {};
  const slugs   = {};
  for (const film of FILMS_DATA) {
    posters[film.key] = await fetchPoster(film);
    await new Promise(function(r) { return setTimeout(r, 300); });
    slugs[film.key] = await findInternalSlug(film);
  }

  /* Helpers */
  const f   = function(key) { var film = FILMS_DATA.find(function(d) { return d.key === key; }); return filmCard(film, posters[key], slugs[key]); };
  const ref = function(key) { var film = FILMS_DATA.find(function(d) { return d.key === key; }); return slugs[key] ? '<a href="' + slugs[key] + '" style="color:#dc2626;">' + film.displayTitle + '</a>' : '<strong>' + film.displayTitle + '</strong>'; };

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
${f('readyPlayerOne')}
${f('meanGirls')}
${f('hungerGames')}
${f('wayWayBack')}

<h2>Films pour ados de 14-15 ans</h2>
<p>Dès 14-15 ans, les ados peuvent aborder des films au ton plus mature, avec des thèmes comme l'identité, la pression sociale ou l'amitié mise à l'épreuve. Ces films leur parlent directement.</p>
${f('trumanShow')}
${f('cerclePiotes')}
${f('mondeCharlie')}
${f('spectacularNow')}
<p>Si vous cherchez un film à voir avec votre ado de 15 ans, ${ref('mondeCharlie')} et ${ref('trumanShow')} sont deux valeurs sûres qui plaisent aussi bien aux parents qu'aux adolescents.</p>

<h2>Films d'action pour ados</h2>
<p>Le film d'action reste l'un des genres préférés des adolescents, garçons et filles confondus. Pour éviter les films trop violents ou trop puérils, voici notre sélection calibrée pour un public ado.</p>
${f('readyPlayerOne')}
${f('hungerGames')}
${f('chronicle')}

<h2>Films drôles pour ados</h2>
<p>Pour une soirée détendue, rien ne vaut une bonne comédie. Ces films drôles pour ados fonctionnent aussi bien entre amis qu'en famille.</p>
${f('meanGirls')}
${f('wayWayBack')}
${f('singStreet')}

<h2>Films cultes à faire découvrir à un ado</h2>
<p>Certains films ont marqué des générations et méritent d'être (re)découverts. Ces références incontournables sont parfaites pour initier un adolescent au cinéma qui a compté.</p>
${f('trumanShow')}
${f('cerclePiotes')}
${f('meanGirls')}

<h2>Films pour fille ado</h2>
<p>Une sélection qui mêle aventure, émotions et personnages féminins forts — des films que les filles ados adorent et que les parents apprécient aussi.</p>
${f('hungerGames')}
${f('meanGirls')}
${f('mondeCharlie')}
${f('singStreet')}

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
<strong>The Truman Show</strong> est une recommandation phare : suffisamment mature pour intéresser un ado de cet âge, sans contenu inapproprié.</p>
<p><strong>Quel film pour un ado de 12 ans ?</strong><br>
<strong>Ready Player One</strong> est une valeur sûre pour un ado de 12 ans : une aventure épique et rythmée, avec des références à la pop culture.</p>
<p><strong>Quel film pour un ado de 13 ans ?</strong><br>
<strong>Mean Girls</strong> est une comédie culte qui plaît aux ados de 13 ans : une histoire drôle et touchante sur les clans et la recherche d'identité.</p>
<p><strong>Quel film pour un ado de 14 ans ?</strong><br>
<strong>The Truman Show</strong> est une recommandation phare pour un ado de 14 ans : un film qui questionne notre rapport à l'image et à la liberté.</p>
<p><strong>Quel film pour un ado de 15 ans ?</strong><br>
<strong>The Truman Show</strong> est une recommandation phare pour un ado de 15 ans : un film qui aborde des thèmes matures avec justesse et sensibilité.</p>

<h2>Conclusion</h2>
<p>Voilà notre sélection de films pour ados, avec des recommandations pour chaque âge et chaque goût. N'hésitez pas à nous suivre pour plus de conseils et de critiques de films !</p>
`;

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
      { question: 'Quel film pour un ado de 12 ans ?',
        answer: 'Ready Player One est une valeur sûre pour un ado de 12 ans : une aventure épique et rythmée, avec des références à la pop culture.' },
      { question: 'Quel film pour un ado de 13 ans ?',
        answer: 'Mean Girls est une comédie culte qui plaît aux ados de 13 ans : une histoire drôle et touchante sur les clans et la recherche d\'identité.' },
      { question: 'Quel film pour un ado de 14 ans ?',
        answer: 'The Truman Show est une recommandation phare pour un ado de 14 ans : un film qui questionne notre rapport à l\'image et à la liberté.' },
      { question: 'Quel film pour un ado de 15 ans ?',
        answer: 'The Truman Show est une recommandation phare pour un ado de 15 ans : un film qui aborde des thèmes matures avec justesse et sensibilité.' },
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

  console.log('\n Article ADOS mis à jour !');
  console.log('   Taille contenu  : ' + newContent.length + ' caractères');
  console.log('   Affiches TMDB   : ' + Object.values(posters).filter(Boolean).length + '/' + FILMS_DATA.length);
  console.log('   Liens internes  : ' + Object.values(slugs).filter(Boolean).length + '/' + FILMS_DATA.length);
}

run().catch(console.error);
