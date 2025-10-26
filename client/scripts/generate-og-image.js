/**
 * Script pour générer l'image Open Graph
 * Utilise sharp pour convertir le SVG en JPG
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  try {
    const svgPath = path.join(__dirname, '../public/og-image.svg');
    const jpgPath = path.join(__dirname, '../public/og-image.jpg');
    
    console.log('📸 Génération de l\'image Open Graph...');
    
    // Vérifier si le SVG existe
    if (!fs.existsSync(svgPath)) {
      console.error('❌ Le fichier og-image.svg n\'existe pas');
      process.exit(1);
    }
    
    // Convertir SVG en JPG
    await sharp(svgPath)
      .resize(1200, 630)
      .jpeg({ quality: 90 })
      .toFile(jpgPath);
    
    console.log('✅ Image Open Graph générée avec succès : og-image.jpg');
    console.log(`   Taille : 1200x630px`);
    console.log(`   Format : JPEG (qualité 90%)`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de l\'image :', error.message);
    process.exit(1);
  }
}

generateOGImage();
