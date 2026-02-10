import { useState } from 'react';
import { FiPlus, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { Conversation } from '../types';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeleteConversation(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* New Chat Button */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <FiPlus size={16} />
          New chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="py-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm group transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiMessageSquare size={14} className="flex-shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    {conv.title || 'New conversation'}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatDate(conv.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className={`flex-shrink-0 p-1 rounded transition-colors ${
                    deletingId === conv.id
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
                  }`}
                  title={deletingId === conv.id ? 'Click again to confirm' : 'Delete conversation'}
                >
                  <FiTrash2 size={14} />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
