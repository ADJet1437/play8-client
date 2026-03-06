import { TrainingPlanCard } from '../../types';

interface TrainingCardCompactProps {
  card: TrainingPlanCard;
  onStartTraining?: () => void;
}

export default function TrainingCardCompact({
  card,
  onStartTraining,
}: TrainingCardCompactProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base leading-tight flex-1 pr-2">
            {card.title}
          </h3>
          <span className="text-xs bg-white/20 rounded px-2 py-0.5 whitespace-nowrap">
            {card.total_duration}
          </span>
        </div>
        <p className="text-xs text-green-50 mt-1 line-clamp-1">
          {card.description}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {card.drills.length} Drills • {card.difficulty}
          </span>
        </div>

        {/* Drill list - compact */}
        <div className="space-y-1.5">
          {card.drills.slice(0, 5).map((drill, index) => (
            <div
              key={index}
              className="flex items-start text-xs bg-gray-50 rounded-lg px-2.5 py-1.5"
            >
              <span className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[10px] font-semibold mr-2 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {drill.name}
                </div>
                <div className="text-gray-500 text-[11px]">{drill.duration}</div>
              </div>
            </div>
          ))}
          {card.drills.length > 5 && (
            <div className="text-xs text-gray-400 text-center pt-1">
              +{card.drills.length - 5} more drills
            </div>
          )}
        </div>
      </div>

      {/* Start Training Button */}
      {onStartTraining && (
        <div className="px-4 pb-3 pt-2">
          <button
            onClick={onStartTraining}
            className="w-full px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center text-sm shadow-md"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Start Training
          </button>
        </div>
      )}
    </div>
  );
}
