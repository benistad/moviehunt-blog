require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const movies = [
  { title: 'The Night Comes for Us', year: 2018 },
  { title: 'Extraction 2', year: 2023 },
  { title: 'Wheelman', year: 2017 },
  { title: 'Kate', year: 2021 },
  { title: 'Balle perdue', year: 2020 },
  { title: 'Triple Frontier', year: 2019 },
  { title: 'Carter', year: 2022 },
  { title: 'Mosul', year: 2019 },
  { title: 'Polar', year: 2019 },
  { title: '6 Underground', year: 2019 },
];

async function fetchMovieData(movie) {
  const search = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: TMDB_API_KEY, query: movie.title, year: movie.year, language: 'fr-FR' }
  });
  if (!search.data.results.length) { console.warn(`⚠️ Non trouvé: ${movie.title}`); return null; }
  const result = search.data.results[0];
  const imagesRes = await axios.get(`${BASE_URL}/movie/${result.id}/images`, { params: { api_key: TMDB_API_KEY } });
  const filtered = imagesRes.data.backdrops.filter(b => b.iso_639_1 === null || b.iso_639_1 === 'en' || b.iso_639_1 === 'fr');
  const backdrops = filtered.slice(0, 3).map(b => `https://image.tmdb.org/t/p/original${b.file_path}`);
  return { title: movie.title, year: movie.year, poster: `https://image.tmdb.org/t/p/w342${result.poster_path}`, backdrops };
}

