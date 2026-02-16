import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import ArticleCardNext from '../src/components/ArticleCardNext';
import HeroArticleNext from '../src/components/HeroArticleNext';
import ArticleListItemNext from '../src/components/ArticleListItemNext';
import ArticleCarouselNext from '../src/components/ArticleCarouselNext';
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

interface HomeProps {
  initialArticles: Article[];
  initialCritiques: Article[];
  initialLists: Article[];
  totalPages: number;
}

export default function Home({ 
  initialArticles = [], 
  initialCritiques = [],
  initialLists = [],
  totalPages: initialTotalPages = 1 
}: Partial<HomeProps>) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [critiques, setCritiques] = useState<Article[]>(initialCritiques);
  const [lists, setLists] = useState<Article[]>(initialLists);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAllArticles, setShowAllArticles] = useState(false);
  
  const heroArticle = articles[0];
  const sidebarArticles = articles.slice(1, 6);
  const remainingArticles = articles.slice(6);
  
  // Toujours rafraîchir les articles au montage pour refléter les changements récents
  useEffect(() => {
    fetchArticles(1, '');
  }, []);

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
          _ts: Date.now(), // Cache-buster suffisant
        },
      });
      setArticles(response.data.data.articles || []);
      setTotalPages(response.data.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAllArticles(true);
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

      <div className="space-y-12">
        {/* Hero Section - Style Cineverse - Réduit */}
        <section className="relative bg-gradient-to-br from-slate-100 via-red-50 to-orange-50 py-4 px-4 rounded-2xl overflow-hidden mt-4 mx-4 sm:mx-6 lg:mx-8">
          {/* Blobs animés en arrière-plan */}
          <div className="absolute top-0 -left-4 w-48 h-48 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-48 h-48 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-48 h-48 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight">
              <span className="text-primary-800">MovieHunt Blog: </span>
              <span style={{ color: '#FEBE29' }}>critiques de films</span>
            </h1>
            
            <h2 className="text-base md:text-lg font-bold text-gray-700 mb-3 max-w-2xl mx-auto">
              Découvrez des analyses et recommandations
            </h2>
            
            <p className="text-sm md:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
              Des critiques détaillées de films sélectionnés par MovieHunt, des pépites cinématographiques et des analyses approfondies.
            </p>

            {/* Search Bar intégrée au hero */}
            <div className="max-w-2xl mx-auto mb-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-800 rounded-full py-2 pl-10 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 text-sm rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold"
                >
                  Rechercher
                </button>
              </form>
            </div>

            <div className="flex justify-center">
              <a 
                href="https://www.moviehunt.fr" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full bg-indigo-700 text-white text-sm font-semibold shadow-lg hover:bg-indigo-800 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Découvrir MovieHunt
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 text-lg">Aucun article trouvé</p>
            </div>
          ) : (
            <>
              {/* Hero + Sidebar Layout */}
              {!showAllArticles && heroArticle && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Hero Article - 2/3 width */}
                    <div className="lg:col-span-2">
                      <HeroArticleNext article={heroArticle} />
                    </div>

                    {/* Sidebar - Latest Articles - 1/3 width */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="text-primary-600 mr-2">|</span>
                        DERNIERS ARTICLES
                      </h2>
                      <div className="space-y-4">
                        {sidebarArticles.map((article) => (
                          <ArticleListItemNext key={article._id} article={article} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Critiques Carousel */}
                  {critiques.length > 0 && (
                    <ArticleCarouselNext
                      title="Critiques de films"
                      articles={critiques}
                      viewAllLink="/critiques"
                      icon="🎬"
                    />
                  )}

                  {/* Lists Carousel */}
                  {lists.length > 0 && (
                    <ArticleCarouselNext
                      title="Listes"
                      articles={lists}
                      viewAllLink="/listes"
                      icon="📋"
                    />
                  )}
                </>
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
                      <ArticleCardNext key={article._id} article={article} />
                    ))}
                  </div>
                </>
              )}

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
      </div>
    </>
  );
}

// SSG avec ISR pour des performances optimales
export async function getStaticProps() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';
    
    // Récupérer tous les articles
    const articlesResponse = await axios.get(`${apiUrl}/articles`, {
      params: {
        page: 1,
        limit: 12,
        status: 'published',
      },
      timeout: 5000,
    });

    // Récupérer les critiques
    const critiquesResponse = await axios.get(`${apiUrl}/articles`, {
      params: {
        page: 1,
        limit: 10,
        status: 'published',
        category: 'critique',
      },
      timeout: 5000,
    });

    // Récupérer les listes
    const listsResponse = await axios.get(`${apiUrl}/articles`, {
      params: {
        page: 1,
        limit: 10,
        status: 'published',
        category: 'list',
      },
      timeout: 5000,
    });

    return {
      props: {
        initialArticles: articlesResponse.data.data.articles || [],
        initialCritiques: critiquesResponse.data.data.articles || [],
        initialLists: listsResponse.data.data.articles || [],
        totalPages: articlesResponse.data.data.pagination?.pages || 1,
      },
      revalidate: 60, // Revalider toutes les 60 secondes pour voir les changements plus rapidement
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialArticles: [],
        initialCritiques: [],
        initialLists: [],
        totalPages: 1,
      },
      revalidate: 60,
    };
  }
}
