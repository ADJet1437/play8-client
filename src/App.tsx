import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { AgentPage } from './components/AgentPage';
import { FloatingChatButton } from './components/FloatingChatButton';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/agent" element={<AgentPage />} />
          {/* OAuth callback route - AuthContext handles the callback logic */}
          <Route path="/auth/google/callback" element={<HomePage />} />
        </Routes>
        <FloatingChatButton />
      </Layout>
    </Router>
  );
}

export default App;