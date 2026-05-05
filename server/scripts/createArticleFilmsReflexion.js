require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const tmdb = require('./tmdb_reflexion.json');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Helper pour construire un bloc film
function filmBlock(num, title, year, genre, casting, poster, backdrops, pitch, whyThink) {
  const altKeyword = 'film qui fait réfléchir';
  const [b1, b2, b3] = backdrops;
  return `
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">${num}. ${title} (${year})</h2>
<ul style="margin: 6px 0 10px; padding-left: 20px;">
  <li><strong>Genre :</strong> ${genre}</li>
  <li><strong>Casting :</strong> ${casting}</li>
</ul>
<div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 6px 0 10px; padding: 2px 0; scroll-snap-type: x mandatory; overflow-anchor: none;">
  <img src="${poster}" alt="Affiche ${title} (${year}) — ${altKeyword}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="eager" decoding="async" />
  ${b1 ? `<img src="${b1}" alt="${title} (${year}) — ${altKeyword}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
  ${b2 ? `<img src="${b2}" alt="${title} (${year}) — ${altKeyword}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
  ${b3 ? `<img src="${b3}" alt="${title} (${year}) — ${altKeyword}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
</div>
<p><strong>Le pitch :</strong> ${pitch}</p>
<p><strong>Pourquoi il fait réfléchir :</strong> ${whyThink}</p>
`;
}

// Indexer les résultats TMDB par titre
const t = {};
tmdb.forEach(m => { t[m.title] = m; });

const films = [
  filmBlock(1, 'The Man from Earth', 2007,
    'Science-fiction, Drame', 'David Lee Smith, Tony Todd, John Billingsley',
    t['The Man from Earth'].poster, t['The Man from Earth'].backdrops,
    'John Oldman, professeur d\'université apprécié, annonce à ses collègues lors de sa soirée d\'adieu qu\'il est un homme de Cro-Magnon vivant depuis 14 000 ans. Ce qui commence comme une plaisanterie se transforme en débat philosophique intense sur la religion, la science et l\'histoire de l\'humanité.',
    'Tourné entièrement en intérieur, avec pour seule arme le dialogue, ce film bat en brèche chaque certitude — religieuse, scientifique, historique. Chaque conviction des personnages est progressivement remise en question. Une expérience de pensée pure, dont les répliques restent en tête des jours après.'
  ),
  filmBlock(2, 'Aniara', 2018,
    'Science-fiction, Drame', 'Emelie Jonsson, Arvin Kananian, Bianca Cruse',
    t['Aniara'].poster, t['Aniara'].backdrops,
    'Un vaisseau spatial transportant des réfugiés d\'une Terre mourante vers Mars percute des débris et dévie de sa trajectoire. Il dérive désormais dans l\'espace infini, sans aucune possibilité de retour. Le film suit les passagers sur des décennies entières.',
    'Une méditation froide et impitoyable sur le deuil collectif, le sens de la vie et la condition humaine face à l\'insignifiance cosmique. Pas d\'espoir facile, pas de héros. Juste des êtres humains qui apprennent à vivre — ou meurent en essayant — dans l\'abîme. Un des films les plus désespérément honnêtes du cinéma récent.'
  ),
  filmBlock(3, 'The Double', 2013,
    'Thriller, Comédie noire', 'Jesse Eisenberg, Mia Wasikowska, Wallace Shawn',
    t['The Double'].poster, t['The Double'].backdrops,
    'Simon James, un employé de bureau que personne ne remarque, voit sa vie basculer quand arrive James Simon — son sosie parfait, mais charismatique, audacieux et séduisant. Adapté de la nouvelle de Dostoïevski, dans un décor kafkaïen visuellement hypnotisant.',
    'Richard Ayoade filme l\'aliénation moderne et la crise d\'identité avec une précision chirurgicale. Qui sommes-nous sans le regard des autres ? Existons-nous vraiment si personne ne nous voit ? La question rôde longtemps après le générique, portée par la performance double et troublante de Jesse Eisenberg.'
  ),
  filmBlock(4, 'Another Earth', 2011,
    'Science-fiction, Drame', 'Brit Marling, William Mapother',
    t['Another Earth'].poster, t['Another Earth'].backdrops,
    'Une jeune femme, après avoir causé un accident mortel sous l\'effet de l\'alcool, apprend qu\'une planète identique à la Terre est apparue dans le ciel. Elle contacte l\'homme dont elle a détruit la famille, tout en rêvant de rejoindre cette Terre alternative où tout aurait été différent.',
    'Une métaphore bouleversante sur la culpabilité, le pardon et les vies qu\'on n\'a pas vécues. Le concept de "double planète" sert à explorer nos regrets avec une économie de moyens remarquable. Co-écrit et interprété par Brit Marling avec une authenticité brute, ce film indie américain mérite d\'être bien plus connu.'
  ),
  filmBlock(5, 'The Congress', 2013,
    'Drame, Science-fiction, Animation', 'Robin Wright, Harvey Keitel, Jon Hamm',
    t['The Congress'].poster, t['The Congress'].backdrops,
    'Robin Wright (jouant son propre rôle) vend son image numérique à un studio hollywoodien. Vingt ans plus tard, dans un monde où les humains s\'évadent dans des réalités animées chimiquement induites, elle part à la recherche de son fils disparu dans cette fiction collective.',
    'Ari Folman (Valse avec Bachir) mêle live action et animation psychédélique pour explorer la marchandisation de l\'identité, la manipulation des masses par la fiction et ce qu\'on sacrifie quand on cède son image au divertissement. Un film prémonitoire sur l\'IA et la réalité artificielle, sorti dix ans trop tôt.'
  ),
  filmBlock(6, 'Mr. Nobody', 2009,
    'Drame, Science-fiction, Romance', 'Jared Leto, Diane Kruger, Sarah Polley, Linh Dan Pham',
    t['Mr. Nobody'].poster, t['Mr. Nobody'].backdrops,
    'En 2092, Nemo Nobody est le dernier mortel d\'une humanité devenue immortelle. Il raconte à un journaliste sa vie — ou plutôt ses vies : à l\'âge de 9 ans, incapable de choisir entre son père et sa mère, il a vécu simultanément toutes les conséquences possibles de ce choix.',
    'Un film sur le chaos, les choix et le déterminisme qui explore simultanément des dizaines de chronologies parallèles. Jaco Van Dormael livre une œuvre-monde vertigineuse sur ce qu\'une vie aurait pu être. Le spectateur reconstruit lui-même le puzzle — et en sort avec l\'envie de vivre chaque possibilité à fond. Si vous avez aimé <a href="/article/films-comme-inception-a-voir-absolument" style="color:#dc2626;font-weight:600;">des films comme Inception</a>, Mr. Nobody va encore plus loin.'
  ),
  filmBlock(7, 'The Sunset Limited', 2011,
    'Drame', 'Tommy Lee Jones, Samuel L. Jackson',
    t['The Sunset Limited'].poster, t['The Sunset Limited'].backdrops,
    'Dans un appartement de New York, un homme noir croyant (Samuel L. Jackson) retient chez lui un professeur blanc athée (Tommy Lee Jones) qu\'il vient de sauver d\'un suicide dans le métro. Ce qui s\'ensuit : 90 minutes de dialogue philosophique sur la foi, le nihilisme et le sens de la vie.',
    'Adapté de la pièce de Cormac McCarthy, ce huis-clos entre deux visions du monde radicalement opposées est d\'une densité intellectuelle rare. Pas de résolution facile. Pas de gagnant. Deux êtres humains qui se parlent vraiment — et qui font trembler chaque certitude du spectateur. Un film qui divise, ce qui est souvent le signe qu\'il touche juste.'
  ),
  filmBlock(8, 'High Life', 2018,
    'Science-fiction, Drame', 'Robert Pattinson, Juliette Binoche, Mia Goth',
    t['High Life'].poster, t['High Life'].backdrops,
    'Des condamnés à mort sont envoyés dans l\'espace profond pour une expérience reproductive menée par une scientifique obsessionnelle (Juliette Binoche). Monte, le seul survivant, élève seul un bébé né dans le vaisseau, loin de tout, en route vers un trou noir.',
    'Claire Denis filme le corps, la sexualité, la violence et la mort dans un espace clos sans gravité — au sens propre comme figuré. Un film sur la vie qui se perpétue malgré tout, dans l\'obscurité absolue. Radical, dérangeant, formel. Robert Pattinson confirme ici qu\'il est l\'un des acteurs les plus courageux de sa génération.'
  ),
  filmBlock(9, 'Timecrimes (Los Cronocrímenes)', 2007,
    'Science-fiction, Thriller', 'Karra Elejalde, Nacho Vigalondo, Candela Fernández',
    t['Timecrimes'].poster, t['Timecrimes'].backdrops,
    'Héctor, un homme ordinaire, se retrouve accidentellement projeté dans le passé d\'une heure après avoir observé une femme mystérieuse dans la forêt. Il doit naviguer entre ses propres versions temporelles pour corriger ses erreurs — tout en réalisant qu\'il les cause.',
    'La causalité circulaire poussée à son paroxysme. Un film qui démontre qu\'un budget minimal et une idée rigoureuse valent n\'importe quel blockbuster. Nacho Vigalondo résout un paradoxe temporel avec une rigueur mathématique bluffante. Si <a href="/article/7-films-plot-twist-incroyable" style="color:#dc2626;font-weight:600;">les films à retournement</a> vous passionnent, Timecrimes est une référence absolue.'
  ),
  filmBlock(10, 'Primer', 2004,
    'Science-fiction, Thriller', 'Shane Carruth, David Sullivan',
    t['Primer'].poster, t['Primer'].backdrops,
    'Deux ingénieurs découvrent accidentellement le voyage dans le temps en travaillant sur un projet annexe dans un garage. Ce qui commence comme une expérience excitante se transforme rapidement en spirale de méfiance, de manipulation et de conséquences temporelles incontrôlables.',
    'Réalisé pour 7 000 dollars, Primer est probablement le film le plus intellectuellement dense jamais fait sur le voyage temporel. Shane Carruth refuse toute simplification : les paradoxes s\'accumulent, les timelines se multiplient, les dialogues sont volontairement techniques. Après dix visionnages, on a toujours des questions. C\'est exactement le but.'
  ),
];

const intro = `
<p>Tu cherches un film qui te fait <strong>vraiment</strong> réfléchir ? Pas juste du divertissement, mais une histoire qui reste en tête longtemps après le générique — qui te suit sous la douche, dans le métro, au milieu de la nuit ?</p>
<p>Ces films existent. Ils sont souvent méconnus, parfois inconfortables, toujours exigeants. Voici <strong>10 films intelligents et marquants</strong> sélectionnés par MovieHunt pour leur puissance conceptuelle, leur narration audacieuse et leur capacité à remettre en question ce qu'on croyait savoir sur le monde — et sur soi-même.</p>
<p>Tous disponibles en VOD ou sur les grandes plateformes. Tous méritent leur place ici.</p>
`;

const sectionWhy = `
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">Pourquoi ces films font-ils vraiment réfléchir ?</h2>
<p>Ce n'est pas un hasard si ces dix titres se distinguent des milliers d'autres films disponibles. Ils partagent des caractéristiques précises qui les rendent <strong>durables</strong> dans l'esprit du spectateur :</p>
<ul style="padding-left: 20px; margin: 10px 0;">
  <li><strong>Des concepts forts et originaux</strong> : chaque film part d'une idée que le cinéma mainstream n'ose pas explorer — l'immortalité banale, la dérive dans l'espace sans fin, la vente de son identité numérique.</li>
  <li><strong>Une narration exigeante</strong> : aucun de ces films ne mâche le travail du spectateur. Il faut assembler, interpréter, reconsidérer.</li>
  <li><strong>Une interprétation ouverte</strong> : ils refusent les réponses faciles. La fin ne résout rien — elle pose de nouvelles questions.</li>
  <li><strong>Une vraie profondeur thématique</strong> : identité, temps, mort, foi, libre arbitre, réalité — des questions que la philosophie pose depuis des siècles, traitées en images.</li>
</ul>
`;

const sectionLevel = `
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">Quel film intelligent regarder en premier ?</h2>
<p>Tout dépend de ton niveau d'habitude avec le cinéma exigeant :</p>
<ul style="padding-left: 20px; margin: 10px 0;">
  <li><strong>Tu commences → <em>The Man from Earth</em></strong> : zéro effets spéciaux, zéro action. Juste un dialogue qui change tout. Accessible et dévastateur.</li>
  <li><strong>Tu es à l'aise → <em>Mr. Nobody</em></strong> : dense, émotionnel, visuellement somptueux. Un film qui récompense l'attention.</li>
  <li><strong>Tu veux être défié → <em>Primer</em></strong> : le film le plus complexe de la liste. Prévois du papier et un crayon.</li>
</ul>
<p>Dans tous les cas, évite de regarder ces films en faisant autre chose. Chacun demande — et mérite — ton attention entière.</p>
`;

const faq = `
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">FAQ — Films qui font réfléchir</h2>

<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel film fait réfléchir le plus longtemps après ?</summary>
  <p style="margin-top: 10px;"><strong>Primer (2004)</strong> est souvent cité comme le film qui hante le plus durablement : des années après, les spectateurs comparent encore leurs théories sur les timelines. <strong>The Man from Earth</strong> et <strong>The Sunset Limited</strong> sont également des films dont les questions philosophiques restent actives des semaines plus tard.</p>
</details>

<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel est le meilleur film de science-fiction intelligent ?</summary>
  <p style="margin-top: 10px;">Pour la profondeur conceptuelle pure : <strong>Primer</strong>. Pour l'émotion combinée à l'idée : <strong>Mr. Nobody</strong> ou <strong>Another Earth</strong>. Pour une vision du futur vraiment dérangeante : <strong>Aniara</strong> ou <strong>The Congress</strong>. Ces films utilisent la SF comme outil philosophique, pas comme prétexte à des effets visuels.</p>
</details>

<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel film philosophique voir en couple ou entre amis ?</summary>
  <p style="margin-top: 10px;"><strong>The Sunset Limited</strong> est idéal pour lancer un débat : les deux positions défendues — foi absolue vs nihilisme total — sont toutes deux défendables. <strong>Mr. Nobody</strong> génère systématiquement des discussions sur les choix de vie. Et <strong>Timecrimes</strong> est parfait pour ceux qui veulent s'arracher les cheveux ensemble sur les paradoxes temporels.</p>
</details>

<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Film intelligent à voir absolument si j'ai aimé Inception ?</summary>
  <p style="margin-top: 10px;">Si <em>Inception</em> t'a accroché, tu vas adorer <strong>Primer</strong> pour la complexité temporelle, <strong>Mr. Nobody</strong> pour les réalités parallèles, et <strong>The Double</strong> pour la déstabilisation de l'identité. Notre sélection <a href="/article/films-comme-inception-a-voir-absolument" style="color:#dc2626;font-weight:600;">films comme Inception</a> te donnera encore plus d'options.</p>
</details>

<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quels sont les films les plus difficiles à comprendre ?</summary>
  <p style="margin-top: 10px;"><strong>Primer</strong> est unanimement reconnu comme le film le plus difficile à suivre — des diagrammes de timelines circulent encore sur Internet. <strong>Aniara</strong> est difficile émotionnellement plutôt qu'intellectuellement. <strong>High Life</strong> refuse toute narration conventionnelle. Ces trois films demandent un engagement actif du spectateur.</p>
</details>
`;

const conclusion = `
<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">Films qui font réfléchir : par où commencer ?</h2>
<p>Cette liste ne cherche pas à impressionner — elle cherche à <strong>dépayser ton rapport au cinéma</strong>. Ces dix films démontrent qu'une idée forte, portée par une mise en scène courageuse, peut valoir dix blockbusters réunis.</p>
<p>Que tu commences par l'accessible <em>The Man from Earth</em> ou que tu te jettes directement dans <em>Primer</em>, tu ressortiras de chacun de ces films avec quelque chose en plus. Une question. Un doute. Une envie d'en discuter.</p>
<p>👉 À lire aussi : 
  <a href="/article/7-films-plot-twist-incroyable" style="color:#dc2626;">7 films avec un plot twist final incroyable</a>, 
  <a href="/article/films-comme-inception-a-voir-absolument" style="color:#dc2626;">films comme Inception à voir absolument</a>, 
  <a href="/article/quel-film-regarder-ce-soir-guide-2026" style="color:#dc2626;">quel film regarder ce soir</a>
</p>
`;

const fullContent = intro + films.join('\n') + sectionWhy + sectionLevel + faq + conclusion;

const articleData = {
  title: '10 films qui font réfléchir : notre sélection pour esprits curieux',
  slug: '10-films-qui-font-reflechir-intelligents-a-voir-absolument',
  excerpt: 'Primer, Mr. Nobody, Aniara, The Sunset Limited... 10 films intelligents qui restent en tête longtemps après le générique. Notre sélection complète avec carrousels et guide par niveau.',
  category: 'list',
  tags: ['films qui font réfléchir', 'film intelligent', 'film philosophique', 'science-fiction', 'film complexe', 'Primer', 'Mr. Nobody', 'film à concept'],
  status: 'published',
  cover_image: t['Mr. Nobody'].backdrops[0],
  source_url: 'https://www.moviehunt-blog.fr',
  published_at: new Date().toISOString(),
  metadata: {
    movieTitle: '10 films qui font réfléchir',
    releaseYear: '2026',
    genre: ['Science-fiction', 'Drame', 'Thriller', 'Philosophique'],
  },
  seo: {
    metaTitle: '10 films qui font réfléchir : notre sélection incontournable',
    metaDescription: 'Primer, Mr. Nobody, Aniara... 10 films intelligents qui restent en tête après le générique. Notre sélection complète pour esprits curieux, par niveau.',
    keywords: [
      'films qui font réfléchir',
      'film intelligent à voir',
      'film philosophique',
      'film complexe à voir',
      'Primer critique',
      'Mr Nobody film',
      'film comme Inception réflexion',
      'meilleur film science fiction réflexion',
      'film à concept fort',
      'film à voir absolument',
      'film qui marque',
      'Aniara film',
    ],
  },
  content: fullContent,
};

async function run() {
  const { data, error } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single();

  if (error) { console.error('❌', error.message); process.exit(1); }
  console.log('✅ Article publié !');
  console.log('🔗 URL : https://www.moviehunt-blog.fr/article/' + data.slug);
}

run().catch(console.error);
