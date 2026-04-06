import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { FiMenu, FiX } from 'react-icons/fi';
import { UserProfile } from './UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { LoginModal } from './LoginModal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('navbar');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openLogin = () => {
    setIsMenuOpen(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md py-2 px-6 overflow-visible transition-colors z-50">
        <div className="container mx-auto flex justify-between items-center overflow-visible">
          <Link to="/" className="flex items-center overflow-visible py-2">
            <Logo />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/#booking"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              {t('booking')}
            </a>
            {isAuthenticated && (
              <Link
                to="/agent"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                {t('history')}
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                {t('myPlan')}
              </Link>
            )}
            <a
              href="https://store.play8.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              {t('store')}
            </a>
            <ThemeToggle />
            <LanguageSwitcher />
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Button onClick={openLogin} variant="primary" className="px-4 py-2">
                {t('login')}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-gray-800 transition-colors">
            <div className="flex flex-col space-y-4 px-4 py-2">
              <a
                href="/#booking"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('booking')}
              </a>
              {isAuthenticated && (
                <Link
                  to="/agent"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('history')}
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('myPlan')}
                </Link>
              )}
              <a
                href="https://store.play8.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('store')}
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-4 flex items-center space-x-4">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <Button onClick={openLogin} variant="primary" fullWidth className="w-full">
                    {t('login')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
