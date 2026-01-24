import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { FiMenu, FiX } from 'react-icons/fi';
import { UserProfile } from './UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const { t } = useTranslation('navbar');
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md py-2 px-6 overflow-visible">
      <div className="container mx-auto flex justify-between items-center overflow-visible">
        <Link to="/" className="flex items-center overflow-visible py-2">
          <Logo />
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">
            {t('home')}
          </Link>
          <a 
            href="/#booking" 
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            {t('booking')}
          </a>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
            {t('aboutUs')}
          </Link>
          <a 
            href="https://store.play8.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            {t('shop')}
          </a>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <Button
              onClick={() => login(window.location.pathname + window.location.hash)}
              variant="primary"
              className="px-4 py-2"
            >
              {t('login')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white">
          <div className="flex flex-col space-y-4 px-4 py-2">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <a 
              href="/#booking" 
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('booking')}
            </a>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('aboutUs')}
            </Link>
            <a 
              href="https://store.play8.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('shop')}
            </a>
            <div className="pt-4 border-t border-gray-200">
              <div className="mb-4">
                <LanguageSwitcher />
              </div>
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <Button
                  onClick={() => {
                    login(window.location.pathname + window.location.hash);
                    setIsMenuOpen(false);
                  }}
                  variant="primary"
                  fullWidth
                  className="w-full"
                >
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}