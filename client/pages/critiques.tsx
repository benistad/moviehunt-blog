import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCardNext from '../src/components/ArticleCardNext';
import SEO from '../src/components/SEO';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  category?: string;
  metadata?: {
    score?: number;
    movieTitle?: string;
  };
}

interface CritiquesProps {
  initialArticles: Article[];
  totalPages: number;
}

export default function Critiques({ initialArticles = [], totalPages: initialTotalPages = 1 }: Partial<CritiquesProps>) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const fetchArticles = async (page: number) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.get(`${apiUrl}/articles`, {
        params: {
          page,
          limit: 12,
          status: 'published',
          category: 'review',
          _ts: Date.now(),
        },
      });
      setArticles(response.data.data.articles || []);
      setTotalPages(response.data.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching critiques:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Critiques de films - MovieHunt Blog"
        description="Découvrez toutes nos critiques et analyses détaillées de films. Des pépites cinématographiques aux blockbusters, retrouvez nos avis argumentés."
        url="/critiques"
        keywords={[
          'critiques de films',
          'analyses de films',
          'avis films',
          'critiques cinéma',
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 text-white px-5 py-2.5 rounded-full font-bold text-xl">
              🎬 Critiques de films
            </div>
          </div>
          <p className="text-gray-600 text-lg">Analyses et critiques détaillées de films</p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg">Aucune critique trouvée</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCardNext key={article._id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';
    const response = await axios.get(`${apiUrl}/articles`, {
      params: {
        page: 1,
        limit: 12,
        status: 'published',
        category: 'review',
      },
      timeout: 5000,
    });

    return {
      props: {
        initialArticles: response.data.data.articles || [],
        totalPages: response.data.data.pagination?.pages || 1,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps (critiques):', error);
    return {
      props: {
        initialArticles: [],
        totalPages: 1,
      },
      revalidate: 60,
    };
  }
}
