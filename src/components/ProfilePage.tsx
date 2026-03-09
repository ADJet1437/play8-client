import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { SavedSessionsList } from './plan/SavedSessionsList';
import { DrillSequenceView } from './studio/DrillSequenceView';
import { savedSessionApi } from '../services/api';
import { SavedTrainingSession, DrillCard } from '../types';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SavedTrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<SavedTrainingSession | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await savedSessionApi.list();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch saved sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, fetchSessions]);

  const handleDelete = async (sessionId: string) => {
    // Optimistic update
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

    try {
      await savedSessionApi.delete(sessionId);
    } catch (error) {
      console.error('Failed to delete session:', error);
      fetchSessions(); // Revert on error
    }
  };

  const handleStartTraining = (session: SavedTrainingSession) => {
    setActiveSession(session);
  };

  const handleDrillDone = async (drillIndex: number, updatedDrill: DrillCard) => {
    if (!activeSession) return;

    const updatedDrills = activeSession.drill_cards_data.map((d, i) =>
      i === drillIndex ? updatedDrill : d
    );

    setActiveSession((prev) => prev ? { ...prev, drill_cards_data: updatedDrills } : prev);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id ? { ...s, drill_cards_data: updatedDrills } : s
      )
    );

    try {
      await savedSessionApi.updateDrillCards(activeSession.id, updatedDrills);
    } catch (error) {
      console.error('Failed to update drill cards:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

      {/* User info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
          {getInitials(user.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Saved Training Sessions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          My Saved Training Sessions
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-600/50 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-600/50 rounded w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-600/50 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <SavedSessionsList
            sessions={sessions}
            onDelete={handleDelete}
            onStartTraining={handleStartTraining}
          />
        )}
      </div>

        {/* Full-screen drill sequence view */}
        {activeSession && (
          <DrillSequenceView
            drills={activeSession.drill_cards_data}
            onClose={() => setActiveSession(null)}
            onDrillDone={handleDrillDone}
          />
        )}
      </div>
    </div>
  );
}
