import { useState } from 'react';
import { FiX, FiClock, FiTarget, FiZap, FiCheck, FiPlus } from 'react-icons/fi';
import { StudioCard as StudioCardType, CATEGORY_LABELS, CATEGORY_ICONS } from './StudioData';
import { StreamingStudioCard } from '../../types';
import { planApi } from '../../services/api';

interface StudioModalProps {
  card?: StudioCardType;
  generatedCard?: StreamingStudioCard;
  onClose: () => void;
  onToggleStep?: (stepIndex: number) => void;
}

export function StudioModal({ card, generatedCard, onClose, onToggleStep }: StudioModalProps) {
  const [addState, setAddState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAddToPlan = async () => {
    setAddState('loading');
    try {
      await planApi.add({
        title,
        description: overview.slice(0, 200),
        category,
        difficulty,
        duration,
        overview,
        steps,
        tips,
      });
      setAddState('success');
      setTimeout(() => setAddState('idle'), 1000);
    } catch (error) {
      console.error('Failed to add to plan:', error);
      setAddState('idle');
    }
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  // Normalize data from either card type
  const title = card?.title ?? generatedCard?.title ?? '';
  const category = card?.category ?? generatedCard?.category ?? 'training';
  const difficulty = card?.content.difficulty ?? generatedCard?.difficulty;
  const duration = card?.content.duration ?? generatedCard?.duration;
  const overview = card?.content.overview ?? generatedCard?.overview ?? '';
  const steps = card?.content.steps ?? generatedCard?.steps ?? [];
  const tips = card?.content.tips ?? generatedCard?.tips ?? [];
  const isStreaming = generatedCard?.isStreaming ?? false;
  const streamingSection = generatedCard?.streamingSection;
  const isGenerated = !!generatedCard;
  const checkedSteps = generatedCard?.checked_steps ?? [];
  const hasCheckableSteps = isGenerated && steps.length > 0 && !isStreaming;

  // Progress calculation
  const checkedCount = checkedSteps.filter(Boolean).length;
  const totalSteps = steps.length;
  const isComplete = hasCheckableSteps && checkedCount === totalSteps && totalSteps > 0;
  const progressPercent = totalSteps > 0 ? (checkedCount / totalSteps) * 100 : 0;

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
            <span className="text-3xl">{CATEGORY_ICONS[category] || '✨'}</span>
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                {isGenerated && <FiZap size={10} />}
                {CATEGORY_LABELS[category as StudioCardType['category']] ?? category}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                {difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[difficulty]}`}>
                    {difficulty}
                  </span>
                )}
                {duration && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FiClock size={12} />
                    {duration}
                  </span>
                )}
                {isStreaming && (
                  <span className="text-xs text-indigo-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    Generating...
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
              {overview}
              {isStreaming && streamingSection === 'overview' && (
                <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-blink align-text-bottom" />
              )}
            </p>
            {isStreaming && !overview && streamingSection === 'overview' && (
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            )}
          </div>

          {/* Steps */}
          {(steps.length > 0 || (isStreaming && streamingSection === 'steps')) && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FiTarget size={16} className="text-indigo-600 dark:text-indigo-400" />
                {category === 'training' ? 'Program Outline' : 'Steps'}
              </h3>

              {/* Progress bar for generated cards */}
              {hasCheckableSteps && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    {isComplete ? (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        <FiCheck size={12} />
                        Complete
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {checkedCount}/{totalSteps} steps
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <ol className="space-y-2">
                {steps.map((step, index) => {
                  const isChecked = checkedSteps[index] ?? false;
                  return (
                    <li
                      key={index}
                      className="flex gap-3 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {hasCheckableSteps && onToggleStep ? (
                        <button
                          onClick={() => onToggleStep(index)}
                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                          }`}
                        >
                          {isChecked && <FiCheck size={14} />}
                        </button>
                      ) : (
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                      )}
                      <span className={`text-sm leading-6 ${
                        isChecked
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {isStreaming && streamingSection === 'steps' && (
                <div className="flex gap-3 mt-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
                  <span className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          {(tips.length > 0 || (isStreaming && streamingSection === 'tips')) && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Pro Tips
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-gray-600 dark:text-gray-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-indigo-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
              {isStreaming && streamingSection === 'tips' && (
                <div className="flex gap-2 mt-2">
                  <span className="text-gray-300">•</span>
                  <span className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              )}
            </div>
          )}

          {/* Placeholder for sections not yet streamed */}
          {isStreaming && !overview && streamingSection !== 'overview' && (
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          {!isStreaming && (
            <button
              onClick={handleAddToPlan}
              disabled={addState !== 'idle'}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                addState === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } disabled:opacity-70`}
            >
              {addState === 'success' ? (
                <>
                  <FiCheck size={16} />
                  Added!
                </>
              ) : addState === 'loading' ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiPlus size={16} />
                  Add to plan
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
