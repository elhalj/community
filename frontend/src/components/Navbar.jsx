import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">SeguiKro</Link>

          {/* Menu pour mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">Accueil</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Tableau de bord</Link>
                <Link to="/cotisations" className="hover:text-blue-200 transition-colors">Cotisations</Link>
                <Link to="/groupes" className="hover:text-blue-200 transition-colors">Groupes</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200 transition-colors">Admin</Link>
                )}
                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200 transition-colors">
                    {user?.user.nom || 'Mon compte'}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Connexion</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <Link to="/" className="block py-2 hover:text-blue-200 transition-colors">
              Accueil
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-blue-200 transition-colors">
                  Tableau de bord
                </Link>
                <Link to="/cotisations" className="block py-2 hover:text-blue-200 transition-colors">
                  Cotisations
                </Link>
                <Link to="/groupes" className="block py-2 hover:text-blue-200 transition-colors">
                  Groupes
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 hover:text-blue-200 transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="block py-2 hover:text-blue-200 transition-colors">
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 hover:text-blue-200 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="block py-2 hover:text-blue-200 transition-colors">
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
