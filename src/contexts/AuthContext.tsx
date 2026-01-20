import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (returnUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      // Response now returns { user: User | null }
      setUser(response.user || null);
    } catch (error: any) {
      // Handle any unexpected errors
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (returnUrl?: string) => {
    try {
      // Store the return URL so we can redirect back after OAuth
      if (returnUrl) {
        sessionStorage.setItem('oauth_return_url', returnUrl);
      } else {
        // Default to current path if no return URL provided
        sessionStorage.setItem('oauth_return_url', window.location.pathname + window.location.hash);
      }
      
      // Get Google OAuth URL from backend
      const { auth_url } = await authApi.getGoogleAuthUrl();
      // Add a small delay before redirect to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      // Redirect to Google OAuth
      window.location.href = auth_url;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Check auth status when returning from OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Handle OAuth callback
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      setLoading(true);
      await authApi.handleGoogleCallback(code);
      // Check auth status after successful login
      await checkAuth();
      
      // Get the return URL from sessionStorage
      const returnUrl = sessionStorage.getItem('oauth_return_url') || '/';
      sessionStorage.removeItem('oauth_return_url');
      
      // Redirect to the return URL (or home page)
      // Use replace to avoid adding to browser history
      if (returnUrl.startsWith('#')) {
        // If it's a hash anchor, navigate to home and then scroll
        window.location.replace('/');
        setTimeout(() => {
          window.location.hash = returnUrl;
        }, 100);
      } else {
        window.location.replace(returnUrl);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setUser(null);
      // On error, redirect to home page
      window.location.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

