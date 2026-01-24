import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export function Footer() {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600">{t('home')}</Link>
              </li>
              <li>
                <a href="/#booking" className="text-gray-600 hover:text-indigo-600">{t('bookMachine')}</a>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600">{t('aboutUs')}</Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('connectWithUs')}</h3>
            <div className="flex space-x-4 justify-center md:justify-start mb-4">
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} Play8. {t('copyright')}</p>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-indigo-600">{t('privacyPolicy')}</Link>
            <span className="text-gray-400">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-indigo-600">{t('termsOfUse')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}