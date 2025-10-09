import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { articlesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
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

  const fetchArticles = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getAll({
        page,
        limit: 9,
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
    fetchArticles(1, searchQuery);
  };

  const handlePageChange = (page) => {
    fetchArticles(page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur le <span className="text-primary-600">MovieHunt Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des critiques et analyses de films
          </p>
        </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
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

      {/* Articles Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      </div>
    </>
  );
}
