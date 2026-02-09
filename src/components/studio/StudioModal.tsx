import { FiX, FiClock, FiTarget } from 'react-icons/fi';
import { StudioCard as StudioCardType, CATEGORY_LABELS, CATEGORY_ICONS } from './StudioData';

interface StudioModalProps {
  card: StudioCardType;
  onClose: () => void;
}

export function StudioModal({ card, onClose }: StudioModalProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{CATEGORY_ICONS[card.category]}</span>
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {CATEGORY_LABELS[card.category]}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {card.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                {card.content.difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[card.content.difficulty]}`}>
                    {card.content.difficulty}
                  </span>
                )}
                {card.content.duration && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FiClock size={12} />
                    {card.content.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview */}
          <div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {card.content.overview}
            </p>
          </div>

          {/* Steps */}
          {card.content.steps && card.content.steps.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FiTarget size={16} className="text-indigo-600 dark:text-indigo-400" />
                {card.category === 'training' ? 'Program Outline' : 'Steps'}
              </h3>
              <ol className="space-y-2">
                {card.content.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm leading-6">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {card.content.tips && card.content.tips.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Pro Tips
              </h3>
              <ul className="space-y-2">
                {card.content.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-indigo-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
