require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SLUG = 'level-16-une-dystopie-intrigante-mais-une-execution-decevante';

/* ─── Bloc 1 : Explication de la fin ──────────────────────────────────────── */
const BLOC_FIN = `
<h2>Explication de la fin de Level 16</h2>
<p>La fin de Level 16 est sans doute la partie la plus réussie du film, et celle qui suscite le plus de questions. Voici ce qui se passe et ce que cela signifie.</p>
<h3>Ce que révèle le dénouement</h3>
<p>Tout au long du film, les jeunes filles de l'Académie Vestalis sont conditionnées à croire qu'elles se préparent à devenir des épouses parfaites pour des familles de l'élite. La vérité est bien plus sombre : elles sont élevées comme des produits de beauté vivants. Leur peau, maintenue intacte grâce à une routine stricte et à des pilules dont elles ignorent la nature, est destinée à être récoltée pour de riches clientes qui souhaitent rajeunir leur apparence.</p>
<h3>La fuite de Vivien et Sofia</h3>
<p>Vivien, aidée par le Dr Miro qui finit par trahir Brixil, parvient à s'échapper avec Sofia avant que la procédure ne soit réalisée sur elles. La dernière scène les montre toutes deux à l'extérieur pour la première fois — libres, mais désorientées face à un monde qu'elles n'ont jamais connu. La fin est volontairement ouverte : le film ne montre pas ce qu'elles deviennent, laissant planer l'incertitude sur leur avenir.</p>
<h3>Une fin efficace, mais trop tardive</h3>
<p>Le problème soulevé par beaucoup de spectateurs, c'est que cette révélation arrive trop tard dans le récit. Le rythme lent des deux premiers actes épuise la patience avant d'atteindre ce climax pourtant bien construit. La fin vaut le détour — mais elle ne compense pas entièrement les longueurs qui la précèdent.</p>`;

/* ─── Bloc 2 : Distribution ────────────────────────────────────────────────── */
const BLOC_DISTRIBUTION = `<h2>Distribution de Level 16</h2>
<p><strong>Katie Stuart — Vivien</strong><br>
Katie Stuart porte le film sur ses épaules dans le rôle de Vivien, la protagoniste déterminée qui refuse de se soumettre aux règles de l'Académie. Son interprétation sobre et convaincante est l'un des points forts indéniables du film.</p>
<p><strong>Celeste Sully — Sofia</strong><br>
Celeste Sully incarne Sofia, l'ancienne amie de Vivien avec qui elle se réconcilie. Le duo qu'elles forment constitue le cœur émotionnel du récit, même si leur relation aurait mérité davantage de développement.</p>
<p><strong>Sara Canning — Dr. Miro</strong><br>
Sara Canning joue la scientifique complice du système, dont l'arc narratif vers la rédemption est l'un des plus intéressants du film. Sa prestation nuancée apporte une dimension morale bienvenue.</p>
<p><strong>Peter Outerbridge — Brixil</strong><br>
Peter Outerbridge campe le directeur de l'institution, personnage autoritaire et inquiétant. Son interprétation est efficace, bien que le rôle manque d'épaisseur.</p>
<p><strong>Réalisatrice : Danishka Esterhazy</strong><br>
Level 16 est réalisé par la Canadienne Danishka Esterhazy, également scénariste du film. Si son univers visuel est cohérent et l'atmosphère claustrophobique bien maîtrisée, le script ne lui permet pas d'exploiter pleinement le potentiel dystopique de son concept.</p>`;

async function run() {
  /* 1. Lecture de l'article */
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, content')
    .eq('slug', SLUG)
    .single();

  if (error || !data) {
    console.error('❌ Article introuvable :', error?.message);
    process.exit(1);
  }

  console.log(`✅ Article trouvé : ${data.title}`);
  console.log(`📏 Taille du contenu : ${data.content.length} caractères\n`);

  /* 2. Détecter les ancres H2 présentes */
  const h2Tags = [...data.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
  console.log('📋 H2 trouvées :', h2Tags);

  let content = data.content;
  let modified = false;

  /* ── Bloc 1 : insérer avant la première h2 "Conclusion" ── */
  // Cherche <h2 ...>Conclusion... ou Notre verdict
  const conclusionMatch = content.match(/<h2[^>]*>(?:Conclusion|Notre verdict)[^<]*<\/h2>/i);
  if (conclusionMatch) {
    content = content.replace(conclusionMatch[0], BLOC_FIN + '\n' + conclusionMatch[0]);
    console.log(`\n✅ Bloc 1 (fin) inséré avant : "${conclusionMatch[0]}"`);
    modified = true;
  } else {
    // Fallback : insérer avant la dernière h2
    const lastH2 = [...content.matchAll(/<h2[^>]*>.*?<\/h2>/gi)].pop();
    if (lastH2) {
      content = content.replace(lastH2[0], BLOC_FIN + '\n' + lastH2[0]);
      console.log(`\n⚠️  Pas de "Conclusion" trouvée — Bloc 1 inséré avant la dernière H2 : "${lastH2[0]}"`);
      modified = true;
    } else {
      console.log('❌ Bloc 1 : impossible de trouver un point d\'insertion.');
    }
  }

  /* ── Bloc 2 : remplacer la section casting ── */
  // Trouve <h2>...casting...équipe... et tout ce qui suit jusqu'à la prochaine h2
  const castingReplaced = content.replace(
    /<h2[^>]*>(?:[^<]*(?:casting|équipe technique|cast)[^<]*)<\/h2>[\s\S]*?(?=<h2|$)/i,
    BLOC_DISTRIBUTION + '\n'
  );

  if (castingReplaced !== content) {
    content = castingReplaced;
    console.log('✅ Bloc 2 (distribution) a remplacé la section casting existante.');
    modified = true;
  } else {
    // Fallback : insérer après la première h2
    const firstH2 = content.match(/<h2[^>]*>.*?<\/h2>/i);
    if (firstH2) {
      // Trouve la fin du premier bloc (jusqu'à la prochaine h2)
      const afterFirstSection = content.match(/<h2[^>]*>.*?<\/h2>[\s\S]*?(?=<h2)/i);
      if (afterFirstSection) {
        content = content.replace(
          afterFirstSection[0],
          afterFirstSection[0] + '\n' + BLOC_DISTRIBUTION + '\n'
        );
        console.log('⚠️  Pas de section casting trouvée — Bloc 2 inséré après la première section.');
        modified = true;
      }
    }
  }

  if (!modified) {
    console.log('\n❌ Aucune modification effectuée. Vérifiez la structure du contenu.');
    process.exit(1);
  }

  /* 3. Mise à jour Supabase */
  const { error: updateError } = await supabase
    .from('articles')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('slug', SLUG);

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour :', updateError.message);
    process.exit(1);
  }

  console.log('\n🎉 Article mis à jour avec succès dans Supabase !');
  console.log(`📏 Nouvelle taille du contenu : ${content.length} caractères`);
}

run().catch(console.error);
