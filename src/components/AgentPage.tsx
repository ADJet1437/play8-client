import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FiArrowUp, FiMessageCircle, FiBookOpen, FiMoreVertical } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { StudioSidebar } from './studio/StudioSidebar';

// Constants for panel sizing
const DEFAULT_CHAT_WIDTH = 33; // Chat takes 1/3 by default
const MIN_CHAT_WIDTH = 20;
const MAX_CHAT_WIDTH = 60;

interface LocationState {
  initialMessage?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Compact markdown components for narrow chat panel
const CompactMarkdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-6 text-sm">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 pl-4 list-disc space-y-1 text-sm">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-2 pl-4 list-decimal space-y-1 text-sm">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-6">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-sm font-semibold mb-2 mt-2 first:mt-0">{children}</h3>
  ),
  code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode; [key: string]: unknown }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mb-2 overflow-hidden rounded">{children}</pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 italic my-2 text-sm text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-indigo-600 dark:text-indigo-400 underline text-sm" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hr: () => <hr className="my-3 border-gray-200 dark:border-gray-700" />,
};

// Markdown components for clean rendering
const MarkdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 last:mb-0 leading-7">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 pl-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 pl-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-semibold mb-4 mt-6 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>
  ),
  code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode; [key: string]: unknown }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mb-4 overflow-hidden rounded-lg">{children}</pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-3 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-sm border-t border-gray-200 dark:border-gray-700">
      {children}
    </td>
  ),
};

export function AgentPage() {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const initialMessage = locationState?.initialMessage;

  // Initialize messages with the initial message if provided
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessage?.trim()) {
      return [{ role: 'user', content: initialMessage.trim() }];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(() => !!initialMessage?.trim());
  const [isStreaming, setIsStreaming] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'studio'>('chat');
  const [chatWidthPercent, setChatWidthPercent] = useState(DEFAULT_CHAT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  // Determine if chat is in compact mode (narrow width)
  const isCompactChat = chatWidthPercent < 40;

  // Handle panel resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setChatWidthPercent(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Combine all message content for contextual matching in studio
  const conversationText = useMemo(() => {
    return messages.map((m) => m.content).join(' ');
  }, [messages]);

  // Scroll to bottom - uses container scrollTop for smoother streaming
  const scrollToBottom = useCallback((instant = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      if (instant) {
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Scroll on new messages, instant scroll during streaming
  useEffect(() => {
    scrollToBottom(isStreaming);
  }, [messages, scrollToBottom, isStreaming]);

  // Auto-focus input
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set height to scrollHeight, capped at max
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  // Fetch response from API (does not add user message - assumes it's already in state)
  const fetchResponse = useCallback(async (messageContent: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageContent,
          conversation_history: conversationHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Add assistant message placeholder
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setIsStreaming(true);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  assistantMessage += data.content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, []);

  // Send a new message (adds user message to state, then fetches response)
  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const trimmed = input.trim();
    const userMessage: Message = { role: 'user', content: trimmed };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Fetch response (user message already added above)
    fetchResponse(trimmed, messages);
  };

  // Handle initial message from navigation - user message already in state via useState initializer
  useEffect(() => {
    if (initialMessage?.trim() && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      // Fetch response immediately - user message is already displayed
      fetchResponse(initialMessage.trim(), []);
    }
  }, [initialMessage, fetchResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Chat content component (used in both desktop and mobile)
  const renderChatContent = (compact: boolean) => (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        {messages.length === 0 ? (
          // Welcome State - centered in viewport
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <h1 className={`font-semibold text-gray-900 dark:text-gray-100 ${compact ? 'text-lg' : 'text-2xl'}`}>
              How can I help you?
            </h1>
          </div>
        ) : (
          // Messages - pinned to bottom when content is short
          <div className="flex-1 flex flex-col justify-end">
            <div className={`w-full mx-auto space-y-4 ${compact ? 'px-3 py-4' : 'px-4 py-8 max-w-3xl space-y-6'}`}>
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'text-left'}>
                  {message.role === 'user' ? (
                    // User message - bubble style
                    <div className={`bg-indigo-600 text-white rounded-2xl ${compact ? 'max-w-[90%] px-3 py-2' : 'max-w-[85%] px-4 py-3'}`}>
                      <p className={`whitespace-pre-wrap text-left ${compact ? 'text-sm leading-6' : 'leading-7'}`}>
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    // Assistant message - clean text
                    <div className="text-left text-gray-900 dark:text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={compact ? CompactMarkdownComponents : MarkdownComponents}
                      >
                        {message.content || ' '}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && !isStreaming && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className={`flex-shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 ${compact ? 'p-2' : 'p-4'}`}>
        <div className={compact ? '' : 'max-w-3xl mx-auto'}>
          <div className="relative flex items-end bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-indigo-300 dark:focus-within:border-indigo-600 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={compact ? "Ask..." : "Message play8..."}
              rows={1}
              className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none ${compact ? 'px-3 py-2 pr-10 text-sm max-h-[100px]' : 'px-4 py-3 pr-12 max-h-[200px]'} leading-6`}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute bottom-1.5 p-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors ${compact ? 'right-1.5' : 'right-2 p-2'}`}
            >
              <FiArrowUp size={compact ? 14 : 18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Desktop Layout - Resizable Panels */}
      <div
        ref={containerRef}
        className="hidden md:flex flex-1 min-h-0 overflow-hidden"
      >
        {/* Chat Area */}
        <div
          className="min-w-0 overflow-hidden"
          style={{ width: `${chatWidthPercent}%` }}
        >
          {renderChatContent(isCompactChat)}
        </div>

        {/* Resize Handle */}
        <div
          className={`w-1 flex-shrink-0 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-500 transition-colors cursor-col-resize flex items-center justify-center group ${isDragging ? 'bg-indigo-500' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiMoreVertical size={12} className="text-white" />
          </div>
        </div>

        {/* Studio Area - Takes remaining space */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <StudioSidebar conversationText={conversationText} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-1 flex-col min-h-0 overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'chat' ? (
            renderChatContent(false)
          ) : (
            <StudioSidebar conversationText={conversationText} />
          )}
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'chat'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiMessageCircle size={18} />
            Chat
          </button>
          <button
            onClick={() => setMobileTab('studio')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'studio'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiBookOpen size={18} />
            Studio
          </button>
        </div>
      </div>

      {/* Overlay to prevent text selection during drag */}
      {isDragging && <div className="fixed inset-0 z-50 cursor-col-resize" />}
    </div>
  );
}

