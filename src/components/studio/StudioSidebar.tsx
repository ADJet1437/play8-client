import { useState, useMemo } from 'react';
import { FiBookOpen, FiZap } from 'react-icons/fi';
import { StudioCard } from './StudioCard';
import { StudioModal } from './StudioModal';
import {
  STUDIO_CARDS,
  CATEGORY_LABELS,
  StudioCard as StudioCardType,
} from './StudioData';

interface StudioSidebarProps {
  conversationText?: string; // Combined text from conversation for contextual matching
}

export function StudioSidebar({ conversationText = '' }: StudioSidebarProps) {
  const [selectedCard, setSelectedCard] = useState<StudioCardType | null>(null);

  // Find contextually relevant cards based on conversation
  const contextualCards = useMemo(() => {
    if (!conversationText) return [];

    const lowerText = conversationText.toLowerCase();
    const matches: { card: StudioCardType; score: number }[] = [];

    STUDIO_CARDS.forEach((card) => {
      let score = 0;
      card.keywords.forEach((keyword) => {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      if (score > 0) {
        matches.push({ card, score });
      }
    });

    // Sort by score and return top 3
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((m) => m.card);
  }, [conversationText]);

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
          {/* Contextual Section */}
          {contextualCards.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FiZap size={14} />
                Related to your chat
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {contextualCards.map((card) => (
                  <StudioCard
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
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

      {/* Modal */}
      {selectedCard && (
        <StudioModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}
