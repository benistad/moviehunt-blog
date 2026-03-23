import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useEffect, ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Raccourci clavier Ctrl+Shift+A pour accéder à l'admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Détecter le scroll pour ajouter une ombre à la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Redesign style dashboard blanc */}
      <header className={`sticky top-0 z-50 transition-shadow duration-300 bg-white ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo + Badge Blog */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <Image 
                  src="/logo.png" 
                  alt="MovieHunt" 
                  width={36}
                  height={36}
                  className="object-contain" 
                />
                <span className="text-[22px] font-black tracking-tight text-[#4F46E5]">
                  MovieHunt
                </span>
              </Link>
              <div className="bg-[#E50914] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span className="text-sm font-bold">Blog</span>
              </div>
            </div>

            {/* Barre de recherche centrale */}
            <div className="hidden md:flex flex-1 max-w-[400px] mx-8">
              <div className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-2.5 w-full hover:bg-[#E5E7EB] transition-colors border border-transparent focus-within:border-[#4F46E5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4F46E5]/20">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un film..."
                  className="bg-transparent border-none outline-none text-[15px] w-full ml-2 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Navigation droite avec icônes */}
            <nav className="flex items-center gap-6">
              <a
                href="https://www.moviehunt.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-[#4F46E5] font-medium text-[15px] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Recherche Avancée
              </a>
              <a
                href="https://www.moviehunt.fr/movies"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#4F46E5] font-medium text-[15px] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                Tous les films
              </a>
              <div className="flex items-center gap-2 text-gray-600 hover:text-[#4F46E5] font-medium text-[15px] cursor-pointer transition-colors group">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Découvrir
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Violet */}
      <footer className="bg-purple-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/logo.png" alt="MovieHunt Blog" width={40} height={40} className="object-contain" />
                <span className="text-xl font-bold text-white">
                  MovieHunt Blog
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed">
                Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques et des recommandations de qualité.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.moviehunt.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    MovieHunt
                  </a>
                </li>
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Recherche
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">À propos</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Critiques et analyses de films basées sur les contenus de moviehunt.fr. Votre compagnon ultime pour des idées de films et des recommandations sur mesure.
              </p>
            </div>
          </div>

          <div className="border-t border-purple-600 mt-8 pt-8 text-center">
            <p className="text-purple-200 text-sm">
              &copy; {new Date().getFullYear()} MovieHunt Blog. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
