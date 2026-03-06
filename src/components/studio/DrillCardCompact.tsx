import { DrillCard } from '../../types';

interface DrillCardCompactProps {
  card: DrillCard;
  totalDrills?: number;
}

export default function DrillCardCompact({ card, totalDrills }: DrillCardCompactProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
        <div className="flex justify-between items-start mb-1">
          <div className="text-[10px] font-medium opacity-90">
            Drill {card.drill_number}
            {totalDrills && <span className="ml-1">of {totalDrills}</span>}
          </div>
          <span className="text-xs bg-white/20 rounded px-2 py-0.5">
            {card.duration}
          </span>
        </div>
        <h3 className="font-bold text-base leading-tight">{card.title}</h3>
        <p className="text-xs text-blue-50 mt-1 line-clamp-1">{card.description}</p>
      </div>

      {/* PongBot Parameters - Compact Grid */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold text-gray-700">PongBot Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Spin
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">
                {card.parameters.spin}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Speed
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">
                {card.parameters.speed}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Height
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">
                {card.parameters.height}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Distance
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">
                {card.parameters.distance}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Location
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">
                {card.parameters.location}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Reps
              </div>
              <div className="text-xs font-medium text-gray-900">
                {card.parameters.repetitions} balls
              </div>
            </div>
          </div>
        </div>

        {/* Focus Points */}
        {card.focus_points.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Focus</div>
            <div className="space-y-1">
              {card.focus_points.map((point, index) => (
                <div key={index} className="flex items-start text-[11px] text-gray-600">
                  <svg className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="flex-1 leading-tight">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