function filmBlock(num, titleDisplay, year, genre, casting, poster, backdrops, pitch, whySee) {
  const alt = "film d'action Netflix";
  const [b1, b2, b3] = backdrops;
  return `<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">${num}. ${titleDisplay} (${year})</h2>
<ul style="margin: 6px 0 10px; padding-left: 20px;">
  <li><strong>Genre :</strong> ${genre}</li>
  <li><strong>Casting :</strong> ${casting}</li>
</ul>
<div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 6px 0 10px; padding: 2px 0; scroll-snap-type: x mandatory; overflow-anchor: none;">
  <img src="${poster}" alt="Affiche ${titleDisplay} (${year}) — ${alt}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="eager" decoding="async" />
  ${b1 ? `<img src="${b1}" alt="${titleDisplay} (${year}) — ${alt}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
  ${b2 ? `<img src="${b2}" alt="${titleDisplay} (${year}) — ${alt}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
  ${b3 ? `<img src="${b3}" alt="${titleDisplay} (${year}) — ${alt}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />` : ''}
</div>
<p><strong>Le pitch :</strong> ${pitch}</p>
<p><strong>Pourquoi le voir :</strong> ${whySee}</p>`;
}

function buildContent(tmdb) {
  const intro = `<p>Tu cherches un <strong>bon film d'action sur Netflix</strong> en 2026 ? Pas juste des explosions dans tous les sens — mais des films vraiment efficaces, bien réalisés, capables de te tenir en haleine du début à la fin.</p>
<p>Netflix s'est imposé comme l'une des plateformes les plus ambitieuses en matière de cinéma d'action original. De la brutalité indonésienne de <em>The Night Comes for Us</em> au spectacle total de <em>Extraction 2</em>, en passant par la pépite française <em>Balle perdue</em>, voici <strong>les meilleurs films d'action Netflix</strong> à voir absolument en 2026 — avec du brutal, du nerveux, du spectaculaire, et quelques surprises moins connues.</p>`;

  const films = [
    filmBlock(1, 'The Night Comes for Us', 2018, 'Action, Thriller', 'Joe Taslim, Iko Uwais, Julie Estelle',
      tmdb['The Night Comes for Us'].poster, tmdb['The Night Comes for Us'].backdrops,
      "Ito, ancien lieutenant d'une triade d'Asie du Sud-Est, décide de protéger une jeune fille après avoir refusé de l'exécuter. Son acte de rébellion déclenche une chasse à l'homme impitoyable : ses anciens frères d'armes, les meilleurs tueurs d'élite de la triade, sont lancés à ses trousses.",
      "Probablement les meilleures chorégraphies d'action jamais produites pour Netflix. Le réalisateur indonésien Timo Tjahjanto filme les combats avec une brutalité viscérale et une précision technique que peu de blockbusters hollywoodiens peuvent se vanter d'atteindre. Âmes sensibles, s'abstenir — les autres, accrochez-vous."
    ),
    filmBlock(2, 'Extraction 2', 2023, 'Action, Thriller', 'Chris Hemsworth, Golshifteh Farahani, Adam Bessa',
      tmdb['Extraction 2'].poster, tmdb['Extraction 2'].backdrops,
      "Tyler Rake, mercenaire d'élite donné pour mort, est rappelé pour une mission encore plus périlleuse : extraire la famille d'un seigneur de guerre géorgien d'une prison de haute sécurité du Caucase. Ce qui devait être une extraction propre se transforme en course-poursuite effrénée à travers l'Europe.",
      "Sam Hargrave surpasse son premier film avec une séquence centrale de 21 minutes en plan-séquence apparent — une prouesse technique qui traverse une prison en feu, un train lancé à pleine vitesse et une ville entière. Le spectacle est total, la mise en scène millimétrée. L'un des meilleurs films d'action purs produits ces dernières années."
    ),
    filmBlock(3, 'Wheelman', 2017, 'Thriller, Action', 'Frank Grillo, Caitlin Carmichael, Garret Dillahunt',
      tmdb['Wheelman'].poster, tmdb['Wheelman'].backdrops,
      "Un chauffeur chevronné engagé pour couvrir un braquage reçoit un appel au moment où ses complices fuient : il vient d'être trahi. Seul dans sa voiture, sans savoir à qui faire confiance, il doit improviser pour survivre à la nuit.",
      `Tourné quasiment entièrement à l'intérieur d'une voiture, Wheelman est un modèle d'efficacité : zéro temps mort, tension constante, Frank Grillo en état de grâce. Le budget minimaliste devient une force — on est dans la voiture avec lui. Un thriller d'action qui prouve qu'une bonne idée vaut mieux que dix millions d'effets spéciaux. Si les thrillers nerveux vous attirent, notre liste de <a href="/article/10-thrillers-sous-cotes-a-voir-absolument" style="color:#dc2626;font-weight:600;">thrillers sous-cotés à voir</a> est faite pour vous.`
    ),
    filmBlock(4, 'Kate', 2021, 'Action, Néo-noir', 'Mary Elizabeth Winstead, Woody Harrelson, Miku Martineau',
      tmdb['Kate'].poster, tmdb['Kate'].backdrops,
      "Kate, tueuse professionnelle au sommet de son art, est empoisonnée lors d'une mission à Tokyo et apprend qu'il lui reste moins de 24 heures à vivre. Elle décide de consacrer ses dernières heures à retrouver ceux qui l'ont condamnée, tout en prenant sous son aile la fille d'une de ses anciennes cibles.",
      "L'esthétique néon de Tokyo de nuit sert d'écrin à des combats brutaux et chorégraphiés avec soin. Mary Elizabeth Winstead impressionne dans un rôle physiquement exigeant, portant le film avec une intensité froide. Le duo inattendu entre la tueuse mourante et la gamine insolente apporte une profondeur émotionnelle bienvenue à un film d'action très bien exécuté."
    ),
    filmBlock(5, 'Balle perdue (Lost Bullet)', 2020, 'Action, Policier', 'Alban Lenoir, Nicolas Duvauchelle, Ramzy Bedia',
      tmdb['Balle perdue'].poster, tmdb['Balle perdue'].backdrops,
      "Lino, mécanicien prodige au passé de délinquant, est recruté par la police pour modifier des véhicules de poursuite. Quand son mentor est assassiné et qu'il est accusé du meurtre, il doit retrouver la voiture-preuve — la seule chose qui peut l'innocenter.",
      "La meilleure surprise française de la liste — et une des meilleures productions action Netflix toutes origines confondues. Les courses-poursuites sont d'un niveau technique impressionnant, le rythme est implacable et Alban Lenoir crève l'écran. Un film qui prouve que le cinéma d'action français peut rivaliser avec les productions américaines. La suite, <em>Balle perdue 2</em>, est également disponible sur Netflix."
    ),
    filmBlock(6, 'Triple Frontier', 2019, 'Action, Drame', 'Ben Affleck, Oscar Isaac, Charlie Hunnam, Pedro Pascal, Garrett Hedlund',
      tmdb['Triple Frontier'].poster, tmdb['Triple Frontier'].backdrops,
      "Cinq anciens soldats des forces spéciales, reconvertis dans le civil avec des fortunes diverses, se réunissent pour un ultime coup : dépouiller un cartel de drogue dans sa planque colombienne. Ce qui devait être un braquage propre tourne au désastre à mesure que la cupidité prend le dessus dans les Andes.",
      "J.C. Chandor dépasse le pur film d'action pour explorer comment des hommes entraînés à prendre des décisions sous pression peuvent s'effondrer face à leurs propres démons. Le casting cinq étoiles livre des performances nuancées, et les séquences dans les montagnes andines sont spectaculairement efficaces. Un film d'action qui a quelque chose à dire."
    ),
    filmBlock(7, 'Carter', 2022, 'Action', 'Joo Won, Sung Joon, Camilla Belle',
      tmdb['Carter'].poster, tmdb['Carter'].backdrops,
      "Carter se réveille sans aucun souvenir dans une salle de bains ensanglantée. Une voix dans son oreillette lui confie une mission : protéger une fillette porteuse d'un vaccin contre un virus mutant. Il n'a aucune idée de qui il est — et ses ennemis lui rappellent durement.",
      "Le réalisateur coréen Jung Byung-gil simule un plan-séquence de deux heures non-stop, avec des transitions acrobatiques entre les scènes d'action. Le résultat ressemble à un jeu vidéo en vue subjective — complètement fou, visuellement épuisant, techniquement hallucinant. Diviseur d'opinion, mais une vision de cinéma à part entière pour les amateurs d'action expérimentale."
    ),
    filmBlock(8, 'Mosul', 2019, 'Guerre, Action', "Suhail Dabbach, Adam Bessa, Is'haq Elias",
      tmdb['Mosul'].poster, tmdb['Mosul'].backdrops,
      "Une unité de police irakienne d'élite combat les derniers retranchements de Daesh dans les rues dévastées de Mossoul. Le film suit ces hommes ordinaires devenus combattants, qui se battent pour libérer leur propre ville, maison par maison, dans l'indifférence quasi-générale.",
      "Produit par les frères Russo (Avengers), Mosul se distingue radicalement du film de guerre occidental typique : les personnages sont irakiens, joués par des acteurs arabes, parlent arabe. La réalité de ce conflit y est restituée avec une brutalité et une honnêteté rares. Un des films de guerre les plus intègres de la décennie — et l'un des plus oubliés."
    ),
    filmBlock(9, 'Polar', 2019, 'Action, Néo-noir', 'Mads Mikkelsen, Vanessa Hudgens, Katheryn Winnick',
      tmdb['Polar'].poster, tmdb['Polar'].backdrops,
      "Duncan Vizla, surnommé \"Le Danois Noir\", est le meilleur tueur à gages au monde et approche de la retraite. Son employeur décide qu'il est moins coûteux de le liquider que de lui verser sa pension. Vizla va devoir sortir une dernière fois — et cette fois, il est en colère.",
      `Polar est un pur film de genre, stylisé à l'extrême et entièrement porté par Mads Mikkelsen — froid, précis, magnétique comme toujours. La violence est cartoonesque mais assumée, l'esthétique BD revendiquée. Un divertissement efficace pour les fans de John Wick. Si vous aimez les films d'action avec des acteurs marquants, notre sélection de <a href="/article/10-films-meconnus-netflix-2026" style="color:#dc2626;font-weight:600;">films méconnus Netflix</a> vaut aussi le détour.`
    ),
    filmBlock(10, '6 Underground', 2019, 'Action', 'Ryan Reynolds, Mélanie Laurent, Manuel Garcia-Rulfo, Ben Hardy',
      tmdb['6 Underground'].poster, tmdb['6 Underground'].backdrops,
      "Un milliardaire excentrique recrute six individus déclarés officiellement morts pour former une équipe de justiciers opérant hors de tout cadre légal. Leur mission commune : renverser un dictateur en se servant de leurs compétences extrêmes et d'un budget illimité.",
      "Michael Bay en roue libre sur Netflix avec un budget colossal et zéro contrainte éditoriale. Si vous cherchez un film qui vous fera réfléchir, passez votre chemin. Si vous voulez des explosions toutes les 90 secondes, des voitures qui volent, des one-liners de Ryan Reynolds et une mise en scène hystérique — vous êtes exactement au bon endroit. Le pur spectacle assumé."
    ),
  ];

  const sectionChoice = `<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">Quel film d'action Netflix regarder ce soir ?</h2>
<p>Tout dépend de ton envie du moment :</p>
<ul style="padding-left: 20px; margin: 10px 0;">
  <li><strong>Action brutale et chorégraphies extrêmes →</strong> <em>The Night Comes for Us</em></li>
  <li><strong>Spectacle hollywoodien XXL →</strong> <em>Extraction 2</em></li>
  <li><strong>Course-poursuite française →</strong> <em>Balle perdue</em></li>
  <li><strong>Thriller minimaliste nerveux →</strong> <em>Wheelman</em></li>
  <li><strong>Film de guerre honnête →</strong> <em>Mosul</em></li>
  <li><strong>Pur divertissement explosif →</strong> <em>6 Underground</em></li>
  <li><strong>Action avec profondeur →</strong> <em>Triple Frontier</em></li>
</ul>
<p>👉 À lire aussi : notre <a href="/article/quel-film-regarder-ce-soir-guide-2026" style="color:#dc2626;font-weight:600;">guide complet pour choisir quoi regarder ce soir</a>.</p>`;

  const faq = `<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">FAQ — Films d'action Netflix</h2>
<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel est le meilleur film d'action sur Netflix en 2026 ?</summary>
  <p style="margin-top: 10px;"><strong>The Night Comes for Us</strong> est souvent cité comme le sommet absolu pour les amateurs de combat — les chorégraphies d'action y sont d'un niveau exceptionnel. Pour le spectacle pur, <strong>Extraction 2</strong> s'impose avec sa séquence en plan-séquence de 21 minutes. Et pour la surprise qualitative, <strong>Balle perdue</strong> est la pépite française que peu de gens connaissent.</p>
</details>
<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel film d'action Netflix sous-coté mérite le plus d'attention ?</summary>
  <p style="margin-top: 10px;"><strong>Wheelman</strong> et <strong>Mosul</strong> sont les deux grandes victimes de l'algorithme. Wheelman est un thriller d'action minimaliste et nerveux, tourné presque entièrement dans une voiture. Mosul est un film de guerre irakien d'une intégrité rare. Les deux méritent largement plus d'attention que leur notoriété actuelle ne le laisse croire.</p>
</details>
<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Quel film d'action Netflix avec beaucoup de combats ?</summary>
  <p style="margin-top: 10px;">Pour les combats corps-à-corps purs : <strong>The Night Comes for Us</strong> est la référence absolue. <strong>Kate</strong> et <strong>Polar</strong> offrent également de belles séquences de combat bien chorégraphiées. <strong>Carter</strong> pousse le concept à l'extrême avec son plan-séquence de deux heures.</p>
</details>
<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Y a-t-il des films d'action Netflix originaux vraiment bons ?</summary>
  <p style="margin-top: 10px;">Oui — et c'est même l'un des points forts de la plateforme. <strong>Extraction 2</strong>, <strong>Mosul</strong>, <strong>Carter</strong>, <strong>Kate</strong> et <strong>6 Underground</strong> sont tous des productions Netflix originales. La plateforme investit massivement dans le genre avec des budgets comparables aux studios hollywoodiens.</p>
</details>
<details style="border: 2px solid #dc2626; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
  <summary style="font-weight: 700; cursor: pointer; font-size: 1.05em;">Film d'action Netflix pour regarder en famille ou entre amis ?</summary>
  <p style="margin-top: 10px;"><strong>Extraction 2</strong> et <strong>6 Underground</strong> sont les options les plus accessibles et spectaculaires pour un groupe. <strong>Triple Frontier</strong> convient à un public plus adulte cherchant un film d'action avec plus de substance. Évitez <strong>The Night Comes for Us</strong> et <strong>Mosul</strong> pour les jeunes publics — le contenu est très violent ou dérangeant.</p>
</details>`;

  const conclusion = `<h2 style="border-bottom: 6px solid #dc2626; padding-bottom: 8px;">Films d'action Netflix 2026 : notre verdict final</h2>
<p>Netflix a construit au fil des années un catalogue d'action solide, avec des productions originales ambitieuses et des acquisitions pointues. <strong>The Night Comes for Us</strong> reste le mètre-étalon pour les combats, <strong>Extraction 2</strong> pour le spectacle, et <strong>Balle perdue</strong> pour la surprise qualitative.</p>
<p>Quelle que soit ton envie ce soir — du brutal, du nerveux, du réaliste ou du pur divertissement — cette liste a ce qu'il te faut.</p>
<p>👉 À lire aussi :
  <a href="/article/10-films-meconnus-netflix-2026" style="color:#dc2626;">films méconnus Netflix à voir en 2026</a>,
  <a href="/article/10-thrillers-sous-cotes-a-voir-absolument" style="color:#dc2626;">thrillers sous-cotés à voir absolument</a>,
  <a href="/article/quel-film-regarder-ce-soir-guide-2026" style="color:#dc2626;">quel film regarder ce soir</a>
</p>`;

  return intro + '\n' + films.join('\n') + '\n' + sectionChoice + '\n' + faq + '\n' + conclusion;
}

