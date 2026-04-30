require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ─── Nouvelles sections HTML ────────────────────────────────────────────── */

const SECTION_SF_SOUS_MARINS = `<h2>Leviathan dans la tradition des films de SF sous-marins</h2>
<p>Leviathan s'inscrit dans une vague de films de science-fiction sous-marins sortis à la fin des années 80, une période brève mais fertile pour ce sous-genre. En 1989 uniquement, trois productions majeures exploitent le filon des profondeurs océaniques : <strong>The Abyss</strong> de James Cameron, <strong>DeepStar Six</strong> de Sean S. Cunningham, et donc <strong>Leviathan</strong> de George P. Cosmatos.</p>
<p>Parmi ces trois films, Leviathan est sans doute le plus oublié — injustement. Là où The Abyss joue la carte du spectacle et de l'émotion, et où DeepStar Six assume son statut de série B décomplexée, Leviathan tente un équilibre entre tension atmosphérique et horreur corporelle qui lui confère une identité propre.</p>
<p>Pour les amateurs de films se déroulant sous les océans, Leviathan reste une pièce incontournable du puzzle, même imparfaite. Son cadre claustrophobique et son ambiance de huis-clos aquatique en font une expérience à part dans la science-fiction de l'époque.</p>`;

const SECTION_FANS_ALIEN = `<h2>Leviathan, le film idéal pour les fans d'Alien et de The Thing ?</h2>
<p>Si vous avez aimé <strong>Alien</strong> de Ridley Scott ou <strong>The Thing</strong> de John Carpenter, Leviathan est fait pour vous — à condition d'en accepter les limites. Le film reprend les ingrédients qui ont fait le succès de ces deux classiques : un groupe isolé confronté à une créature hostile, une paranoïa croissante, une mort progressive des membres de l'équipe, et une résolution en huis clos sans issue évidente.</p>
<p>La comparaison avec Alien est particulièrement pertinente : dans les deux cas, la créature est une menace d'origine biologique découverte par accident, et la survie passe par la cohésion d'un groupe que la peur finit par désintégrer. Leviathan transpose simplement cette formule du cosmos vers les fonds marins, avec une efficacité variable selon les séquences.</p>
<p>La filiation avec The Thing est également visible dans le traitement de la créature, dont la nature changeante et parasitaire rappelle le monstre de Carpenter. Ce n'est pas une coïncidence : les trois films partagent une même obsession pour la perte d'identité et la contamination comme métaphore de la menace intérieure.</p>
<p>Leviathan n'atteint pas la maîtrise de ses modèles, mais pour tout spectateur en quête de science-fiction atmosphérique des années 80, c'est une découverte qui mérite le détour.</p>`;

const SECTION_DISTRIBUTION = `<h2>Distribution de Leviathan (1989)</h2>
<ul>
<li><strong>Peter Weller</strong> (Steven Beck) — Connu pour son rôle dans RoboCop (1987), Weller apporte une présence sobre et crédible dans le rôle du chef d'équipe.</li>
<li><strong>Richard Crenna</strong> (Dr. Glen "Doc" Thompson) — Vétéran du cinéma américain, il incarne le médecin de l'équipe dont les découvertes font basculer le film.</li>
<li><strong>Amanda Pays</strong> (Elizabeth "Willie" Williams) — L'une des rares survivantes potentielles, son personnage apporte une tension émotionnelle bienvenue.</li>
<li><strong>Daniel Stern</strong> (Sixpack) — Dans un registre plus comique, il offre un contrepoint humain à l'horreur ambiante.</li>
<li><strong>Ernie Hudson</strong> (Justin Jones) — Présent dans un rôle secondaire mais mémorable.</li>
<li><strong>Réalisateur</strong> : George P. Cosmatos, également derrière Rambo: First Blood Part II et, plus tard, Tombstone.</li>
<li><strong>Musique</strong> : Jerry Goldsmith, compositeur légendaire dont la partition renforce l'atmosphère oppressante du film.</li>
</ul>`;

