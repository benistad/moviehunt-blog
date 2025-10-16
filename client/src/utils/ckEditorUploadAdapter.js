/**
 * Adaptateur d'upload personnalisé pour CKEditor
 * Convertit les images en base64 pour les stocker directement dans le HTML
 */
class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve({
              default: reader.result,
            });
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.onabort = () => {
            reject();
          };

          reader.readAsDataURL(file);
        })
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
