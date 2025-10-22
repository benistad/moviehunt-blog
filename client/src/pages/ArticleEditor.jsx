import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CKEditorComponent from '../components/CKEditorWrapper';

export default function ArticleEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  // États pour l'édition
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('review'); // Par défaut : Critiques de films

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getById(id);
      const data = response.data.data;
      setArticle(data);
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setTags(data.tags?.join(', ') || '');
      setCoverImage(data.coverImage || '');
      setCategory(data.category || 'review');
    } catch (error) {
      toast.error('Erreur de chargement');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        title,
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        coverImage,
        category,
      };
      console.log('📤 Données envoyées au backend:', updateData);
      console.log('📤 Category:', category);
      
      await articlesAPI.update(id, updateData);
      toast.success('Article sauvegardé');
      fetchArticle();
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const isDraft = article?.status === 'draft';
    const confirmMessage = isDraft 
      ? 'Êtes-vous sûr de vouloir publier cet article ?' 
      : 'Êtes-vous sûr de vouloir sauvegarder et publier les modifications ?';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      // Sauvegarder d'abord les modifications
      await articlesAPI.update(id, {
        title,
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        coverImage,
        category,
      });
      
      // Puis publier si c'était un brouillon
      if (isDraft) {
        await articlesAPI.publish(id);
      }
      
      toast.success(isDraft ? 'Article publié !' : 'Modifications publiées !');
      router.push('/admin');
    } catch (error) {
      toast.error('Erreur de publication');
    }
  };


  if (loading) {
    return <LoadingSpinner text="Chargement de l'article..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'admin</span>
          </button>
          {article?.status === 'draft' ? (
            <span className="badge-warning">Brouillon</span>
          ) : (
            <span className="badge-success">Publié</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreview(!preview)}
            className="btn-secondary"
          >
            <Eye className="w-5 h-5 inline mr-2" />
            {preview ? 'Éditer' : 'Aperçu'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary"
          >
            <Save className="w-5 h-5 inline mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button
            onClick={handlePublish}
            className="btn-primary"
          >
            <Send className="w-5 h-5 inline mr-2" />
            {article?.status === 'draft' ? 'Publier' : 'Sauvegarder et publier'}
          </button>
        </div>
      </div>

      {!preview ? (
        /* Mode Édition */
        <div className="space-y-6">
          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extrait
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="input"
            />
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture (URL)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://image.tmdb.org/t/p/original/..."
              className="input mb-3"
            />
            {coverImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                <img
                  src={coverImage}
                  alt="Aperçu de la couverture"
                  className="w-full max-w-md rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              💡 Astuce : Utilisez une image TMDB ou uploadez sur <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ImgBB</a> puis collez l'URL directe
            </p>
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="review">Critiques de films</option>
              <option value="list">Listes de films</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              💡 Choisissez "Critiques de films" pour un article de critique ou "Listes de films" pour une liste/sélection de films
            </p>
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Action, Drame, Thriller"
              className="input"
            />
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Contenu
            </label>
            <CKEditorComponent
              content={content}
              onChange={setContent}
              movieTitle={article?.metadata?.movieTitle || title}
            />
          </div>
        </div>
      ) : (
        /* Mode Aperçu */
        <div className="card p-8">
          <article>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-700 mb-8 pb-8 border-b">{excerpt}</p>
            
            {tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.split(',').map((tag, i) => (
                  <span key={i} className="badge-info">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      )}
    </div>
  );
}
