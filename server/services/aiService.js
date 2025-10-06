const openai = require('../config/openai');

class AIService {
  /**
   * Génère un article de blog à partir des données scrapées
   * Utilise GPT-4o mini pour la génération
   */
  async generateArticle(scrapedData, sourceUrl) {
    try {
      console.log(`🤖 Génération d'article avec GPT-4o mini...`);

      const prompt = this.buildPrompt(scrapedData, sourceUrl);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un rédacteur expert en cinéma et critique de films. 
            Tu écris des articles de blog engageants, informatifs et optimisés pour le SEO.
            Ton style est professionnel mais accessible, avec une touche d'enthousiasme pour le cinéma.
            Tu structures tes articles avec des titres, sous-titres et paragraphes bien organisés.
            
            IMPORTANT: Tu génères du contenu en HTML pur pour un éditeur WYSIWYG (CKEditor 5).
            Utilise UNIQUEMENT ces balises HTML:
            - <h1>, <h2>, <h3>, <h4> pour les titres
            - <p> pour les paragraphes (OBLIGATOIRE pour chaque paragraphe)
            - <strong> pour le gras, <em> pour l'italique, <u> pour le souligné
            - <ul> et <li> pour les listes à puces
            - <ol> et <li> pour les listes numérotées
            - <a href="..."> pour les liens
            - <img src="..." alt="..."> pour les images
            - <blockquote> pour les citations
            - <figure> et <figcaption> pour les images avec légendes
            - Utilise les classes CKEditor pour l'alignement des images:
              * class="image-style-side" pour image à gauche
              * class="image-style-align-center" pour image centrée
              * class="image-style-align-right" pour image à droite
            
            N'utilise JAMAIS la syntaxe Markdown (##, **, *, etc.).
            Chaque paragraphe DOIT être entouré de balises <p></p>.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const generatedContent = completion.choices[0].message.content;
      
      // Parser le contenu généré pour extraire les différentes parties
      const article = this.parseGeneratedContent(generatedContent, scrapedData);

      console.log(`✅ Article généré avec succès`);
      return article;
    } catch (error) {
      console.error(`❌ Erreur de génération IA: ${error.message}`);
      throw new Error(`Échec de la génération: ${error.message}`);
    }
  }

