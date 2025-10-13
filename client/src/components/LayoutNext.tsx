import { useRouter } from 'next/router';
import Link from 'next/link';
import { Home, Film, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header - Style Cineverse */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10">
                <img 
                  src="/logo.png" 
                  alt="MovieHunt Blog" 
                  className="h-10 w-auto object-contain group-hover:rotate-6 transition-transform duration-300" 
                />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary-700">MovieHunt</span>{' '}
                <span className="text-gray-900">Blog</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isActive('/')
                    ? 'text-primary-700'
                    : 'text-gray-600 hover:text-primary-700'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Accueil</span>
              </Link>
              
              <a
                href="https://www.moviehunt.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-700 transition-colors duration-200 group"
              >
                <Film className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">MovieHunt</span>
              </a>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-700 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Style Cineverse */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="MovieHunt Blog" className="h-10 w-auto" />
                <span className="text-xl font-bold text-white">MovieHunt Blog</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques et des recommandations de qualité.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="mr-2 text-primary-500 group-hover:translate-x-1 transition-transform">→</span>
                    Accueil
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.moviehunt.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 text-primary-500 group-hover:translate-x-1 transition-transform">→</span>
                    MovieHunt
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">À propos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Critiques et analyses de films basées sur les contenus de moviehunt.fr. Votre compagnon ultime pour des idées de films et des recommandations sur mesure.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MovieHunt Blog. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
