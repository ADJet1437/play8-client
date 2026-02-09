import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAgentPage = location.pathname === '/agent';

  // Agent page has its own full-screen layout
  if (isAgentPage) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground transition-colors overflow-hidden">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}