async function run() {
  const tmdb = {};
  for (const m of movies) {
    console.log(`🔍 ${m.title} (${m.year})`);
    const data = await fetchMovieData(m);
    if (data) { tmdb[m.title] = data; console.log(`  ✅ ${data.backdrops.length} backdrops`); }
    await new Promise(r => setTimeout(r, 300));
  }

  const content = buildContent(tmdb);

  const articleData = {
    title: 'Meilleurs films d\'action Netflix à voir en 2026',
    slug: 'meilleurs-films-action-netflix-2026',
    excerpt: 'The Night Comes for Us, Extraction 2, Balle perdue... Notre sélection des meilleurs films d\'action disponibles sur Netflix en 2026, avec carrousels et guide par genre.',
    category: 'list',
    tags: ['films d\'action Netflix', 'Netflix 2026', 'meilleur film action', 'Extraction 2', 'Balle perdue', 'film d\'action', 'The Night Comes for Us'],
    status: 'published',
    cover_image: tmdb['Extraction 2'].backdrops[0] || tmdb['Extraction 2'].poster,
    source_url: 'https://www.moviehunt-blog.fr',
    published_at: new Date().toISOString(),
    metadata: { movieTitle: 'Meilleurs films d\'action Netflix 2026', releaseYear: '2026', genre: ['Action', 'Thriller', 'Guerre'] },
    seo: {
      metaTitle: 'Meilleurs films d\'action Netflix 2026 : notre sélection complète',
      metaDescription: 'The Night Comes for Us, Extraction 2, Balle perdue... Les meilleurs films d\'action sur Netflix en 2026 : du brutal, du nerveux et quelques pépites méconnues.',
      keywords: [
        'meilleur film action Netflix',
        'film d\'action Netflix 2026',
        'bon film action Netflix',
        'film action Netflix sous-coté',
        'Extraction 2 critique',
        'The Night Comes for Us Netflix',
        'Balle perdue Netflix',
        'meilleur film Netflix action',
        'film Netflix à voir ce soir action',
        'Triple Frontier Netflix',
        'film guerre Netflix',
        'Wheelman Netflix',
      ],
    },
    content,
  };

  const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
  if (error) { console.error('❌', error.message); process.exit(1); }
  console.log('\n✅ Article publié !');
  console.log('🔗 https://www.moviehunt-blog.fr/article/' + data.slug);
}

run().catch(console.error);
