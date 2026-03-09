import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { DrillCard } from '../../types';
import { CourtDiagram } from './CourtDiagram';
import { DrillEditor } from './DrillEditor';

interface DrillCardComponentProps {
  card: DrillCard;
  onNext?: () => void;
  onPrevious?: () => void;
  currentDrill?: number;
  totalDrills?: number;
  onDrillUpdate?: (updatedDrill: DrillCard) => void;
}

export default function DrillCardComponent({
  card,
  onNext,
  onPrevious,
  currentDrill,
  totalDrills,
  onDrillUpdate,
}: DrillCardComponentProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [currentCard, setCurrentCard] = useState(card);

  // Check if this is new format (ball_sequence) or legacy (parameters)
  const hasNewFormat = currentCard.ball_sequence && currentCard.ball_sequence.length > 0;
  const hasLegacyFormat = currentCard.parameters;

  const handleDrillUpdate = (updatedDrill: DrillCard) => {
    setCurrentCard(updatedDrill);
    onDrillUpdate?.(updatedDrill);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto h-[750px] flex flex-col">
      {/* Header - Compact with Focus Points */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <div className="text-xs font-medium opacity-90 mb-0.5">
              Drill {currentCard.drill_number}
              {currentDrill && totalDrills && (
                <span className="ml-1.5">
                  ({currentDrill}/{totalDrills})
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold">{currentCard.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditor(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Edit drill parameters"
            >
              <FiEdit2 size={18} />
            </button>
            <div className="bg-white/20 rounded-lg px-2.5 py-0.5 text-xs font-medium">
              {currentCard.duration}
            </div>
          </div>
        </div>
        <p className="text-blue-100 text-xs line-clamp-1 mb-1.5">{currentCard.description}</p>

        {/* Focus Points - Vertical with checkmarks */}
        {currentCard.focus_points.length > 0 && (
          <div className="space-y-0.5 mt-1.5">
            {currentCard.focus_points.map((point, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <svg
                  className="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-blue-50">{point}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PongBot Settings */}
      <div className="p-4 flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
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
          {hasNewFormat && currentCard.sequence_repetitions && (
            <span className="ml-auto text-sm font-normal text-gray-600">
              Repeat {currentCard.sequence_repetitions}x
            </span>
          )}
        </h3>

        {/* Court Diagram - Visual representation */}
        {hasNewFormat && (
          <div className="mb-3 bg-gray-50 rounded-lg p-2">
            <CourtDiagram
              machinePosition={currentCard.machine_position}
              ballSequence={currentCard.ball_sequence}
            />
          </div>
        )}

        {/* New Format: Ball Sequence - Horizontal Table (6 balls) */}
        {hasNewFormat && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-r border-gray-200 sticky left-0 bg-gray-50">
                    Parameter
                  </th>
                  {currentCard.ball_sequence!.map((ball) => (
                    <th key={ball.ball_number} className="px-2 py-1.5 text-center font-semibold text-gray-900 border-b border-gray-200 min-w-[70px]">
                      Ball {ball.ball_number}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Spin Type
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.spin_type}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Spin Strength
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.spin_strength}/10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Speed
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.speed}/10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Drop Point
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.drop_point}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Depth
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.depth}/20
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0">
                    Feed (s)
                  </td>
                  {currentCard.ball_sequence!.map((ball) => (
                    <td key={ball.ball_number} className="px-2 py-1 text-center text-gray-900">
                      {ball.feed}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
                    {currentCard.parameters!.spin}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Height
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentCard.parameters!.height}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Distance
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentCard.parameters!.distance}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Repetitions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentCard.parameters!.repetitions} balls
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Location
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentCard.parameters!.location}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Speed
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentCard.parameters!.speed}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
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

      {/* Drill Editor Modal */}
      {showEditor && (
        <DrillEditor
          drill={currentCard}
          onSave={handleDrillUpdate}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
