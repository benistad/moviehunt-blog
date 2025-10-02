import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ImageSelector({ movieTitle, onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState('center');

  useEffect(() => {
    fetchImages();
  }, [movieTitle]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Rechercher le film sur TMDB via notre API
      const response = await axios.get('/api/tmdb/search', {
        params: { query: movieTitle }
      });
      
      if (response.data.data) {
        setImages(response.data.data.images || []);
      }
    } catch (error) {
      console.error('Erreur chargement images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageUrl) => {
    // Utiliser le proxy pour éviter les problèmes CORS
    const proxiedUrl = `/api/tmdb/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    onSelect(proxiedUrl, alignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sélectionner une image</h2>
            <p className="text-sm text-gray-600 mt-1">Images TMDB pour "{movieTitle}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Alignment selector */}
        <div className="p-6 border-b bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Alignement de l'image
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setAlignment('left')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                alignment === 'left'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Gauche
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                alignment === 'center'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Centre
            </button>
            <button
              onClick={() => setAlignment('right')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                alignment === 'right'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Droite
            </button>
          </div>
        </div>

        {/* Images grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>Aucune image disponible pour ce film</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectImage(image)}
                  className="group relative aspect-video overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary-600 transition-all"
                >
                  <img
                    src={`/api/tmdb/proxy-image?url=${encodeURIComponent(image)}`}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium">
                      Sélectionner
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
