import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
];

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
        title="Select language"
      >
        <FiGlobe className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <FiCheck className="w-5 h-5 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

