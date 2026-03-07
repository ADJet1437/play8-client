import { DrillCard } from '../../types';

interface DrillCardComponentProps {
  card: DrillCard;
  onNext?: () => void;
  onPrevious?: () => void;
  currentDrill?: number;
  totalDrills?: number;
}

export default function DrillCardComponent({
  card,
  onNext,
  onPrevious,
  currentDrill,
  totalDrills,
}: DrillCardComponentProps) {
  // Check if this is new format (ball_sequence) or legacy (parameters)
  const hasNewFormat = card.ball_sequence && card.ball_sequence.length > 0;
  const hasLegacyFormat = card.parameters;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto h-[750px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="text-sm font-medium opacity-90 mb-1">
              Drill {card.drill_number}
              {currentDrill && totalDrills && (
                <span className="ml-2">
                  ({currentDrill}/{totalDrills})
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{card.title}</h2>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
            {card.duration}
          </div>
        </div>
        <p className="text-blue-100 text-sm">{card.description}</p>
        {card.machine_position && (
          <div className="mt-2 text-xs text-blue-200">
            📍 Machine Position: {card.machine_position}
          </div>
        )}
      </div>

      {/* PongBot Settings */}
      <div className="p-6 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          PongBot Settings
          {hasNewFormat && card.sequence_repetitions && (
            <span className="ml-auto text-sm font-normal text-gray-600">
              Repeat {card.sequence_repetitions}x
            </span>
          )}
        </h3>

        {/* New Format: Ball Sequence */}
        {hasNewFormat && (
          <div className="space-y-4">
            {card.ball_sequence!.map((ball) => (
              <div key={ball.ball_number} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Ball {ball.ball_number}</span>
                </div>
                <div className="p-4">
                  <table className="min-w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700 w-32">Spin Type</td>
                        <td className="py-1.5 text-gray-900">{ball.spin_type}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700">Spin Strength</td>
                        <td className="py-1.5 text-gray-900">{ball.spin_strength}/10</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700">Speed</td>
                        <td className="py-1.5 text-gray-900">{ball.speed}/10</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700">Drop Point</td>
                        <td className="py-1.5 text-gray-900">
                          {ball.drop_point} {ball.drop_point < 0 ? '(Left)' : ball.drop_point > 0 ? '(Right)' : '(Center)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700">Depth</td>
                        <td className="py-1.5 text-gray-900">{ball.depth}/20</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-medium text-gray-700">Feed Interval</td>
                        <td className="py-1.5 text-gray-900">{ball.feed}s</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legacy Format: Single Parameter Set */}
        {!hasNewFormat && hasLegacyFormat && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setting
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Spin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.spin}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Height
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.height}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Distance
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.distance}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Repetitions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.repetitions} balls
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Location
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.location}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Speed
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {card.parameters!.speed}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Focus Points */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Focus Points</h3>
        <ul className="space-y-2">
          {card.focus_points.map((point, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-6 flex gap-3">
        {onPrevious && currentDrill && currentDrill > 1 && (
          <button
            onClick={onPrevious}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous Drill
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            {currentDrill && totalDrills && currentDrill < totalDrills ? (
              <>
                Next Drill
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            ) : (
              'Complete Training'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
