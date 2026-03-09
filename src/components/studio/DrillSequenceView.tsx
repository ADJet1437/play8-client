import { useState, useEffect, useCallback, useRef } from 'react';
import { DrillCard, TrainingPlanCard } from '../../types';
import DrillCardComponent from './DrillCardComponent';

interface DrillSequenceViewProps {
  drills: DrillCard[];
  onClose: () => void;
  onDrillDone?: (drillIndex: number, updatedDrill: DrillCard) => void;
  trainingPlan?: TrainingPlanCard;
  onUseSetting?: (plan: TrainingPlanCard, drills: DrillCard[]) => void;
}

export function DrillSequenceView({ drills, onClose, onDrillDone, trainingPlan, onUseSetting }: DrillSequenceViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const [localDrills, setLocalDrills] = useState<DrillCard[]>(() =>
    JSON.parse(JSON.stringify(drills))
  );

  const currentDrill = localDrills[currentIndex];
  const hasChanges = JSON.stringify(localDrills) !== JSON.stringify(drills);

  const handleDrillUpdate = useCallback((updatedDrill: DrillCard) => {
    setLocalDrills((prev) => prev.map((d, i) => (i === currentIndexRef.current ? updatedDrill : d)));
  }, []);

  // Set up keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleKeyboardNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleKeyboardPrevious();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, localDrills.length]); // Re-attach when index changes

  const handleNext = () => {
    if (currentIndex < localDrills.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Training complete
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleKeyboardNext = () => {
    if (currentIndex < localDrills.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleKeyboardPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
        aria-label="Close training view"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Progress indicator */}
      <div className="fixed top-4 left-4 right-4 flex justify-center z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-white font-medium">
            Drill {currentIndex + 1} of {localDrills.length}
          </span>
          <div className="ml-2 h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / localDrills.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drill card */}
      <div className="w-full max-w-3xl mt-16 mb-4">
        <DrillCardComponent
          key={currentIndex}
          card={currentDrill}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentDrill={currentIndex + 1}
          totalDrills={localDrills.length}
          onDrillUpdate={handleDrillUpdate}
          onDrillDone={onDrillDone ? (updatedDrill) => onDrillDone(currentIndex, updatedDrill) : undefined}
          onUseSetting={trainingPlan && onUseSetting && hasChanges ? () => onUseSetting(trainingPlan, localDrills) : undefined}
          allowEdit
        />

      </div>
    </div>
  );
}
