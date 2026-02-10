import { StudioCard as StudioCardType, CATEGORY_ICONS } from './StudioData';

interface StudioCardProps {
  card: StudioCardType;
  onClick: () => void;
}

export function StudioCard({ card, onClick }: StudioCardProps) {
  const difficultyColors = {
    beginner: 'text-green-600 dark:text-green-400',
    intermediate: 'text-yellow-600 dark:text-yellow-400',
    advanced: 'text-red-600 dark:text-red-400',
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all p-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{CATEGORY_ICONS[card.category]}</span>
        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
          {card.title}
        </h4>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
        {card.description}
      </p>
      <div className="flex items-center gap-2">
        {card.content.difficulty && (
          <span className={`text-xs ${difficultyColors[card.content.difficulty]}`}>
            {card.content.difficulty}
          </span>
        )}
        {card.content.duration && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            • {card.content.duration}
          </span>
        )}
      </div>
    </button>
  );
}
