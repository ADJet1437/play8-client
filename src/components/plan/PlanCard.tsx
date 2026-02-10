import { useState } from 'react';
import { FiTrash2, FiCheck, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { PlanItem } from '../../types';
import { CATEGORY_ICONS } from '../studio/StudioData';

interface PlanCardProps {
  item: PlanItem;
  onToggleStep: (stepIndex: number) => void;
  onDelete: () => void;
}

export function PlanCard({ item, onToggleStep, onDelete }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const checkedCount = item.checked_steps.filter(Boolean).length;
  const totalSteps = item.steps.length;
  const progressPercent = totalSteps > 0 ? (checkedCount / totalSteps) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
      {/* Card header */}
      <div
        className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">{CATEGORY_ICONS[item.category] || '✨'}</span>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate flex-1">
            {item.title}
          </h4>
          {expanded ? (
            <FiChevronUp size={14} className="text-gray-400 flex-shrink-0" />
          ) : (
            <FiChevronDown size={14} className="text-gray-400 flex-shrink-0" />
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mb-2">
          {item.difficulty && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColors[item.difficulty] || ''}`}>
              {item.difficulty}
            </span>
          )}
          {item.duration && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <FiClock size={10} />
              {item.duration}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {totalSteps > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {checkedCount}/{totalSteps} steps
              </span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  item.status === 'complete' ? 'bg-green-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700/50 p-3 space-y-3">
          {/* Overview */}
          {item.overview && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.overview}
            </p>
          )}

          {/* Steps with checkboxes */}
          {item.steps.length > 0 && (
            <ol className="space-y-1.5">
              {item.steps.map((step, index) => {
                const isChecked = item.checked_steps[index] ?? false;
                return (
                  <li key={index} className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStep(index);
                      }}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                      }`}
                    >
                      {isChecked && <FiCheck size={12} />}
                    </button>
                    <span
                      className={`text-xs leading-5 ${
                        isChecked
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Tips */}
          {item.tips.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tips</h5>
              <ul className="space-y-1">
                {item.tips.map((tip, index) => (
                  <li key={index} className="flex gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-indigo-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Delete button */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Remove from plan?</span>
                <button
                  onClick={() => {
                    onDelete();
                    setShowConfirm(false);
                  }}
                  className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <FiTrash2 size={12} />
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
