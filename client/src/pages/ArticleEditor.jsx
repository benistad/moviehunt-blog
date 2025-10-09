import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CKEditorComponent from '../components/CKEditorWrapper';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  // États pour l'édition
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

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
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await articlesAPI.update(id, {
        title,
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
      });
      toast.success('Article sauvegardé');
      fetchArticle();
    } catch (error) {
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
      });
      
      // Puis publier si c'était un brouillon
      if (isDraft) {
        await articlesAPI.publish(id);
      }
      
      toast.success(isDraft ? 'Article publié !' : 'Modifications publiées !');
      navigate('/admin');
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
            onClick={() => navigate('/admin')}
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
