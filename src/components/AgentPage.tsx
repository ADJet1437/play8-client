import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowUp, FiMessageCircle, FiSidebar } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConversationSidebar } from './ConversationSidebar';
import { cardProgressApi, conversationApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Conversation,
  StreamingStudioCard,
  TrainingPlanCard,
  DrillCard,
} from '../types';
import TrainingPlanCardComponent from './studio/TrainingPlanCardComponent';
import { DrillSequenceView } from './studio/DrillSequenceView';
import CardCarousel from './studio/CardCarousel';
import DrillCardComponent from './studio/DrillCardComponent';
import CardLoadingIndicator from './studio/CardLoadingIndicator';

// No longer need panel sizing constants - chat takes full width

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
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children, ...rest } = props;
    const isInline = !className;
    return isInline ? (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...rest}>
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre" {...rest}>
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
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children, ...rest } = props;
    const isInline = !className;
    return isInline ? (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...rest}>
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre" {...rest}>
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
  const { conversationId: urlConversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const initialMessage = locationState?.initialMessage;
  const { isAuthenticated, login } = useAuth();

  // Conversation state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Generated studio cards state
  const [generatedCards, setGeneratedCards] = useState<StreamingStudioCard[]>([]);

  // New card types state
  const [trainingPlanCards, setTrainingPlanCards] = useState<TrainingPlanCard[]>([]);
  const [drillCards, setDrillCards] = useState<DrillCard[]>([]);
  const [activeDrillSequence, setActiveDrillSequence] = useState<DrillCard[] | null>(null);

  // Tool loading state (track which message index has loading tools)
  const [toolLoadingByMessage, setToolLoadingByMessage] = useState<Map<number, boolean>>(new Map());
  const toolLoadingStartTime = useRef<Map<number, number>>(new Map());
  const currentAssistantMessageIndex = useRef<number | null>(null);

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
  const [mobileTab, setMobileTab] = useState<'chat' | 'history'>('chat');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasProcessedInitialMessage = useRef(false);
  const loadedConversationRef = useRef<string | null>(null);
  /** When we navigate to /agent/:id from stream (new conversation), skip loading so we don't overwrite local messages */
  const conversationIdFromStreamRef = useRef<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    conversationApi.list().then((res) => {
      setConversations(res.data);
    }).catch(() => {
      // Silently fail — user may not have conversations yet
    });
  }, [isAuthenticated]);

  // No longer need resize or conversation text for studio

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

  // Parse tool_use result JSON into appropriate card type(s)
  const parseToolResultCards = useCallback(
    (
      result: string,
      toolName: string
    ): {
      legacyCards: StreamingStudioCard[];
      trainingPlanCard: TrainingPlanCard | null;
      drillCards: DrillCard[];
    } => {
      try {
        const parsed = JSON.parse(result);

        // Handle generate_training_session (returns both plan and drills)
        if (toolName === 'generate_training_session' && parsed.plan && parsed.drills) {
          return {
            legacyCards: [],
            trainingPlanCard: parsed.plan as TrainingPlanCard,
            drillCards: parsed.drills as DrillCard[],
          };
        }

        return { legacyCards: [], trainingPlanCard: null, drillCards: [] };
      } catch {
        return { legacyCards: [], trainingPlanCard: null, drillCards: [] };
      }
    },
    []
  );

  // Fetch response from API (does not add user message - assumes it's already in state)
  const fetchResponse = useCallback(async (messageContent: string, conversationHistory: Message[], convId: string | null) => {
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
          conversation_id: convId,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          login();
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let toolArgsBuffer = '';

      // Add assistant message placeholder
      setMessages((prev) => {
        const newMessages = [...prev, { role: 'assistant' as const, content: '' }];
        currentAssistantMessageIndex.current = newMessages.length - 1;
        return newMessages;
      });
      setIsStreaming(true);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));

              // Capture conversation_id from first chunk and update URL
              if (data.conversation_id && !convId) {
                convId = data.conversation_id;
                if (!urlConversationId) {
                  conversationIdFromStreamRef.current = data.conversation_id;
                  navigate(`/agent/${data.conversation_id}`, { replace: true });
                }
              }

              switch (data.type) {
                case 'text_delta':
                  assistantMessage += data.content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                  break;

                case 'tool_use_start':
                  console.log('🔧 Tool use start:', data);

                  // Only show skeleton loading indicator for training session generation
                  if (data.tool === 'generate_training_session') {
                    const currentMsgIndex = currentAssistantMessageIndex.current;
                    if (currentMsgIndex === null) {
                      console.error('❌ No current assistant message index!');
                      break;
                    }
                    console.log('📍 Setting loading for message index:', currentMsgIndex);

                    // Record start time for minimum display duration
                    toolLoadingStartTime.current.set(currentMsgIndex, Date.now());

                    setToolLoadingByMessage((prev) => {
                      const updated = new Map(prev);
                      updated.set(currentMsgIndex, true);
                      console.log('💾 Updated toolLoadingByMessage:', updated);
                      return updated;
                    });
                  }
                  toolArgsBuffer = '';
                  break;

                case 'tool_use_delta':
                  toolArgsBuffer += data.content;
                  break;

                case 'tool_use_end':
                  if (data.result && data.tool) {
                    const { legacyCards, trainingPlanCard, drillCards } = parseToolResultCards(
                      data.result,
                      data.tool
                    );

                    // Debug logging
                    console.log('🎯 Tool:', data.tool);
                    console.log('📋 Training Plan:', trainingPlanCard);
                    console.log('🎾 Drill Cards:', drillCards);

                    // Track which message generated these cards
                    setMessages((currentMessages) => {
                      const currentMessageIndex = currentAssistantMessageIndex.current;
                      if (currentMessageIndex === null) {
                        console.error('❌ No current assistant message index in tool_use_end!');
                        return currentMessages;
                      }

                      if (legacyCards.length > 0) {
                        const cardsWithIndex = legacyCards.map((card) => ({
                          ...card,
                          messageIndex: currentMessageIndex,
                        }));
                        setGeneratedCards((prev) => [...prev, ...cardsWithIndex]);
                      }

                      if (trainingPlanCard) {
                        setTrainingPlanCards((prev) => {
                          // Prevent duplicates by checking training_plan_id
                          const exists = prev.some(
                            (c) => c.training_plan_id === trainingPlanCard.training_plan_id
                          );
                          if (exists) return prev;
                          return [
                            ...prev,
                            { ...trainingPlanCard, messageIndex: currentMessageIndex },
                          ];
                        });
                      }

                      if (drillCards.length > 0) {
                        const drillsWithIndex = drillCards.map((card) => ({
                          ...card,
                          messageIndex: currentMessageIndex,
                        }));
                        setDrillCards((prev) => {
                          // Prevent duplicates by checking training_plan_id + drill_number
                          const newDrills = drillsWithIndex.filter(
                            (newDrill) =>
                              !prev.some(
                                (existingDrill) =>
                                  existingDrill.training_plan_id === newDrill.training_plan_id &&
                                  existingDrill.drill_number === newDrill.drill_number
                              )
                          );
                          return [...prev, ...newDrills];
                        });
                      }

                      // Hide loading indicator with minimum display time (only for training session tool)
                      if (data.tool === 'generate_training_session') {
                        const startTime = toolLoadingStartTime.current.get(currentMessageIndex);
                        const MIN_LOADING_TIME = 500; // milliseconds

                        if (startTime) {
                          const elapsed = Date.now() - startTime;
                          const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

                          console.log(`⏱️ Elapsed: ${elapsed}ms, waiting ${remainingTime}ms more`);

                          setTimeout(() => {
                            setToolLoadingByMessage((prev) => {
                              const updated = new Map(prev);
                              updated.set(currentMessageIndex, false);
                              console.log('✅ Hiding skeleton after delay');
                              return updated;
                            });
                            toolLoadingStartTime.current.delete(currentMessageIndex);
                          }, remainingTime);
                        } else {
                          // No start time recorded, hide immediately
                          setToolLoadingByMessage((prev) => {
                            const updated = new Map(prev);
                            updated.set(currentMessageIndex, false);
                            return updated;
                          });
                        }
                      }

                      return currentMessages; // Don't modify messages
                    });
                  }
                  toolArgsBuffer = '';
                  break;

                case 'card_saved':
                  // Update the most recently added cards with their content_block_id
                  if (data.content_block_id && data.result && data.tool) {
                    const { legacyCards, trainingPlanCard, drillCards } = parseToolResultCards(
                      data.result,
                      data.tool
                    );

                    // Update legacy cards
                    if (legacyCards.length > 0) {
                      setGeneratedCards((prev) => {
                        const updated = [...prev];
                        for (const sc of legacyCards) {
                          const idx = updated.findIndex(
                            (c) => c.title === sc.title && !c.content_block_id
                          );
                          if (idx >= 0) {
                            updated[idx] = {
                              ...updated[idx],
                              content_block_id: data.content_block_id,
                            };
                          }
                        }
                        return updated;
                      });
                    }

                    // Update training plan card
                    if (trainingPlanCard) {
                      setTrainingPlanCards((prev) => {
                        const updated = [...prev];
                        const idx = updated.findIndex(
                          (c) =>
                            c.training_plan_id === trainingPlanCard.training_plan_id &&
                            !c.content_block_id
                        );
                        if (idx >= 0) {
                          updated[idx] = {
                            ...updated[idx],
                            content_block_id: data.content_block_id,
                          };
                        }
                        return updated;
                      });
                    }

                    // Update drill cards
                    if (drillCards.length > 0) {
                      setDrillCards((prev) => {
                        const updated = [...prev];
                        for (const drill of drillCards) {
                          const idx = updated.findIndex(
                            (c) =>
                              c.training_plan_id === drill.training_plan_id &&
                              c.drill_number === drill.drill_number &&
                              !c.content_block_id
                          );
                          if (idx >= 0) {
                            updated[idx] = {
                              ...updated[idx],
                              content_block_id: data.content_block_id,
                            };
                          }
                        }
                        return updated;
                      });
                    }
                  }
                  break;

                case 'done':
                  // Update conversation title
                  if (data.title && convId) {
                    setConversations((prev) => {
                      const existing = prev.find(c => c.id === convId);
                      if (existing) {
                        return prev.map(c => c.id === convId ? { ...c, title: data.title } : c);
                      }
                      return [{
                        id: convId!,
                        title: data.title,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }, ...prev];
                    });
                  } else if (convId && !conversations.find(c => c.id === convId)) {
                    setConversations((prev) => [{
                      id: convId!,
                      title: null,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }, ...prev]);
                  }
                  break;
              }
            } catch {
              // Ignore parse errors
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
      currentAssistantMessageIndex.current = null;
    }
  }, [conversations, login, parseToolResultCards, navigate, urlConversationId]);

  // Send a new message (adds user message to state, then fetches response)
  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    if (!isAuthenticated) {
      login();
      return;
    }

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
    fetchResponse(trimmed, messages, urlConversationId ?? null);
  };

  // Handle initial message from navigation - user message already in state via useState initializer
  useEffect(() => {
    if (initialMessage?.trim() && !hasProcessedInitialMessage.current && isAuthenticated) {
      hasProcessedInitialMessage.current = true;
      // Clear location state so refresh doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
      // Fetch response immediately - user message is already displayed
      fetchResponse(initialMessage.trim(), [], null);
    }
  }, [initialMessage, fetchResponse, isAuthenticated, navigate, location.pathname]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Load conversation from API (used by URL effect and sidebar)
  const loadConversation = useCallback(async (id: string) => {
    if (loadedConversationRef.current === id) return;
    loadedConversationRef.current = id;
    try {
      const detail = await conversationApi.get(id);
      setMessages(detail.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));

      // Restore cards from content_blocks with checked_steps
      const restoredLegacyCards: StreamingStudioCard[] = [];
      const restoredTrainingPlans: TrainingPlanCard[] = [];
      const restoredDrills: DrillCard[] = [];

      // Track message index as we iterate
      detail.messages.forEach((msg, messageIndex) => {
        if (msg.content_blocks) {
          for (const block of msg.content_blocks) {
            if (block.type === 'tool_use' && block.content && block.tool_name) {
              const { legacyCards, trainingPlanCard, drillCards } = parseToolResultCards(
                block.content,
                block.tool_name
              );

              for (const card of legacyCards) {
                card.content_block_id = block.id;
                card.messageIndex = messageIndex;
                if (block.checked_steps) {
                  card.checked_steps = block.checked_steps;
                }
              }
              restoredLegacyCards.push(...legacyCards);

              if (trainingPlanCard) {
                restoredTrainingPlans.push({
                  ...trainingPlanCard,
                  content_block_id: block.id,
                  messageIndex,
                });
              }

              if (drillCards.length > 0) {
                const withIds = drillCards.map((drill) => ({
                  ...drill,
                  content_block_id: block.id,
                  messageIndex,
                }));
                restoredDrills.push(...withIds);
              }
            }
          }
        }
      });

      setGeneratedCards(restoredLegacyCards);
      setTrainingPlanCards(restoredTrainingPlans);
      setDrillCards(restoredDrills);
      setMobileTab('chat');
    } catch {
      // Conversation may have been deleted — redirect to empty state
      navigate('/agent', { replace: true });
    }
  }, [parseToolResultCards, navigate]);

  // Load conversation when URL param changes
  useEffect(() => {
    if (!isAuthenticated) return;
    if (urlConversationId) {
      // Don't load when we just navigated here from our own stream (new conversation);
      // local state already has the user message and streaming assistant reply.
      if (conversationIdFromStreamRef.current === urlConversationId) {
        conversationIdFromStreamRef.current = null;
        loadedConversationRef.current = urlConversationId;
        return;
      }
      loadConversation(urlConversationId);
    } else {
      // Empty state: clear everything
      loadedConversationRef.current = null;
      conversationIdFromStreamRef.current = null;
      setMessages([]);
      setGeneratedCards([]);
      setTrainingPlanCards([]);
      setDrillCards([]);
      setInput('');
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [urlConversationId, isAuthenticated, loadConversation]);

  // Conversation sidebar handlers
  const handleSelectConversation = (id: string) => {
    navigate(`/agent/${id}`);
  };

  const handleNewChat = () => {
    navigate('/agent');
    setMobileTab('chat');
    textareaRef.current?.focus();
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await conversationApi.delete(id);
      setConversations((prev) => prev.filter(c => c.id !== id));
      if (urlConversationId === id) {
        handleNewChat();
      }
    } catch {
      // Silently fail
    }
  };

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center px-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Sign in to chat
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            Log in to start a conversation with the AI coach and save your chat history.
          </p>
          <button
            onClick={() => login()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

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
                <div key={index} className="space-y-4">
                  <div className={message.role === 'user' ? 'flex justify-end' : 'text-left'}>
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

                  {/* Show cards in carousel after their respective assistant message */}
                  {message.role === 'assistant' && (
                    <>
                      {/* Tool loading indicator */}
                      {(() => {
                        const isLoading = toolLoadingByMessage.get(index);
                        console.log(`🎨 Render check for message ${index}: isLoading=${isLoading}, map=`, toolLoadingByMessage);
                        return isLoading && <CardLoadingIndicator message="Creating your training cards..." />;
                      })()}

                      {/* Training plan + drill cards carousel (only show when NOT loading) */}
                      {!toolLoadingByMessage.get(index) && trainingPlanCards.filter((card) => card.messageIndex === index).length > 0 && (
                        <div>
                          {trainingPlanCards
                            .filter((card) => card.messageIndex === index)
                            .map((card) => {
                              const relatedDrills = drillCards
                                .filter(
                                  (drill) =>
                                    drill.training_plan_id === card.training_plan_id &&
                                    drill.messageIndex === index
                                )
                                .sort((a, b) => a.drill_number - b.drill_number);

                              // Build carousel children: training card + drill cards
                              const carouselChildren = [
                                <TrainingPlanCardComponent
                                  key="training-card"
                                  card={card}
                                  drillCards={relatedDrills}
                                  onStartTraining={
                                    relatedDrills.length > 0
                                      ? () => setActiveDrillSequence(relatedDrills)
                                      : undefined
                                  }
                                />,
                                ...relatedDrills.map((drill, idx) => (
                                  <DrillCardComponent
                                    key={drill.drill_number}
                                    card={drill}
                                    onNext={
                                      idx < relatedDrills.length - 1
                                        ? () => {
                                            // Carousel will handle navigation
                                          }
                                        : undefined
                                    }
                                    onPrevious={
                                      idx > 0
                                        ? () => {
                                            // Carousel will handle navigation
                                          }
                                        : undefined
                                    }
                                    currentDrill={drill.drill_number}
                                    totalDrills={relatedDrills.length}
                                  />
                                )),
                              ];

                              return (
                                <CardCarousel key={card.training_plan_id}>
                                  {carouselChildren}
                                </CardCarousel>
                              );
                            })}
                        </div>
                      )}

                      {/* Legacy cards for this message */}
                      {generatedCards.filter((card) => card.messageIndex === index).length > 0 && (
                        <div className="space-y-4">
                          {generatedCards
                            .filter((card) => card.messageIndex === index)
                            .map((card, cardIndex) => (
                              <div
                                key={`legacy-${cardIndex}`}
                                className="p-4 bg-gray-50 rounded-lg"
                              >
                                <h3 className="font-semibold">{card.title}</h3>
                                <p className="text-sm text-gray-600">{card.description}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </>
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
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        {/* Conversation Sidebar */}
        {sidebarOpen && (
          <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
            <ConversationSidebar
              conversations={conversations}
              currentConversationId={urlConversationId ?? null}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
            />
          </div>
        )}

        {/* Chat Area - Now takes full width */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {/* Sidebar toggle */}
          <div className="flex-shrink-0 flex items-center px-2 py-1 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <FiSidebar size={16} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {renderChatContent(false)}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-1 flex-col min-h-0 overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'chat' ? (
            renderChatContent(false)
          ) : (
            <ConversationSidebar
              conversations={conversations}
              currentConversationId={urlConversationId ?? null}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
            />
          )}
        </div>

        {/* Mobile Tab Bar - Only Chat and History */}
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
            onClick={() => setMobileTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'history'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiSidebar size={18} />
            History
          </button>
        </div>
      </div>

      {/* Drill Sequence Full-Screen View */}
      {activeDrillSequence && (
        <DrillSequenceView
          drills={activeDrillSequence}
          onClose={() => setActiveDrillSequence(null)}
        />
      )}
    </div>
  );
}
