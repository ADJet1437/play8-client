import { useState } from 'react';
import { FiX, FiSave, FiRotateCcw } from 'react-icons/fi';
import { DrillCard } from '../../types';
import { InteractiveCourt } from './InteractiveCourt';
import { EditableParameterTable } from './EditableParameterTable';

interface DrillEditorProps {
  drill: DrillCard;
  onSave: (updatedDrill: DrillCard) => void;
  onClose: () => void;
  onDone?: (updatedDrill: DrillCard) => void;
}

export function DrillEditor({ drill, onSave, onClose, onDone }: DrillEditorProps) {
  const [editedDrill, setEditedDrill] = useState<DrillCard>(drill);
  const [hasChanges, setHasChanges] = useState(false);
  const [doneSaved, setDoneSaved] = useState(false);

  const handleDrillUpdate = (updatedDrill: DrillCard) => {
    setEditedDrill(updatedDrill);
    setHasChanges(true);
    // Auto-save on every change
    onSave(updatedDrill);
  };

  const handleReset = () => {
    setEditedDrill(drill);
    setHasChanges(false);
    onSave(drill); // Reset to original
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-0 md:p-4">
      <div className="bg-white dark:bg-gray-800 w-full h-full md:w-[98vw] md:h-[96vh] md:max-w-[1600px] md:rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-bold text-white truncate">Edit Drill: {editedDrill.title}</h2>
            <p className="text-xs md:text-sm text-blue-100 mt-0.5 truncate hidden sm:block">{editedDrill.description}</p>
          </div>
          <div className="flex items-center gap-1 md:gap-3 ml-2">
            {hasChanges && (
              <span className="hidden md:flex items-center gap-1.5 text-xs text-green-300 bg-green-900/30 px-3 py-1.5 rounded-full">
                <FiSave size={12} />
                Auto-saved
              </span>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reset to original"
            >
              <FiRotateCcw size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close editor"
            >
              <FiX size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Main content: Court + Table (stacked on mobile, side-by-side on desktop) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Interactive Court */}
          <div className="w-full lg:flex-[6] p-3 md:p-6 flex flex-col overflow-hidden">
            <div className="mb-2 md:mb-4 flex-shrink-0">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                Interactive Court
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>🖱️ Drag numbered circles to move ball drop points</span>
                <span>🔄 Click "M" to cycle machine position</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-[550px]">
                <InteractiveCourt
                  drill={editedDrill}
                  onDrillUpdate={handleDrillUpdate}
                />
              </div>
            </div>
          </div>

          {/* Parameter Table */}
          <div className="w-full lg:flex-[4] border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-3 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            <EditableParameterTable
              drill={editedDrill}
              onUpdate={handleDrillUpdate}
            />

            {/* Machine Position Display */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                Machine Position
              </h4>
              <p className="text-xs md:text-sm text-gray-900 dark:text-gray-100 font-medium">
                {editedDrill.machine_position}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Click the "M" icon on the court to change
              </p>
            </div>

            {/* Drill Info */}
            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                Drill Info
              </h4>
              <div className="space-y-1 md:space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{editedDrill.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sequence Repeats:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{editedDrill.sequence_repetitions}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
              Changes are automatically saved as you edit.
            </p>
            <button
              onClick={() => {
                if (onDone) {
                  onDone(editedDrill);
                  setDoneSaved(true);
                  setTimeout(onClose, 600);
                } else {
                  onClose();
                }
              }}
              className={`w-full sm:w-auto px-6 py-2.5 font-medium rounded-lg transition-colors ${
                doneSaved
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {doneSaved ? 'Saved!' : 'Done Editing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
