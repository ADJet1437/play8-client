import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to check if current time is after 8 PM
const isAfter8PM = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 20; // 8 PM = 20:00
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if user has manually set a preference
    const hasManualPreference = localStorage.getItem('theme-manual') === 'true';
    if (hasManualPreference) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
    }
    
    // Check if it's after 8 PM
    if (isAfter8PM()) {
      return 'dark';
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Only save to localStorage if user hasn't manually set preference
    // (auto-set themes are not persisted to allow daily switching)
    const hasManualPreference = localStorage.getItem('theme-manual') === 'true';
    if (hasManualPreference) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Check time-based theme and system preference changes
  useEffect(() => {
    // Check time-based theme when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only auto-switch if user hasn't manually set a preference
        const hasManualPreference = localStorage.getItem('theme-manual') === 'true';
        if (!hasManualPreference) {
          const shouldBeDark = isAfter8PM();
          setThemeState(shouldBeDark ? 'dark' : 'light');
        }
      }
    };
    
    // Check time-based theme periodically (every minute)
    const timeCheckInterval = setInterval(() => {
      // Only auto-switch if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem('theme-manual') === 'true';
      if (!hasManualPreference) {
        const shouldBeDark = isAfter8PM();
        setThemeState(shouldBeDark ? 'dark' : 'light');
      }
    }, 60000); // Check every minute
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem('theme-manual') === 'true';
      if (!hasManualPreference) {
        // Only use system preference if not after 8 PM
        if (!isAfter8PM()) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      clearInterval(timeCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    // Mark as manual preference when user toggles
    localStorage.setItem('theme-manual', 'true');
    setThemeState((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    // Mark as manual preference when theme is set directly
    localStorage.setItem('theme-manual', 'true');
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

