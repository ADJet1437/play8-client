import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  // Future: syncLanguageWithBackend: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || i18n.language || 'en';
    const language = savedLanguage.startsWith('sv') ? 'sv' : 'en';
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
  }, []);

  const changeLanguage = async (lang: string) => {
    const language = lang === 'sv' ? 'sv' : 'en';
    await i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('i18nextLng', language);
    
    // TODO: When backend is ready, sync with user profile if authenticated
    // To implement this, you'll need to:
    // 1. Import useAuth here: import { useAuth } from './AuthContext';
    // 2. Get isAuthenticated: const { isAuthenticated } = useAuth();
    // 3. Uncomment the code below:
    // if (isAuthenticated) {
    //   await syncLanguageWithBackend(language);
    // }
  };

  // Future function to sync with backend
  // const syncLanguageWithBackend = async (language: string) => {
  //   try {
  //     await api.updateUserPreferences({ preferred_language: language });
  //   } catch (error) {
  //     console.error('Failed to sync language with backend:', error);
  //   }
  // };

  // Future: Load language from user profile on login
  // This will need to be implemented when backend sync is ready
  // You'll need to access AuthContext here, which requires AuthProvider to wrap LanguageProvider
  // Or move this logic to a separate effect in App.tsx after both providers are mounted

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

