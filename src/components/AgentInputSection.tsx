import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPaperclip } from 'react-icons/fi';

const SUGGESTED_PROMPTS = [
  'How can I improve my tennis serve?',
  'What drills should I do for better footwork?',
  'Tips for hitting a topspin forehand',
  'How to practice alone with a ball machine?',
];

export function AgentInputSection() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Navigate to agent page with the initial message
    navigate('/agent', { state: { initialMessage: trimmed } });
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    // Focus the input so user can edit or press Enter
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative py-24 overflow-hidden transition-colors">
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-900/30 dark:via-gray-900 dark:to-gray-900" />

      {/* Cloud-like effects on the sides */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-sky-200/60 via-sky-100/30 to-transparent dark:from-sky-800/20 dark:via-transparent blur-3xl" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-sky-200/60 via-sky-100/30 to-transparent dark:from-sky-800/20 dark:via-transparent blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 blur-2xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading with styled word */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-10">
            A <span className="italic text-sky-600 dark:text-sky-400">smarter</span> way to train tennis
          </h2>

          {/* Input area */}
          <div className="relative mb-8">
            <div className="flex items-end bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-lg hover:shadow-xl focus-within:shadow-xl transition-all p-3">
              {/* Attachment button */}
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                title="Attach file"
              >
                <FiPaperclip size={20} />
              </button>

              {/* Text input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about tennis..."
                rows={3}
                className="flex-1 bg-transparent px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-lg resize-none"
              />

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors flex-shrink-0 self-end"
              >
                <FiArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Suggested prompts label */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Start from here</p>

          {/* Suggested prompts */}
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                className="px-4 py-2 text-sm bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200/60 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