async function run() {
  /* 1. Trouver l'article Leviathan */
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, seo, metadata')
    .ilike('title', '%leviathan%')
    .eq('status', 'published');

  if (error || !articles?.length) {
    console.error('❌ Article Leviathan introuvable :', error?.message);
    process.exit(1);
  }

  const article = articles[0];
  console.log(`✅ Article trouvé : "${article.title}" (slug: ${article.slug})`);

  const h2s = [...article.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
  console.log('📋 H2 actuelles :', h2s);

  let content = article.content;

  /* ── Garder idempotence : ne pas insérer si déjà présent ── */
  const alreadyHasSFSection = content.includes('tradition des films de SF sous-marins');
  const alreadyHasAlienSection = content.includes("fans d'Alien et de The Thing");
  const alreadyHasDistribution = content.includes('Distribution de Leviathan');

  /* ── Insérer section SF sous-marins après Synopsis ── */
  if (!alreadyHasSFSection) {
    const synopsisEnd = content.match(/<h2[^>]*>(?:Ce qui fonctionne|Points forts|Analyse|Réserves|Notre verdict)[^<]*<\/h2>/i);
    if (synopsisEnd) {
      content = content.replace(synopsisEnd[0], SECTION_SF_SOUS_MARINS + '\n' + synopsisEnd[0]);
      console.log('✅ Section "SF sous-marins" insérée.');
    } else {
      const firstH2 = content.match(/<h2[^>]*>.*?<\/h2>/i);
      if (firstH2) content = content.replace(firstH2[0], firstH2[0] + '\n' + SECTION_SF_SOUS_MARINS);
      console.log('⚠️  Section "SF sous-marins" insérée après la première H2 (fallback).');
    }
  } else {
    console.log('⏭️  Section SF sous-marins déjà présente.');
  }

  /* ── Insérer section Alien/Thing avant "Notre verdict" ── */
  if (!alreadyHasAlienSection) {
    const verdictMatch = content.match(/<h2[^>]*>(?:Notre verdict|Conclusion)[^<]*<\/h2>/i);
    if (verdictMatch) {
      content = content.replace(verdictMatch[0], SECTION_FANS_ALIEN + '\n' + verdictMatch[0]);
      console.log('✅ Section "Fans d\'Alien" insérée avant Notre verdict.');
    } else {
      content += '\n' + SECTION_FANS_ALIEN;
      console.log('⚠️  Section "Fans d\'Alien" ajoutée en fin de contenu (fallback).');
    }
  } else {
    console.log('⏭️  Section Alien déjà présente.');
  }

  /* ── Remplacer ou ajouter section Distribution ── */
  if (!alreadyHasDistribution) {
    const castingMatch = content.match(/<h2[^>]*>[^<]*(?:casting|équipe technique|distribution)[^<]*<\/h2>[\s\S]*?(?=<h2|$)/i);
    if (castingMatch) {
      content = content.replace(castingMatch[0], SECTION_DISTRIBUTION + '\n');
      console.log('✅ Section Distribution a remplacé la section casting.');
    } else {
      const verdictMatch = content.match(/<h2[^>]*>(?:Notre verdict|Conclusion)[^<]*<\/h2>/i);
      if (verdictMatch) {
        content = content.replace(verdictMatch[0], SECTION_DISTRIBUTION + '\n' + verdictMatch[0]);
        console.log('⚠️  Distribution insérée avant Notre verdict (fallback — pas de casting trouvé).');
      }
    }
  } else {
    console.log('⏭️  Distribution déjà présente.');
  }

  /* 2. Mettre à jour title + SEO */
  const newTitle = 'Leviathan (1989) : critique du film de SF sous-marin culte des années 80';
  const newSeo = {
    ...(article.seo || {}),
    metaTitle: 'Leviathan (1989) : le film de SF sous-marin oublié des années 80 | MovieHunt',
    metaDescription: 'Si vous adorez Alien et The Thing, ce film de SF sous-marin de 1989 mérite votre attention. Découvrez pourquoi Leviathan est la pépite oubliée des années 80.',
    keywords: [
      ...(article.seo?.keywords || []),
      'film SF sous-marin', 'leviathan 1989', 'film similaire alien', 'film comme the thing',
      'SF sous-marine années 80', 'george cosmatos', 'peter weller',
    ].filter((v, i, a) => a.indexOf(v) === i),
  };

  /* 3. Update Supabase */
  const { error: updateError } = await supabase
    .from('articles')
    .update({
      title: newTitle,
      content,
      seo: newSeo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', article.id);

  if (updateError) {
    console.error('❌ Erreur mise à jour :', updateError.message);
    process.exit(1);
  }

  console.log(`\n🎉 Article Leviathan mis à jour !`);
  console.log(`   Nouveau titre  : ${newTitle}`);
  console.log(`   Taille contenu : ${content.length} caractères`);
}

run().catch(console.error);
