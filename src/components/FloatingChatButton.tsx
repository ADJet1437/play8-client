import { FiMessageCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on agent page
  if (location.pathname === '/agent') {
    return null;
  }

  const handleClick = () => {
    navigate('/agent');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Open AI Assistant"
    >
      <FiMessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
    </button>
  );
}