  /**
   * Construit le prompt pour GPT-4o mini avec les données de l'API MovieHunt
   */
  buildPrompt(scrapedData, sourceUrl) {
    const metadata = scrapedData.metadata;
    
    // Validation des données essentielles (avec valeurs par défaut)
    if (!metadata.score && metadata.score !== 0) throw new Error('Score du film manquant');
    if (!metadata.releaseYear) throw new Error('Année de sortie manquante');
    if (!metadata.genre || metadata.genre.length === 0) throw new Error('Genres manquants');
    
    const score = metadata.score;
    const year = metadata.releaseYear;
    const genres = metadata.genre.join(', ');
    const hunted = metadata.hunted ? 'Oui - Film recommandé par MovieHunt' : 'Non';
    
    // Déterminer si on a des points négatifs
    const hasNegatives = metadata.review && metadata.review.trim().length > 0;
    
    return `Génère un article de blog complet et engageant sur le film "${scrapedData.title}" à partir des données MovieHunt.

⚠️ RÈGLE IMPORTANTE : ANALYSE LES DONNÉES FOURNIES
Certaines sections ci-dessous peuvent indiquer "Non disponible". Dans ce cas :
- N'invente RIEN
- N'écris PAS de section vide ou générique
- Adapte la structure de l'article en fonction des données disponibles
- Si le staff remarquable n'est pas disponible, ne le mentionne pas du tout
- Si les points forts ne sont pas disponibles, analyse le synopsis et les autres données pour créer du contenu pertinent
- Concentre-toi sur les informations qui SONT disponibles

═══════════════════════════════════════════════════════════════
📊 INFORMATIONS DU FILM
═══════════════════════════════════════════════════════════════
Titre: ${scrapedData.title}
Année: ${year}
Genres: ${genres}
Note MovieHunt: ${score}/10
${metadata.tmdbRating ? `Note TMDB: ${metadata.tmdbRating}/10` : ''}
Film recommandé (Hunted): ${hunted}

⚠️ IMPORTANT - TONALITÉ DE L'ARTICLE :
La note de ${score}/10 doit GUIDER la tonalité générale de ton article :
- Note 8-10/10 : Ton enthousiaste, très positif, recommandation forte
- Note 6-7/10 : Ton équilibré, nuancé, recommandation modérée
- Note 4-5/10 : Ton critique mais constructif, réserves importantes
- Note 0-3/10 : Ton déçu mais professionnel, déconseillé

Adapte ton vocabulaire, tes superlatifs et ton enthousiasme à cette note !

═══════════════════════════════════════════════════════════════
✨ POURQUOI VOIR CE FILM (Points forts à développer)
═══════════════════════════════════════════════════════════════
${metadata.highlights && metadata.highlights.trim().length > 0 ? metadata.highlights : 'Non disponible'}

${metadata.highlights && metadata.highlights.trim().length > 0 ? 'IMPORTANT: Développe CHAQUE point mentionné ci-dessus en détail dans la section "Ce qui fonctionne".' : 'IMPORTANT: Cette section n\'est pas disponible. Analyse le synopsis et les autres données pour créer une section "Ce qui fonctionne" pertinente.'}

═══════════════════════════════════════════════════════════════
💭 CE QUE NOUS N'AVONS PAS AIMÉ (Points négatifs à développer)
═══════════════════════════════════════════════════════════════
${metadata.review ? metadata.review : 'Aucun point négatif mentionné'}

${hasNegatives ? 'IMPORTANT: Développe CHAQUE point négatif mentionné ci-dessus en détail dans la section "Les réserves".' : 'IMPORTANT: Aucun point négatif n\'est mentionné. NE CRÉE PAS de section "Les réserves" dans l\'article.'}

═══════════════════════════════════════════════════════════════
📝 SYNOPSIS
═══════════════════════════════════════════════════════════════
${metadata.synopsis && metadata.synopsis.trim().length > 0 ? metadata.synopsis : (metadata.tmdbSynopsis && metadata.tmdbSynopsis.trim().length > 0 ? metadata.tmdbSynopsis : 'Non disponible')}

${metadata.tmdbSynopsis ? `
═══════════════════════════════════════════════════════════════
🎬 DONNÉES TMDB (The Movie Database)
═══════════════════════════════════════════════════════════════
Note TMDB: ${metadata.tmdbRating ? `${metadata.tmdbRating}/10` : 'N/A'}
Durée: ${metadata.runtime ? `${metadata.runtime} minutes` : 'N/A'}
${metadata.tagline ? `Tagline: "${metadata.tagline}"` : ''}
${metadata.budget ? `Budget: $${(metadata.budget / 1000000).toFixed(1)}M` : ''}
${metadata.revenue ? `Box Office: $${(metadata.revenue / 1000000).toFixed(1)}M` : ''}

NOTE: Utilise ces données pour enrichir ton article avec des informations précises.
` : ''}

═══════════════════════════════════════════════════════════════
🎬 STAFF REMARQUABLE (Personnes qui ont brillé dans le film)
═══════════════════════════════════════════════════════════════
${metadata.casting && metadata.casting.trim().length > 0 ? metadata.casting : 'Non disponible'}

NOTE: ${metadata.casting && metadata.casting.trim().length > 0 ? 
'Cette section met en avant les personnes qui ont brillé dans le film. Tu dois mentionner ces personnes ET parler aussi des autres acteurs principaux du film dans la section "Le casting et l\'équipe technique".' : 
'Cette section n\'est pas disponible. Dans la section "Le casting et l\'équipe technique", parle uniquement des acteurs principaux et de l\'équipe technique générale du film sans mentionner de "staff remarquable".'}

═══════════════════════════════════════════════════════════════
🔗 SOURCE
═══════════════════════════════════════════════════════════════
${sourceUrl}

═══════════════════════════════════════════════════════════════
📝 INSTRUCTIONS DE RÉDACTION
═══════════════════════════════════════════════════════════════

1. **Titre accrocheur** : Crée un titre captivant qui donne envie de lire (max 80 caractères)
   Exemple: "Deepwater : Le drame explosif de la plateforme pétrolière"

2. **Extrait/Résumé** : Rédige un résumé percutant de 150-200 caractères qui résume l'essence du film

3. **Article complet** (800-1200 mots) structuré ainsi EN HTML PUR :
   
   <h2>Introduction</h2> (2-3 paragraphes)
   - Accroche captivante ADAPTÉE à la note ${score}/10
   - Présentation du film (titre, année, réalisateur si connu)
   - Contexte et promesse du film
   ${scrapedData.images && scrapedData.images.length > 0 ? `
   - INTÈGRE une image TMDB au début avec cette syntaxe HTML CKEditor :
     <figure class="image image-style-align-center">
       <img src="/api/tmdb/proxy-image?url=${encodeURIComponent(scrapedData.images[0])}" alt="${scrapedData.title}" />
     </figure>
   ` : ''}
   
   <h2>Synopsis</h2>
   - Résumé de l'histoire sans spoilers majeurs
   - Mise en contexte
   ${scrapedData.images && scrapedData.images.length > 1 ? `
   - Tu PEUX ajouter une image TMDB ici si pertinent avec cette syntaxe HTML CKEditor :
     <figure class="image image-style-align-center">
       <img src="/api/tmdb/proxy-image?url=${encodeURIComponent(scrapedData.images[1])}" alt="Scène de ${scrapedData.title}" />
     </figure>
   ` : ''}
   
   <h2>Ce qui fonctionne</h2>
   ${metadata.highlights && metadata.highlights.trim().length > 0 ? 
   `- DÉVELOPPE EN DÉTAIL CHAQUE point fort mentionné dans "POURQUOI VOIR CE FILM"
   - Reprends EXACTEMENT les points listés et explique-les
   - Ajoute ton analyse personnelle pour enrichir` :
   `- Analyse le synopsis, le genre et les données TMDB pour identifier les points forts
   - Parle de ce qui rend ce film intéressant basé sur les informations disponibles`}
   - Parle de la réalisation, du jeu d'acteurs, de l'atmosphère
   
   ${hasNegatives ? `<h2>Les réserves</h2>
   - DÉVELOPPE EN DÉTAIL CHAQUE point négatif mentionné dans "CE QUE NOUS N'AVONS PAS AIMÉ"
   - Reprends EXACTEMENT les points listés et explique-les
   - Reste constructif et nuancé
   - N'invente PAS de points négatifs qui ne sont pas mentionnés` : ''}
   
   <h2>Le casting et l'équipe technique</h2>
   ${metadata.casting && metadata.casting.trim().length > 0 ? 
   `- COMMENCE TOUJOURS par mettre en avant les personnes du "STAFF REMARQUABLE" et explique pourquoi elles ont brillé
   - Tu PEUX ensuite mentionner d'autres acteurs importants du film (comme l'acteur principal) si cela te semble pertinent
   - NE mets PAS ces autres acteurs au même niveau que le staff remarquable
   - Si des techniciens sont dans le staff remarquable (réalisateur, photographe, musicien, scénariste), commente leur excellence` :
   `- Parle des acteurs principaux et de l'équipe technique du film
   - Mentionne le réalisateur si tu le connais
   - Commente le jeu d'acteur et les performances
   - Parle de la direction artistique, de la photographie ou de la musique si pertinent`}
   
   <h2>Notre verdict</h2>
   - Synthèse de l'avis
   - Pour quel public ?
   - CITE OBLIGATOIREMENT la note MovieHunt ${score}/10 dans cette section
   - Exemple: "Avec une note de ${score}/10, ce film..." ou "MovieHunt attribue ${score}/10 à ce film..."
   - Recommandation finale cohérente avec cette note
   ${metadata.hunted ? '- Mentionne que c\'est un film "Hunted" (recommandé) par MovieHunt' : ''}
   
   <h2>Conclusion</h2>
   - Phrase de clôture percutante
   - Invitation à découvrir le film
   
   RAPPEL: Utilise <p> pour CHAQUE paragraphe, <strong> pour le gras, <em> pour l'italique.
   N'utilise JAMAIS la syntaxe Markdown (##, **, *, etc.).

4. **Tags** : Génère 6-8 tags pertinents (genres, thèmes, acteurs principaux)

5. **SEO** :
   - Meta-titre : 50-60 caractères, optimisé pour le référencement
   - Meta-description : 150-160 caractères, incitative au clic
   - Keywords : 8-12 mots-clés stratégiques (voir section SEO ci-dessous)

═══════════════════════════════════════════════════════════════
📋 FORMAT DE RÉPONSE (RESPECTE EXACTEMENT CE FORMAT)
═══════════════════════════════════════════════════════════════

TITRE: [Ton titre accrocheur ici]
EXTRAIT: [Ton résumé de 150-200 caractères]
TAGS: [tag1, tag2, tag3, tag4, tag5, tag6]
META_TITRE: [Meta titre SEO 50-60 caractères]
META_DESCRIPTION: [Meta description SEO 150-160 caractères]
KEYWORDS: [keyword1, keyword2, keyword3, keyword4, keyword5]

CONTENU:
[Ton article complet ici avec les sections en ## comme indiqué ci-dessus]

═══════════════════════════════════════════════════════════════
⚠️ CONSIGNES IMPORTANTES
═══════════════════════════════════════════════════════════════
- Ton professionnel mais accessible
- Évite les spoilers majeurs
- ANALYSE LES DONNÉES : Si une section indique "Non disponible", ne l'inclus PAS dans l'article
- REPRENDS FIDÈLEMENT tous les points mentionnés dans les sections disponibles
- ${hasNegatives ? 'INCLUS la section "Les réserves" car des points négatifs sont mentionnés' : 'N\'INCLUS PAS de section "Les réserves" car aucun point négatif n\'est mentionné'}
- N'invente JAMAIS de points qui ne sont pas dans les données fournies
- NE METS JAMAIS de commentaires entre parenthèses du type "(bien que non mentionné)", "(même si)", etc.
- Écris de manière fluide et naturelle sans justifier tes choix éditoriaux dans le texte
- Si le staff remarquable est "Non disponible", ne le mentionne PAS du tout dans l'article
- Mentionne toujours MovieHunt comme source
- Reste objectif et constructif dans la critique

🎨 TONALITÉ ET FORMAT HTML CKEDITOR 5 :
- ADAPTE IMPÉRATIVEMENT ton enthousiasme à la note ${score}/10 (voir guide ci-dessus)
- GÉNÈRE DU HTML PUR pour CKEditor 5 : <h2>, <p>, <strong>, <em>, <ul>, <li>, <figure>, etc.
- N'utilise JAMAIS la syntaxe Markdown (##, **, *, etc.)
- INTÈGRE les images TMDB avec la syntaxe CKEditor :
  <figure class="image image-style-align-center">
    <img src="..." alt="..." />
  </figure>
- Pour les images alignées à gauche : class="image image-style-side"
- Pour les images alignées à droite : class="image image-style-align-right"
- Place 1-2 images stratégiquement dans l'article pour l'illustrer
- Chaque paragraphe DOIT être dans des balises <p></p>

═══════════════════════════════════════════════════════════════
🔍 STRATÉGIE SEO OBLIGATOIRE
═══════════════════════════════════════════════════════════════

1️⃣ MOTS-CLÉS GÉNÉRIQUES (à placer naturellement dans l'article)
   - "critique de film"
   - "avis film"
   - "analyse film"
   - "résumé sans spoiler"
   - "film à voir" ou "recommandation film"
   
   👉 Ces mots DOIVENT apparaître dans le titre, l'extrait et la méta-description

2️⃣ MOTS-CLÉS SPÉCIFIQUES (à intégrer dans l'article et les keywords)
   - "${scrapedData.title} critique"
   - "${scrapedData.title} avis"
   - "${scrapedData.title} explication"
   - "${scrapedData.title} résumé"
   - "${scrapedData.title} distribution" ou "${scrapedData.title} casting"
   - "${scrapedData.title} où le voir"
   
   👉 Utilise ces expressions naturellement dans ton contenu

3️⃣ MOTS-CLÉS STRATÉGIQUES MOVIEHUNT (positionnement unique)
   ${metadata.hiddenGem ? '- "film méconnu à voir" (CE FILM EST DANS LA SECTION FILMS MÉCONNUS - HIDDEN GEM)' : ''}
   ${score >= 5 ? '- "films recommandés par MovieHunt" (NOTE ≥ 5/10)' : ''}
   ${metadata.hunted ? '- "badge #HuntedbyMovieHunt" (FILM HUNTED - À METTRE EN AVANT)' : ''}
   
   👉 Ces mots-clés différencient MovieHunt : découvrir des films cachés, pas juste refaire les critiques déjà partout

4️⃣ KEYWORDS À GÉNÉRER
   Génère 8-12 keywords incluant :
   - Les mots-clés génériques (critique film, avis film)
   - Les mots-clés spécifiques au film (${scrapedData.title} critique, etc.)
   - Les mots-clés MovieHunt (si applicables)
   - Les genres du film
   - Les acteurs principaux

5️⃣ META-DESCRIPTION
   Ta méta-description DOIT contenir :
   - Le nom du film
   - Au moins 1 mot-clé générique (critique, avis, analyse)
   - Un appel à l'action
   - Mention de MovieHunt si pertinent`;
  }

  /**
   * Parse le contenu généré par l'IA
   */
  parseGeneratedContent(generatedContent, scrapedData) {
    const lines = generatedContent.split('\n');
    const article = {
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      coverImage: scrapedData.images?.[0],
      metadata: {
        movieTitle: scrapedData.metadata?.movieTitle,
        releaseYear: scrapedData.metadata?.releaseYear,
        genre: scrapedData.metadata?.genre,
        director: scrapedData.metadata?.director,
        actors: scrapedData.metadata?.actors,
        score: scrapedData.metadata?.score,
        hunted: scrapedData.metadata?.hunted,
        hiddenGem: scrapedData.metadata?.hiddenGem,
      },
    };

    let inContent = false;
    let contentLines = [];

    for (const line of lines) {
      if (line.startsWith('TITRE:')) {
        article.title = line.replace('TITRE:', '').trim();
      } else if (line.startsWith('EXTRAIT:')) {
        article.excerpt = line.replace('EXTRAIT:', '').trim();
      } else if (line.startsWith('TAGS:')) {
        article.tags = line.replace('TAGS:', '')
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
      } else if (line.startsWith('META_TITRE:')) {
        article.seo.metaTitle = line.replace('META_TITRE:', '').trim();
      } else if (line.startsWith('META_DESCRIPTION:')) {
        article.seo.metaDescription = line.replace('META_DESCRIPTION:', '').trim();
      } else if (line.startsWith('KEYWORDS:')) {
        article.seo.keywords = line.replace('KEYWORDS:', '')
          .split(',')
          .map(kw => kw.trim())
          .filter(kw => kw);
      } else if (line.startsWith('CONTENU:')) {
        inContent = true;
      } else if (inContent) {
        contentLines.push(line);
      }
    }

    article.content = contentLines.join('\n').trim();

    // Fallbacks si certains champs sont vides
    if (!article.title) article.title = scrapedData.title;
    if (!article.excerpt) article.excerpt = article.content.substring(0, 200) + '...';
    if (!article.seo.metaTitle) article.seo.metaTitle = article.title;
    if (!article.seo.metaDescription) article.seo.metaDescription = article.excerpt;

    return article;
  }

  /**
   * Améliore un article existant
   */
  async improveArticle(currentContent, instructions) {
    try {
      console.log(`🤖 Amélioration de l'article...`);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un éditeur expert qui améliore les articles de blog.',
          },
          {
            role: 'user',
            content: `Améliore cet article selon ces instructions: ${instructions}

Article actuel:
${currentContent}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(`❌ Erreur d'amélioration: ${error.message}`);
      throw new Error(`Échec de l'amélioration: ${error.message}`);
    }
  }

  /**
   * Génère des suggestions de tags
   */
  async generateTags(title, content) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu génères des tags pertinents pour des articles de blog sur le cinéma.',
          },
          {
            role: 'user',
            content: `Génère 5-8 tags pertinents pour cet article (séparés par des virgules):
Titre: ${title}
Contenu: ${content.substring(0, 500)}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      const tagsString = completion.choices[0].message.content;
      return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    } catch (error) {
      console.error(`❌ Erreur de génération de tags: ${error.message}`);
      return [];
    }
  }
}

module.exports = new AIService();
