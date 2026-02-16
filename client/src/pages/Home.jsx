import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { articlesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import HeroArticle from '../components/HeroArticle';
import ArticleListItem from '../components/ArticleListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllArticles, setShowAllArticles] = useState(false);

  const fetchArticles = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getAll({
        page,
        limit: 12,
        status: 'published',
        search,
      });
      setArticles(response.data.data.articles);
      setTotalPages(response.data.data.pagination.pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1, searchQuery);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowAllArticles(true);
    fetchArticles(1, searchQuery);
  };

  const handlePageChange = (page) => {
    fetchArticles(page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroArticle = articles[0];
  const sidebarArticles = articles.slice(1, 6);
  const remainingArticles = articles.slice(6);

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques méconnues et des recommandations de qualité."
        url="/"
        keywords={[
          'films méconnus',
          'pépites cinéma',
          'recommandations films',
          'hidden gems',
          'critiques films indépendants',
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button type="submit" className="btn-primary absolute right-2 top-1/2 transform -translate-y-1/2">
              Rechercher
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner text="Chargement des articles..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchArticles(currentPage, searchQuery)} />
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun article trouvé</p>
          </div>
        ) : (
          <>
            {/* Hero + Sidebar Layout */}
            {!showAllArticles && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Hero Article - 2/3 width */}
                <div className="lg:col-span-2">
                  <HeroArticle article={heroArticle} />
                </div>

                {/* Sidebar - Latest Articles - 1/3 width */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-primary-600 mr-2">|</span>
                    DERNIERS ARTICLES
                  </h2>
                  <div className="space-y-4">
                    {sidebarArticles.map((article) => (
                      <ArticleListItem key={article._id} article={article} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* More Articles Section */}
            {remainingArticles.length > 0 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showAllArticles ? 'Tous les articles' : 'Plus d\'articles'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(showAllArticles ? articles : remainingArticles).map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
