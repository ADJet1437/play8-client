import { useState } from 'react';
import { TrainingPlanCard, DrillCard } from '../../types';
import { savedSessionApi } from '../../services/api';
import DownloadOverlay from './DownloadOverlay';

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
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'confirming' | 'downloading'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);

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

  const handleDownloadImages = () => {
    if (downloadStatus !== 'idle') return;
    setDownloadStatus('confirming');
  };

  const handleConfirmDownload = () => {
    setDownloadStatus('downloading');
    setDownloadProgress({ current: 0, total: 1 + drillCards.length });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto h-[690px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shrink-0">
        <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 items-center">
          <h2 className="text-2xl font-bold leading-tight">{card.title}</h2>
          <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium text-center whitespace-nowrap">
            {card.total_duration}
          </div>
          <p className="text-green-100">{card.description}</p>
          <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium capitalize text-center whitespace-nowrap">
            {card.difficulty}
          </div>
        </div>
      </div>

      {/* Training Plan Content */}
      <div className="p-6 flex-1 overflow-y-auto">
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
      <div className="px-4 py-2">
        {saveMessage && (
          <div className={`mb-2 px-3 py-1.5 rounded-lg text-xs font-medium text-right ${
            saveStatus === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="flex gap-2 items-center justify-end">
          {/* Start */}
          {onStartTraining && (
            <button
              onClick={onStartTraining}
              title="Start training"
              className="w-9 h-9 shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          {/* Save */}
          <button
            onClick={handleSaveToPlan}
            disabled={saveStatus === 'saving'}
            title="Save to plan"
            className="w-9 h-9 shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? (
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : saveStatus === 'success' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>

          {/* Download */}
          <button
            onClick={handleDownloadImages}
            disabled={downloadStatus === 'downloading' || downloadStatus === 'confirming'}
            title="Download as images"
            className="w-9 h-9 shrink-0 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 text-white rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
          >
            {downloadStatus === 'downloading' ? (
              downloadProgress ? (
                <span className="text-[10px] font-semibold leading-none">
                  {downloadProgress.current}/{downloadProgress.total}
                </span>
              ) : (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {downloadStatus === 'confirming' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Save to Photos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              This will save <span className="font-medium text-gray-900">{1 + drillCards.length} images</span> to your device — 1 training plan overview and {drillCards.length} drill card{drillCards.length !== 1 ? 's' : ''}.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDownloadStatus('idle')}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDownload}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
              >
                Save Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download overlay — rendered into document.body as a portal, captured by useEffect */}
      {downloadStatus === 'downloading' && (
        <DownloadOverlay
          plan={card}
          drills={drillCards}
          onProgress={(current, total) => setDownloadProgress({ current, total })}
          onDone={() => {
            setDownloadStatus('idle');
            setDownloadProgress(null);
          }}
        />
      )}
    </div>
  );
}
