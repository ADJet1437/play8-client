import { Logo } from './Logo';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-gray-600 max-w-xs">
              Providing premium tennis ball machine services for players of all levels.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600">Home</a>
              </li>
              <li>
                <a href="/booking" className="text-gray-600 hover:text-indigo-600">Book a Machine</a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-indigo-600">About Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
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
          <p>&copy; {currentYear} Play8. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}