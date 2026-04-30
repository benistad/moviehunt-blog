import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import SEONext from '../src/components/SEONext';
import ArticleCardNext from '../src/components/ArticleCardNext';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  category?: string;
}

export default function Recherche() {
  const router = useRouter();
  const { q } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (typeof q === 'string' && q.trim()) {
      setQuery(q);
      fetchResults(q);
    }
  }, [q]);

  const fetchResults = async (search: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.get(`${apiUrl}/articles`, {
        params: { status: 'published', search, limit: 50 },
      });
      setArticles(response.data.data.articles || []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <SEONext
        title={q ? `Résultats pour "${q}" — MovieHunt Blog` : 'Recherche — MovieHunt Blog'}
        description="Recherchez parmi tous les articles MovieHunt Blog."
        url="/recherche"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Recherche</h1>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, genre, film..."
            className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm outline-none focus:border-[#dc2625] focus:ring-2 focus:ring-[#dc2625]/20"
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#dc2625] hover:bg-red-700 text-white rounded-full px-6 py-3 text-sm font-medium transition-colors"
          >
            Rechercher
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#dc2625]" />
          </div>
        )}

        {!loading && q && articles.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Aucun résultat pour <strong>"{q}"</strong></p>
            <Link href="/" className="mt-4 inline-block text-[#dc2625] hover:underline text-sm">
              ← Retour à l'accueil
            </Link>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {articles.length} résultat{articles.length > 1 ? 's' : ''} pour <strong>"{q}"</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCardNext key={article._id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
