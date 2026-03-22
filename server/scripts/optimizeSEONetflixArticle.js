require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateOptimizedContent() {
  const intro = `
    <p>Tu as l'impression de passer plus de temps à faire défiler le catalogue Netflix qu'à réellement regarder un film ? C'est le piège classique. L'algorithme de Netflix est conçu pour te pousser les mêmes blockbusters et les séries du moment. Résultat : des dizaines de chefs-d'œuvre passent sous ton radar.</p>
    
    <p>Si tu cherches que regarder ce soir et que tu en as marre du réchauffé, tu es au bon endroit. Voici 10 films méconnus sur Netflix, de véritables pépites sous-cotées qui valent largement le détour. Pas de recommandations banales, juste du suspense, des concepts fous et des scénarios qui retournent le cerveau.</p>
  `;
  
  const films = [
    {
      number: 1,
      title: 'Circle (2015) : Le jeu de massacre psychologique',
      genre: 'Thriller / Science-fiction',
      duration: '1h 27min',
      pitch: '50 inconnus se réveillent disposés en cercle dans une pièce sombre. Toutes les deux minutes, l\'un d\'eux est foudroyé… à moins que le groupe ne vote pour choisir la prochaine victime.',
      why: 'Un huis clos oppressant aux faux airs de Black Mirror. Ce film indépendant repose sur un concept minimaliste redoutablement efficace. La vraie force de Circle réside dans son étude sociologique cruelle : face à la mort, quels critères les humains utilisent-ils pour juger qui mérite de vivre ? Tu te demanderas constamment : « Et moi, j\'aurais voté pour qui ? »',
      images: [
        'https://image.tmdb.org/t/p/original/o3505VxhHKHbfTmuNif1ukjXDxI.jpg',
        'https://image.tmdb.org/t/p/original/siaFJwm0uXxkZJFEUSB6rumFpiM.jpg',
        'https://image.tmdb.org/t/p/original/njEZ071F99BPSotJdWL0SBFmK2b.jpg',
        'https://image.tmdb.org/t/p/original/bdK8j5xazVK1v84I4IEarwKxJp.jpg',
        'https://image.tmdb.org/t/p/original/sD0Pbj3CExPZDpZNsvf6rsYFKsz.jpg'
      ]
    },
    {
      number: 2,
      title: 'I Am Mother (2019) : La science-fiction intelligente',
      genre: 'Anticipation / Huis clos',
      casting: 'Hilary Swank, Clara Rugaard',
      pitch: 'Dans un bunker post-apocalyptique, une adolescente est élevée par "Mère", un robot bienveillant conçu pour repeupler la Terre. Mais l\'arrivée soudaine d\'une femme blessée venue de l\'extérieur va faire voler en éclats toutes ses certitudes.',
      why: 'Loin des explosions habituelles de la SF, ce film pose de vraies questions philosophiques sur l\'intelligence artificielle et la moralité. La tension monte crescendo jusqu\'à un final glaçant.',
      images: [
        'https://image.tmdb.org/t/p/original/xHL8KdLavIQ3kNrOk9S1av4Qxh.jpg',
        'https://image.tmdb.org/t/p/original/8tqVlaXwF2vbMWMDa909IhdrTRc.jpg',
        'https://image.tmdb.org/t/p/original/aI0NqNw8Uh50L9JmX1pcgK97t7Y.jpg',
        'https://image.tmdb.org/t/p/original/xmKUgQ7J2ri9kFGNvCPPWTCDj9Y.jpg',
        'https://image.tmdb.org/t/p/original/1ShvGfnSgnFUgygharI833EhfWB.jpg'
      ]
    },
    {
      number: 3,
      title: 'Calibre (2018) : La tension à son paroxysme',
      genre: 'Thriller dramatique',
      casting: 'Jack Lowden, Martin McCann',
      pitch: 'Deux amis d\'enfance partent pour un paisible week-end de chasse dans les Highlands écossais. Une seconde d\'inattention, un coup de feu accidentel, et leur vie bascule dans un cauchemar absolu.',
      why: 'Probablement l\'un des thrillers les plus angoissants du catalogue Netflix. L\'atmosphère est poisseuse, réaliste et terriblement étouffante. Un film sur la culpabilité qui te prendra aux tripes du début à la fin.',
      images: [
        'https://image.tmdb.org/t/p/original/9YJqI5vudysYgU21YHfC2JHKG6t.jpg',
        'https://image.tmdb.org/t/p/original/yVfhwgLBFDdI1LuaiFfA7y2FbVi.jpg',
        'https://image.tmdb.org/t/p/original/6rjFABTmijw4rN4m9jsbrAtb7ye.jpg',
        'https://image.tmdb.org/t/p/original/g4DQz2aKCahEbpx25ZmP49PhLhy.jpg',
        'https://image.tmdb.org/t/p/original/hRaPmA9qj0NQTWqm9sI7RKSQHHh.jpg'
      ]
    },
    {
      number: 4,
      title: 'ARQ (2016) : La boucle temporelle nerveuse',
      genre: 'Action / SF',
      casting: 'Robbie Amell, Rachael Taylor',
      pitch: 'Dans un futur dystopique ravagé par une guerre énergétique, un ingénieur et sa compagne sont coincés dans un laboratoire. Ils revivent sans cesse la même attaque mortelle et doivent utiliser cette boucle temporelle pour protéger une technologie révolutionnaire.',
      why: 'Un savant mélange entre Un jour sans fin et un thriller d\'action nerveux. Malgré un budget modeste, le film exploite son concept de manière brillante et ne laisse aucun temps mort.',
      images: [
        'https://image.tmdb.org/t/p/original/lmWgxzQ7elUxUYvOfxbSmifaJz6.jpg',
        'https://image.tmdb.org/t/p/original/oX6rYilUqQJMcMzCn6K61UifOnN.jpg',
        'https://image.tmdb.org/t/p/original/j0lNy1gYVgGyWMsM8kiwiytO3lc.jpg',
        'https://image.tmdb.org/t/p/original/76RGYmhjCOdX8LMVRox7hObYe3p.jpg',
        'https://image.tmdb.org/t/p/w500/mU4VeXVK18JtCZsy7i0zczlA9p7.jpg'
      ]
    },
    {
      number: 5,
      title: 'His House (2020) : L\'horreur qui a du sens',
      genre: 'Épouvante / Drame social',
      casting: 'Wunmi Mosaku, Sope Dirisu',
      pitch: 'Un couple de réfugiés fuit la guerre au Soudan du Sud pour trouver asile en Angleterre. Mais la maison délabrée que l\'État leur a attribuée semble habitée par une force sinistre venue de leur passé.',
      why: 'Une masterclass. Ce n\'est pas qu\'un simple film de fantômes ou de maison hantée ; c\'est une métaphore poignante sur le traumatisme de l\'exil. Un mélange parfait et acclamé par la critique (100% sur Rotten Tomatoes !).',
      images: [
        'https://image.tmdb.org/t/p/original/bNZB25TQxt0jEVgJOJ09tD2es7k.jpg',
        'https://image.tmdb.org/t/p/original/6aVB2B2GDc4EuNinHgoBgtkuHQz.jpg',
        'https://image.tmdb.org/t/p/original/xS7L5PB8XN3JgVDOVkrGwDwDlQl.jpg',
        'https://image.tmdb.org/t/p/original/j9Q3TozycFFnXHcO6wEMaE63L0w.jpg',
        'https://image.tmdb.org/t/p/original/7bXSX5GQrNQSZpvKUMPMnZ4wDdz.jpg'
      ]
    },
    {
      number: 6,
      title: 'Fractured (La Faille) (2019) : Le puzzle mental',
      genre: 'Thriller psychologique',
      casting: 'Sam Worthington, Lily Rabe',
      pitch: 'Après un accident de la route, un père amène sa fille et sa femme aux urgences. Il s\'endort dans la salle d\'attente. À son réveil, sa famille a disparu et l\'hôpital affirme ne les avoir jamais admis.',
      why: 'Un thriller paranoïaque qui joue avec tes nerfs. Le scénario est conçu pour te faire douter de tout et de tout le monde, jusqu\'au twist final particulièrement retors.',
      images: [
        'https://image.tmdb.org/t/p/original/6y4748yU4dnrI7jF2loGscmiVXQ.jpg',
        'https://image.tmdb.org/t/p/original/xaA40kSRy4liGR015hwsg4OU8oD.jpg',
        'https://image.tmdb.org/t/p/original/bk6k1DV4v73bOjvDdbdtU4XUNHL.jpg',
        'https://image.tmdb.org/t/p/original/3UnUxeEAGoZhjIW8X1HpEuDPngV.jpg',
        'https://image.tmdb.org/t/p/original/yrnvvKc4kcky9waO86Y5px8E0mi.jpg'
      ]
    },
    {
      number: 7,
      title: 'Oxygène (2021) : Claustrophobes s\'abstenir',
      genre: 'Survie / Science-fiction',
      casting: 'Mélanie Laurent, Mathieu Amalric (voix)',
      pitch: 'Une femme amnésique se réveille enfermée dans une capsule cryogénique médicale. Le niveau d\'oxygène baisse dangereusement. Elle doit retrouver la mémoire pour comprendre comment s\'échapper avant l\'asphyxie.',
      why: 'Le réalisateur français Alexandre Aja nous livre un huis clos de survie intense, porté de bout en bout par la performance exceptionnelle de Mélanie Laurent. Une course contre la montre haletante.',
      images: [
        'https://image.tmdb.org/t/p/original/jedggylU3FyIN7XRAl9WY8mrT6H.jpg',
        'https://image.tmdb.org/t/p/original/ngavnE7Go8uHZBIulRiLccB2yo2.jpg',
        'https://image.tmdb.org/t/p/original/fnBvTY3vvvtbblgH6zpS7G5QcK3.jpg',
        'https://image.tmdb.org/t/p/original/nJI2tiTOuPddtK5SxnrBqKephoN.jpg',
        'https://image.tmdb.org/t/p/original/bLpmea4xMx0ug1DVngArG4RVK0r.jpg'
      ]
    },
    {
      number: 8,
      title: 'Triple Frontière (2019) : Le braquage atypique',
      genre: 'Action / Braquage',
      casting: 'Ben Affleck, Oscar Isaac, Pedro Pascal',
      pitch: 'D\'anciens membres des forces spéciales décident de monter un braquage illégal pour dérober la fortune d\'un baron de la drogue en Amérique du Sud. Mais l\'avidité va rapidement compliquer l\'opération.',
      why: 'Bien qu\'il ait un casting 5 étoiles, il est souvent oublié au fond du catalogue. C\'est bien plus qu\'un simple film de gros bras : il aborde la loyauté, les conséquences de la guerre et la nature corruptible de l\'homme.',
      images: [
        'https://image.tmdb.org/t/p/original/s9I2LmQMYCanl6DvC3X1AOHs2r8.jpg',
        'https://image.tmdb.org/t/p/original/cqNcRm8vCkwhdlbjKZA5kwun29C.jpg',
        'https://image.tmdb.org/t/p/original/7oJM610PnqcmvRCTLsFQuS5LzOJ.jpg',
        'https://image.tmdb.org/t/p/original/oAHrzWUakQoukH4Gt2UKdYXMSPH.jpg',
        'https://image.tmdb.org/t/p/original/tDfe64KY5RMDr5ebAOM31LbMBB.jpg'
      ]
    },
    {
      number: 9,
      title: 'The Discovery (2017) : Et si l\'au-delà existait ?',
      genre: 'Romance / Drame de SF',
      casting: 'Robert Redford, Rooney Mara, Jason Segel',
      pitch: 'Un scientifique prouve de manière irréfutable l\'existence d\'une vie après la mort. Cette découverte provoque une vague de suicides massive à l\'échelle mondiale, les gens cherchant à "passer de l\'autre côté".',
      why: 'Un film contemplatif, philosophique et mélancolique qui détonne avec les productions habituelles. Une ambiance unique pour ceux qui aiment les scénarios d\'anticipation profonds.',
      images: [
        'https://image.tmdb.org/t/p/original/dA7YLnc5ztTGiVPWz3GsaMRRz9r.jpg',
        'https://image.tmdb.org/t/p/original/m9u63vI5vPrxEv3lHuQ5y8hHcgv.jpg',
        'https://image.tmdb.org/t/p/original/uoVoeZQLsw1MRZFx3Vf0P8rU3G3.jpg',
        'https://image.tmdb.org/t/p/original/iDyBZjtpf6PId0LYlWZE37PkT6Y.jpg',
        'https://image.tmdb.org/t/p/original/n8v2uCsv5Om5x0ip1fhTQw3ne5r.jpg'
      ]
    },
    {
      number: 10,
      title: 'Meurtres sans ordonnance (The Good Nurse) (2022) : Le true crime effrayant',
      genre: 'Thriller / Fait divers',
      casting: 'Jessica Chastain, Eddie Redmayne',
      pitch: 'Amy, une infirmière compatissante, commence à soupçonner son nouveau et discret collègue, Charlie, d\'être responsable d\'une série de décès inexpliqués parmi les patients de l\'hôpital.',
      why: 'Tiré d\'une glaçante histoire vraie, ce film repose entièrement sur la tension psychologique et le jeu exceptionnel de ses deux acteurs oscarisés. Froid, clinique, et redoutable.',
      images: [
        'https://image.tmdb.org/t/p/original/x2U0R60Z7hmJxZixzsGZfjFJbve.jpg',
        'https://image.tmdb.org/t/p/original/rV0xrSgkOQj2EpiG8n16VHHJeg3.jpg',
        'https://image.tmdb.org/t/p/original/yWdUSIeMEIyjfWW8rrKJQLNRTUv.jpg',
        'https://image.tmdb.org/t/p/original/lnJHuJJ1aFUqrdGBbubIJc73eXw.jpg',
        'https://image.tmdb.org/t/p/original/cIdmthPJVaQaNf6uksQiRgXlTMO.jpg'
      ]
    }
  ];
  
  let content = intro;
  
  films.forEach((film) => {
    content += `
      <h2>${film.number}. ${film.title}</h2>
      <ul>
        <li><strong>Genre :</strong> ${film.genre}</li>
        ${film.duration ? `<li><strong>Durée :</strong> ${film.duration}</li>` : ''}
        ${film.casting ? `<li><strong>Casting :</strong> ${film.casting}</li>` : ''}
      </ul>
    `;
    
    if (film.images && film.images.length > 0) {
      content += `
        <div class="film-carousel" style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0; padding: 10px 0; scroll-snap-type: x mandatory;">
      `;
      
      film.images.forEach((imageUrl, index) => {
        const altText = `${film.title.split(':')[0]} - Image ${index + 1} du film Netflix - Scène du thriller ${film.genre}`;
        content += `
          <img src="${imageUrl}" alt="${altText}" style="height: 300px; width: auto; border-radius: 8px; flex-shrink: 0; scroll-snap-align: start;" loading="lazy" decoding="async" />
        `;
      });
      
      content += `</div>`;
    }
    
    content += `
      <h3>Synopsis de ${film.title.split(':')[0]}</h3>
      <p>${film.pitch}</p>
      <h3>Pourquoi regarder ${film.title.split(':')[0]} sur Netflix ?</h3>
      <p>${film.why}</p>
    `;
  });
  
  content += `
    <h2>Conclusion : Ne laisse plus l'algorithme Netflix choisir pour toi</h2>
    <p>Ces 10 pépites cachées sur Netflix partagent toutes un point commun : elles ont une véritable identité visuelle et narrative, loin des sentiers battus. La prochaine fois que tu ne sais pas quoi regarder sur Netflix, pioche dans cette liste de films méconnus, tu ne seras pas déçu.</p>
    
    <h2>FAQ : Les films cachés sur Netflix en 2026</h2>
    
    <h3>Comment trouver des films méconnus sur Netflix ?</h3>
    <p>Pour contourner l'algorithme Netflix, tu peux utiliser les "codes secrets Netflix". En tapant des codes spécifiques dans la barre de recherche (ou via l'URL sur ordinateur), tu peux accéder à des sous-catégories ultra-nichées (comme "Thrillers psychologiques" ou "Films de SF étrangers") qui ne s'affichent pas sur ton profil classique.</p>
    
    <h3>Quel est le meilleur thriller caché sur Netflix en 2026 ?</h3>
    <p>Si tu aimes la tension psychologique et l'action réaliste, Calibre est souvent cité comme l'un des meilleurs thrillers indépendants de la plateforme Netflix. Pour un huis clos mystérieux, Circle est un incontournable parmi les films méconnus.</p>
    
    <h3>Ces films méconnus vont-ils rester sur Netflix en 2026 ?</h3>
    <p>La plupart des films de cette liste (comme Oxygen, I Am Mother ou The Good Nurse) sont des "Netflix Originals", ce qui signifie qu'ils appartiennent à la plateforme et ne quitteront normalement jamais le catalogue Netflix. Tu peux donc les ajouter à ta liste sans crainte de les voir disparaître à la fin du mois.</p>
    
    <h3>Quels sont les meilleurs films cachés Netflix pour les fans de science-fiction ?</h3>
    <p>Pour les amateurs de SF, cette liste propose plusieurs pépites : I Am Mother (IA et post-apocalypse), ARQ (boucle temporelle), Oxygen (survie spatiale) et The Discovery (vie après la mort). Ces films méconnus Netflix offrent des concepts originaux loin des blockbusters habituels.</p>
  `;
  
  return content;
}

async function updateArticle() {
  const articleSlug = '10-films-meconnus-netflix-2026';
  const optimizedContent = generateOptimizedContent();
  
  const optimizedExcerpt = 'Découvre 10 films méconnus sur Netflix en 2026 : thrillers psychologiques, science-fiction intelligente et pépites cachées que l\'algorithme ne te montre jamais. Circle, I Am Mother, Calibre et 7 autres films à voir absolument.';
  
  const optimizedTitle = '10 Films Méconnus sur Netflix à Voir Absolument en 2026 | Pépites Cachées';
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({ 
        content: optimizedContent,
        excerpt: optimizedExcerpt,
        title: optimizedTitle,
        updated_at: new Date().toISOString()
      })
      .eq('slug', articleSlug)
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }
    
    console.log('✅ Article optimisé SEO avec succès!');
    console.log(`📄 Titre: ${data[0].title}`);
    console.log(`📝 Excerpt: ${data[0].excerpt}`);
    console.log(`🔍 Contenu optimisé avec H2/H3 et attributs alt`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

updateArticle().catch(console.error);
