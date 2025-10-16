/**
 * Compresse une image avant de la convertir en base64
 * @param {File} file - Le fichier image à compresser
 * @param {number} maxWidth - Largeur maximale (défaut: 1200px)
 * @param {number} quality - Qualité de compression (0-1, défaut: 0.8)
 * @returns {Promise<string>} - L'image compressée en base64
 */
function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionner si l'image est trop grande
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en base64 avec compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Vérifier la taille (limite Vercel: ~3MB pour être sûr)
        const sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024);
        
        if (sizeInMB > 3) {
          // Si toujours trop gros, réduire encore la qualité
          const newQuality = Math.max(0.5, quality - 0.2);
          if (newQuality < quality) {
            compressImage(file, maxWidth, newQuality).then(resolve).catch(reject);
          } else {
            reject(new Error('Image trop volumineuse même après compression. Veuillez utiliser une image plus petite ou l\'insertion par URL.'));
          }
        } else {
          resolve(compressedBase64);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Adaptateur d'upload personnalisé pour CKEditor
 * Compresse et convertit les images en base64 pour les stocker directement dans le HTML
 */
class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) => {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          return Promise.reject(new Error('Seules les images sont acceptées'));
        }
        
        // Compresser l'image avant de l'encoder
        return compressImage(file).then((compressedBase64) => {
          return {
            default: compressedBase64,
          };
        });
      }
    );
  }

  abort() {
    // Rien à faire pour annuler la lecture d'un fichier
  }
}

export function Base64UploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new Base64UploadAdapter(loader);
  };
}
