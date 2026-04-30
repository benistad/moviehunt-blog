import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Plus, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  BarChart3,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Edit,
  FileText,
  LogOut,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI, queueAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContextNext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const router = useRouter();
  const { signOut, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [url, setUrl] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingFromPrompt, setGeneratingFromPrompt] = useState(false);
  const [articles, setArticles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guard d'authentification : redirection vers /login si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchStats();
    fetchArticles();
    fetchDrafts();
    fetchQueue();
  }, [user]);

  // Tant qu'on vérifie l'auth ou que l'utilisateur n'est pas connecté, on n'affiche rien
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  const fetchStats = async () => {
    try {
      const response = await articlesAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await articlesAPI.getAll({ limit: 200, status: 'published' });
      setArticles(response.data.data.articles);
    } catch (error) {
      toast.error('Erreur de chargement des articles');
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await articlesAPI.getAll({ limit: 50, status: 'draft' });
      setDrafts(response.data.data.articles);
    } catch (error) {
      toast.error('Erreur de chargement des brouillons');
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await queueAPI.getAll();
      setQueue(response.data.data);
    } catch (error) {
      toast.error('Erreur de chargement de la queue');
    }
  };

  const handleGenerateArticle = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setGenerating(true);
    const toastId = toast.loading('Génération de l\'article en cours...');

    try {
      const response = await articlesAPI.generate(url, customInstructions);
      toast.success('Article généré en brouillon !', { id: toastId });
      setUrl('');
      setCustomInstructions('');
      fetchStats();
      fetchDrafts();
      fetchQueue();
      // Rediriger vers l'éditeur
      router.push(`/admin/edit/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la génération', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFromPrompt = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Veuillez entrer un prompt');
      return;
    }

    setGeneratingFromPrompt(true);
    const toastId = toast.loading('Génération de l\'article en cours...');

    try {
      const response = await articlesAPI.generateFromPrompt(prompt);
      toast.success('Article généré en brouillon !', { id: toastId });
      setPrompt('');
      fetchStats();
      fetchDrafts();
      // Rediriger vers l'éditeur
      router.push(`/admin/edit/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la génération', { id: toastId });
    } finally {
      setGeneratingFromPrompt(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await articlesAPI.delete(id);
      toast.success('Article supprimé');
      fetchStats();
      fetchArticles();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRegenerateArticle = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir régénérer cet article ?')) {
      return;
    }

    const toastId = toast.loading('Régénération en cours...');

    try {
      await articlesAPI.regenerate(id);
      toast.success('Article régénéré avec succès !', { id: toastId });
      fetchArticles();
    } catch (error) {
      toast.error('Erreur lors de la régénération', { id: toastId });
    }
  };

  const handleProcessQueue = async () => {
    setLoading(true);
    const toastId = toast.loading('Traitement de la queue...');

    try {
      await queueAPI.process(5);
      toast.success('Queue traitée avec succès !', { id: toastId });
      fetchStats();
      fetchArticles();
      fetchQueue();
    } catch (error) {
      toast.error('Erreur lors du traitement', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      router.push('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleRetryFailed = async () => {
    setLoading(true);
    try {
      await queueAPI.retry();
      toast.success('Nouvelle tentative lancée');
      fetchQueue();
    } catch (error) {
      toast.error('Erreur lors de la nouvelle tentative');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQueueItem = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément de la queue ?')) {
      return;
    }

    try {
      await queueAPI.delete(id);
      toast.success('Élément supprimé de la queue');
      fetchQueue();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', icon: Clock, text: 'En attente' },
      processing: { class: 'badge-info', icon: Loader2, text: 'En cours' },
      completed: { class: 'badge-success', icon: CheckCircle, text: 'Terminé' },
      failed: { class: 'badge-danger', icon: XCircle, text: 'Échec' },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`${badge.class} inline-flex items-center space-x-1`}>
        <Icon className="w-4 h-4" />
        <span>{badge.text}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Gérez vos articles et créez du contenu</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="btn-secondary inline-flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.articles.total}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Publiés</p>
                <p className="text-3xl font-bold text-green-600">{stats.articles.published}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.queue.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Échecs</p>
                <p className="text-3xl font-bold text-red-600">{stats.queue.failed}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'generate'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Générer depuis URL
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'prompt'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Générer par IA
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Brouillons ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'articles'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LinkIcon className="w-5 h-5 inline mr-2" />
            Articles publiés
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'queue'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Queue ({queue.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'generate' && (
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Générer un article depuis une URL
          </h2>
          <form onSubmit={handleGenerateArticle} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL MovieHunt
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://moviehunt.fr/..."
                className="input"
                disabled={generating}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Entrez l'URL d'une page MovieHunt pour générer automatiquement un article
              </p>
            </div>

            <div>
              <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Recommandations particulières (optionnel)
              </label>
              <textarea
                id="customInstructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Ex: Insister sur l'aspect visuel du film, comparer avec d'autres films du réalisateur, adopter un ton plus critique..."
                className="input min-h-[100px] resize-y"
                disabled={generating}
                rows={4}
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Ajoutez des consignes spécifiques pour personnaliser cet article (ton, angle d'analyse, comparaisons...)
              </p>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 inline mr-2" />
                  Générer l'article
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'prompt' && (
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Sparkles className="w-6 h-6 inline mr-2 text-primary-600" />
            Générer un article par IA
          </h2>
          <form onSubmit={handleGenerateFromPrompt} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez l'article que vous souhaitez générer
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemple : Écris un article au sujet d'Halloween et des meilleurs films d'horreur à voir en octobre"
                className="input min-h-[150px] resize-y"
                disabled={generatingFromPrompt}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                L'IA va générer un article complet basé sur votre demande. Soyez aussi précis que possible pour obtenir le meilleur résultat.
              </p>
              <div className="mt-4 p-4 bg-[#4f46e5]/10 border border-[#4f46e5]/30 rounded-lg">
                <p className="text-sm text-[#4f46e5] font-medium mb-2">💡 Exemples de prompts :</p>
                <ul className="text-sm text-[#4f46e5] space-y-1">
                  <li>• "Écris un article sur les films de Noël incontournables"</li>
                  <li>• "Rédige une critique du dernier film Marvel"</li>
                  <li>• "Fais un top 10 des meilleurs thrillers psychologiques"</li>
                  <li>• "Écris un article sur l'évolution du cinéma d'horreur"</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={generatingFromPrompt}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingFromPrompt ? (
                <>
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Générer l'article
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'drafts' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Brouillons</h2>
            <button onClick={fetchDrafts} className="btn-secondary">
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Actualiser
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">Aucun brouillon pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div key={draft._id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="badge-warning">Brouillon</span>
                        <span className="text-sm text-gray-500">
                          {new Date(draft.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {draft.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{draft.excerpt}</p>
                      {draft.sourceUrl && (
                        <a
                          href={draft.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/admin/edit/${draft._id}`)}
                        className="btn-primary"
                        title="Éditer"
                      >
                        <Edit className="w-5 h-5 inline mr-2" />
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(draft._id)}
                        className="btn-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'articles' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tous les articles publiés ({articles.length})</h2>
            <button onClick={fetchArticles} className="btn-secondary">
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Actualiser
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">Aucun article pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article._id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                        {article.sourceUrl && (
                          <a
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Source</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/admin/edit/${article._id}`)}
                        className="btn-secondary"
                        title="Éditer"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRegenerateArticle(article._id)}
                        className="btn-secondary"
                        title="Régénérer"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        className="btn-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'queue' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Queue de génération</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleRetryFailed}
                disabled={loading}
                className="btn-secondary"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Réessayer échecs
              </button>
              <button
                onClick={handleProcessQueue}
                disabled={loading}
                className="btn-primary"
              >
                <Loader2 className={`w-5 h-5 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
                Traiter la queue
              </button>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">Aucune URL en queue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((item) => (
                <div key={item._id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusBadge(item.status)}
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{item.url}</p>
                      {item.error && (
                        <p className="text-red-600 text-sm">Erreur: {item.error}</p>
                      )}
                      {item.retryCount > 0 && (
                        <p className="text-yellow-600 text-sm">
                          Tentatives: {item.retryCount}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {item.articleId && (
                        <a
                          href={`/article/${item.articleId.slug}`}
                          className="btn-secondary"
                        >
                          Voir l'article
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteQueueItem(item._id)}
                        className="btn-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
