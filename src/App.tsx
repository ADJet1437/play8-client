import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { AgentPage } from './components/AgentPage';
import { ProfilePage } from './components/ProfilePage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { FloatingChatButton } from './components/FloatingChatButton';
import { ScrollToTop } from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/agent/:conversationId" element={<AgentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Auth routes */}
          <Route path="/auth/google/callback" element={<HomePage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <FloatingChatButton />
      </Layout>
    </Router>
  );
}

export default App;
