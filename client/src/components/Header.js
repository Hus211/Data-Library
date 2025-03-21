import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show the full header on the search page to avoid duplication
  const isSearchPage = location.pathname === '/search';

  return (
    <header className={`${isSearchPage ? 'bg-gray-50' : 'bg-blue-600 text-white'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className={`text-xl font-bold ${isSearchPage ? 'text-blue-600' : 'text-white'}`}>
          {isSearchPage ? 'Scholarly Data Library' : 'Scholarly Library'}
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/search" 
                className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
              >
                Search
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/profile" 
                    className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
                  >
                    Profile
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Link 
                      to="/admin" 
                      className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className={`${isSearchPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 ${isSearchPage ? 'text-gray-700' : 'text-white'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 px-4 py-2">
          <ul className="space-y-2">
            <li><Link to="/" className="block text-white hover:text-gray-300">Home</Link></li>
            <li><Link to="/search" className="block text-white hover:text-gray-300">Search</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" className="block text-white hover:text-gray-300">Profile</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin" className="block text-white hover:text-gray-300">Admin</Link></li>
                )}
                <li><button onClick={handleLogout} className="block text-white hover:text-gray-300">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="block text-white hover:text-gray-300">Login</Link></li>
                <li><Link to="/register" className="block text-white hover:text-gray-300">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
      
      {/* Search page header content */}
      {isSearchPage && (
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Scholarly Data Library</h1>
            <p className="text-sm">A comprehensive research database demo</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
