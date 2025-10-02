import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Raccourci clavier Ctrl+Shift+A pour accéder à l'admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                MovieHunt <span className="text-primary-600">Blog</span>
              </span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Accueil</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Film className="w-6 h-6 text-primary-500" />
                <span className="text-xl font-bold text-white">MovieHunt Blog</span>
              </div>
              <p className="text-gray-400">
                Découvrez les dernières critiques et analyses de films générées par IA.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">À propos</h3>
              <p className="text-gray-400 text-sm">
                Critiques et analyses de films basées sur les contenus de moviehunt.fr.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} MovieHunt Blog. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
