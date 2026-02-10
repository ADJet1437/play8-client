import { useState, useMemo } from 'react';
import { FiBookOpen, FiZap } from 'react-icons/fi';
import { StudioCard } from './StudioCard';
import { StudioModal } from './StudioModal';
import {
  STUDIO_CARDS,
  CATEGORY_LABELS,
  StudioCard as StudioCardType,
} from './StudioData';
import { StreamingStudioCard } from '../../types';
import { GeneratedStudioCardComponent } from './GeneratedStudioCard';

interface StudioSidebarProps {
  conversationText?: string;
  generatedCards?: StreamingStudioCard[];
  onToggleStep?: (cardIndex: number, stepIndex: number) => void;
}

export function StudioSidebar({ generatedCards = [], onToggleStep }: StudioSidebarProps) {
  const [selectedCard, setSelectedCard] = useState<StudioCardType | null>(null);
  const [selectedGeneratedCardIndex, setSelectedGeneratedCardIndex] = useState<number | null>(null);

  // Group cards by category
  const cardsByCategory = useMemo(() => {
    const grouped: Record<string, StudioCardType[]> = {};
    STUDIO_CARDS.forEach((card) => {
      if (!grouped[card.category]) {
        grouped[card.category] = [];
      }
      grouped[card.category].push(card);
    });
    return grouped;
  }, []);

  const selectedGeneratedCard = selectedGeneratedCardIndex !== null ? generatedCards[selectedGeneratedCardIndex] : null;

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FiBookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
            Studio
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* AI-Generated Contextual Section */}
          {generatedCards.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FiZap size={14} />
                Related to your chat
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {generatedCards.map((card, index) => (
                  <GeneratedStudioCardComponent
                    key={`generated-${index}-${card.title}`}
                    card={card}
                    onClick={() => setSelectedGeneratedCardIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Static Categories */}
          {Object.entries(cardsByCategory).map(([category, cards]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                {CATEGORY_LABELS[category as StudioCardType['category']]}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {cards.map((card) => (
                  <StudioCard
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static card modal */}
      {selectedCard && (
        <StudioModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Generated card modal */}
      {selectedGeneratedCard && selectedGeneratedCardIndex !== null && (
        <StudioModal
          generatedCard={selectedGeneratedCard}
          onClose={() => setSelectedGeneratedCardIndex(null)}
          onToggleStep={onToggleStep ? (stepIndex: number) => onToggleStep(selectedGeneratedCardIndex, stepIndex) : undefined}
        />
      )}
    </>
  );
}
