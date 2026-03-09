import { useState } from 'react';
import { TrainingPlanCard, DrillCard } from '../../types';
import { savedSessionApi } from '../../services/api';

interface TrainingPlanCardComponentProps {
  card: TrainingPlanCard;
  drillCards?: DrillCard[];
  onStartTraining?: () => void;
}

export default function TrainingPlanCardComponent({
  card,
  drillCards = [],
  onStartTraining,
}: TrainingPlanCardComponentProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleSaveToPlan = async () => {
    try {
      setSaveStatus('saving');
      setSaveMessage('');
      await savedSessionApi.save(card, drillCards);
      setSaveStatus('success');
      setSaveMessage('Training session saved to your plan!');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Failed to save training session. Please try again.');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto h-[750px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold flex-1">{card.title}</h2>
          <div className="flex flex-col gap-2">
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium text-center">
              {card.total_duration}
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium capitalize text-center">
              {card.difficulty}
            </div>
          </div>
        </div>
        <p className="text-green-100">{card.description}</p>
      </div>

      {/* Training Plan Content */}
      <div className="p-6 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Training Drills
        </h3>

        {/* Drill List */}
        <div className="space-y-3">
          {card.drills.map((drill, index) => (
            <div
              key={index}
              className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all"
            >
              {/* Drill Number Badge */}
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                {index + 1}
              </div>

              {/* Drill Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">{drill.name}</h4>
                  <span className="ml-2 text-sm font-medium text-gray-500 whitespace-nowrap">
                    {drill.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{drill.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        {/* Save/Success/Error Message */}
        {saveMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              saveStatus === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {saveMessage}
          </div>
        )}

        <div className={onStartTraining ? 'flex gap-3' : ''}>
          {/* Save to Plan Button */}
          <button
            onClick={handleSaveToPlan}
            disabled={saveStatus === 'saving'}
            className={`${
              onStartTraining ? 'flex-1' : 'w-full'
            } px-3 py-2 sm:px-6 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center text-sm sm:text-lg shadow-lg hover:shadow-xl disabled:cursor-not-allowed`}
          >
            {saveStatus === 'saving' ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 mr-1.5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Save to Plan
              </>
            )}
          </button>

          {/* Start Training Button */}
          {onStartTraining && (
            <button
              onClick={onStartTraining}
              className="flex-1 px-3 py-2 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center text-sm sm:text-lg shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4 sm:w-6 sm:h-6 mr-1.5 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          )}
        </div>
      </div>

    </div>
  );
}
