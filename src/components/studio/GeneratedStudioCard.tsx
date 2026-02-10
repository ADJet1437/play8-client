import { FiCheck } from 'react-icons/fi';
import { StreamingStudioCard } from '../../types';
import { CATEGORY_ICONS } from './StudioData';

interface GeneratedStudioCardProps {
  card: StreamingStudioCard;
  onClick: () => void;
}

export function GeneratedStudioCardComponent({ card, onClick }: GeneratedStudioCardProps) {
  const difficultyColors = {
    beginner: 'text-green-600 dark:text-green-400',
    intermediate: 'text-yellow-600 dark:text-yellow-400',
    advanced: 'text-red-600 dark:text-red-400',
  };

  const checkedCount = (card.checked_steps ?? []).filter(Boolean).length;
  const totalSteps = card.steps.length;
  const hasProgress = totalSteps > 0 && !card.isStreaming;
  const isComplete = hasProgress && checkedCount === totalSteps;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all p-3 relative overflow-hidden"
    >
      {/* Streaming shimmer overlay */}
      {card.isStreaming && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/50 dark:via-indigo-900/20 to-transparent animate-shimmer pointer-events-none" />
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{CATEGORY_ICONS[card.category] || '✨'}</span>
        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate flex-1">
          {card.title}
        </h4>
        {card.isStreaming && (
          <span className="flex-shrink-0 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
        )}
        {hasProgress && (
          isComplete ? (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
              <FiCheck size={12} />
            </span>
          ) : checkedCount > 0 ? (
            <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
              {checkedCount}/{totalSteps}
            </span>
          ) : null
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
        {card.description || card.overview.slice(0, 80) + (card.overview.length > 80 ? '...' : '')}
      </p>
      <div className="flex items-center gap-2">
        {card.difficulty && (
          <span className={`text-xs ${difficultyColors[card.difficulty]}`}>
            {card.difficulty}
          </span>
        )}
        {card.duration && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            • {card.duration}
          </span>
        )}
      </div>
    </button>
  );
}
