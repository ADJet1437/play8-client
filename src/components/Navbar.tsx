import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { FiMenu, FiX } from 'react-icons/fi';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            Home
          </Link>
          <Link to="/booking" className="text-gray-700 hover:text-indigo-600 font-medium">
            Booking
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
            About Us
          </Link>
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
              Home
            </Link>
            <Link 
              to="/booking" 
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Booking
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}