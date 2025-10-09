import { GetStaticProps } from 'next';
import { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import ArticleCard from '../src/components/ArticleCard';
import SEO from '../src/components/SEO';
import Pagination from '../src/components/Pagination';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  metadata?: {
    score?: number;
    movieTitle?: string;
  };
}

interface HomeProps {
  initialArticles: Article[];
  totalPages: number;
}

export default function Home({ initialArticles, totalPages }: HomeProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchArticles = async (page: number, search: string = '') => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.get(`${apiUrl}/articles`, {
        params: {
          page,
          limit: 9,
          status: 'published',
          search,
        },
      });
      setArticles(response.data.data.articles);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    fetchArticles(page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
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
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement...</p>
          </div>
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api';
    const response = await axios.get(`${apiUrl}/articles`, {
      params: {
        page: 1,
        limit: 9,
        status: 'published',
      },
    });

    return {
      props: {
        initialArticles: response.data.data.articles,
        totalPages: response.data.data.pagination.pages,
      },
      revalidate: 3600, // ISR : Régénère toutes les heures
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialArticles: [],
        totalPages: 1,
      },
      revalidate: 60, // Retry plus souvent en cas d'erreur
    };
  }
};
