import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import SEONext from '../src/components/SEONext';

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
}

export default function Home({
  initialArticles = [],
  initialCritiques = [],
  initialLists = [],
}: Partial<HomeProps>) {
  const heroArticle = initialArticles[0];
  const trendingArticles = initialArticles.slice(1, 4);
  const critiques = initialCritiques.slice(0, 6);
  const lists = initialLists.slice(0, 8);

  return (
    <>
      <SEONext
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques méconnues et des recommandations de qualité."
        url="/"
      />

      {/* ═══ ARTICLE PRINCIPAL + TRENDING — avec image arrière-plan ═══ */}
      <section className="relative w-full">
        {/* Image d'arrière-plan du dernier article prenant tout le haut (sous le header) */}
        {heroArticle?.coverImage && (
          <div className="absolute top-0 left-0 right-0 h-[600px] z-0">
            <Image
              src={heroArticle.coverImage}
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
            {/* Overlay dégradé vers le blanc en bas */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* HERO CARD - Chevauchement */}
            {heroArticle && (
              <div className="lg:w-[60%] mt-8">
                <Link href={`/article/${heroArticle.slug}`}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group flex flex-col border border-gray-100">
                    <div className="relative h-[320px] sm:h-[380px] overflow-hidden rounded-t-3xl m-3 mb-0">
                      <Image
                        src={heroArticle.coverImage || '/placeholder.jpg'}
                        alt={heroArticle.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-3xl"
                      />
                      {heroArticle.metadata?.score != null && (
                        <div className="absolute top-4 right-4 bg-red-600 rounded-2xl px-4 py-2 flex items-center justify-center shadow-lg" style={{ zIndex: 10 }}>
                          <span className="text-white text-3xl font-extrabold">{heroArticle.metadata.score}</span>
                          <span className="text-white/80 text-lg font-bold ml-1">/10</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="self-start bg-red-500 text-white text-[12px] font-bold px-4 py-1.5 rounded-full mb-4">
                        {heroArticle.category === 'review' ? 'Critique' : heroArticle.category === 'list' ? 'Liste' : 'Article'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">{heroArticle.title}</h3>
                      <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-6 flex-1">{heroArticle.excerpt}</p>
                      <span className="self-start inline-flex items-center bg-black text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition-colors">
                        Lire l'article
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* TRENDING BOX - Glassmorphism avec liseré */}
            <div className="lg:w-[40%] rounded-[32px] p-6 flex flex-col border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
              {/* Effet de glow coloré derrière */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 via-transparent to-red-500/30 rounded-[32px] blur-xl z-0 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-white text-2xl font-extrabold tracking-wider mb-6 drop-shadow-md">TRENDING</h3>
                <div className="flex flex-col gap-4 flex-1">
                  {trendingArticles.map((article) => (
                    <Link key={article._id} href={`/article/${article.slug}`}>
                      <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                          <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-3 leading-tight flex-1">{article.title}</h4>
                            {article.metadata?.score != null && (
                              <span className="bg-red-600 text-white text-[11px] font-extrabold px-2 py-1 rounded-lg flex-shrink-0 shadow-sm">{article.metadata.score}/10</span>
                            )}
                          </div>
                          <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                            {article.category === 'review' ? 'Critique' : article.category === 'list' ? 'Liste' : 'Article'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CRITIQUES DE FILMS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Critiques de films</h2>

        {/* Row 1 : grande card gauche (2 rows) + 2 cards droite */}
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          {/* Grande card gauche */}
          {critiques[0] && (
            <div className="md:w-[35%] flex-shrink-0">
              <Link href={`/article/${critiques[0].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[320px] group">
                  <Image src={critiques[0].coverImage || '/placeholder.jpg'} alt={critiques[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {critiques[0].metadata?.score != null && (
                    <div className="absolute top-3 right-3 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-sm font-extrabold">{critiques[0].metadata.score}</span>
                      <span className="text-gray-400 text-[10px]">/10</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-bold text-white text-lg line-clamp-3 leading-snug">{critiques[0].title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* 2 cards droite empilées */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Card image avec score */}
            {critiques[1] && (
              <Link href={`/article/${critiques[1].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[155px] group">
                  <Image src={critiques[1].coverImage || '/placeholder.jpg'} alt={critiques[1].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {critiques[1].metadata?.score != null && (
                    <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-xs font-extrabold">{critiques[1].metadata.score}</span>
                      <span className="text-gray-400 text-[9px]">/10</span>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Card horizontale : image gauche + texte droite */}
            {critiques[2] && (
              <Link href={`/article/${critiques[2].slug}`}>
                <div className="flex bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[155px] group">
                  <div className="relative w-[45%] flex-shrink-0">
                    <Image src={critiques[2].coverImage || '/placeholder.jpg'} alt={critiques[2].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {critiques[2].metadata?.score != null && (
                      <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                        <span className="text-red-500 text-xs font-extrabold">{critiques[2].metadata.score}</span>
                        <span className="text-gray-400 text-[9px]">/10</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-3 leading-snug">{critiques[2].title}</h3>
                    <span className="self-start bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Critique</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Row 2 : 3 cards égales pleine largeur */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[critiques[3], critiques[4], critiques[5]].filter(Boolean).map((article) => (
            <Link key={article!._id} href={`/article/${article!.slug}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[180px] group">
                <Image src={article!.coverImage || '/placeholder.jpg'} alt={article!.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {article!.metadata?.score != null && (
                  <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                    <span className="text-red-500 text-xs font-extrabold">{article!.metadata.score}</span>
                    <span className="text-gray-400 text-[9px]">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">Critique</span>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{article!.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ LISTES — Carousel ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Listes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: -260, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: 260, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div id="lists-carousel" className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`#lists-carousel::-webkit-scrollbar { display: none; }`}</style>
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="flex-shrink-0 snap-start">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer w-[210px] h-[340px] group">
                <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <h3 className="font-bold text-white text-lg line-clamp-4 leading-snug">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}

// SSG avec ISR
export const getStaticProps: GetStaticProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';

  try {
    const [articlesResponse, critiquesResponse, listsResponse] = await Promise.all([
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 12, status: 'published' },
        timeout: 8000,
      }),
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 10, status: 'published', category: 'review' },
        timeout: 8000,
      }),
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 10, status: 'published', category: 'list' },
        timeout: 8000,
      }),
    ]);

    return {
      props: {
        initialArticles: articlesResponse.data.data.articles || [],
        initialCritiques: critiquesResponse.data.data.articles || [],
        initialLists: listsResponse.data.data.articles || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialArticles: [],
        initialCritiques: [],
        initialLists: [],
      },
      revalidate: 60,
    };
  }
};
