import { useState } from 'react';
import { FiTrash2, FiEye, FiPlay, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi';
import { SavedTrainingSession } from '../../types';

interface SavedSessionsListProps {
  sessions: SavedTrainingSession[];
  onDelete: (sessionId: string) => void;
  onStartTraining: (session: SavedTrainingSession) => void;
}

export function SavedSessionsList({ sessions, onDelete, onStartTraining }: SavedSessionsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/40">
        <p className="text-gray-500 dark:text-gray-400 mb-1">No saved training sessions yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Chat with AI Coach and click "Save to Plan" to save training sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const isExpanded = expandedId === session.id;
        const isDeleteConfirm = deleteConfirmId === session.id;

        return (
          <div
            key={session.id}
            className="bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden"
          >
            {/* Session Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {session.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        difficultyColors[session.difficulty] || ''
                      }`}
                    >
                      {session.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiClock size={12} />
                      {session.total_duration}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Saved {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  {isExpanded ? <FiChevronUp size={16} /> : <FiEye size={16} />}
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>

                <button
                  onClick={() => onStartTraining(session)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <FiPlay size={16} />
                  Start Training
                </button>

                {isDeleteConfirm ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-500">Delete session?</span>
                    <button
                      onClick={() => {
                        onDelete(session.id);
                        setDeleteConfirmId(null);
                      }}
                      className="text-xs px-3 py-1.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(session.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors ml-auto"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-gray-100 dark:border-gray-700/50 p-4 bg-gray-50 dark:bg-gray-900/30">
                {/* Drills List */}
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                  Training Drills ({session.drill_cards_data.length})
                </h4>
                <div className="space-y-3">
                  {session.training_plan_data.drills.map((drill, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
                    >
                      <div className="flex-shrink-0 w-7 h-7 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {drill.name}
                          </h5>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {drill.duration}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{drill.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PongBot Parameters Preview */}
                {session.drill_cards_data.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click "Start Training" to view detailed PongBot settings for each drill.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
