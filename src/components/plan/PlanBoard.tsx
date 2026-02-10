import { useMemo } from 'react';
import { FiInbox, FiPlay, FiCheckCircle } from 'react-icons/fi';
import { PlanItem } from '../../types';
import { PlanCard } from './PlanCard';

interface PlanBoardProps {
  items: PlanItem[];
  onToggleStep: (itemId: string, stepIndex: number) => void;
  onDelete: (itemId: string) => void;
}

interface ColumnConfig {
  key: 'todo' | 'in_progress' | 'complete';
  label: string;
  icon: React.ReactNode;
  color: string;
  emptyText: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'todo',
    label: 'To Do',
    icon: <FiInbox size={16} />,
    color: 'text-gray-500 dark:text-gray-400',
    emptyText: 'No cards yet',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: <FiPlay size={16} />,
    color: 'text-indigo-600 dark:text-indigo-400',
    emptyText: 'No cards in progress',
  },
  {
    key: 'complete',
    label: 'Complete',
    icon: <FiCheckCircle size={16} />,
    color: 'text-green-600 dark:text-green-400',
    emptyText: 'No completed cards',
  },
];

export function PlanBoard({ items, onToggleStep, onDelete }: PlanBoardProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, PlanItem[]> = { todo: [], in_progress: [], complete: [] };
    items.forEach((item) => {
      const bucket = groups[item.status] ?? groups.todo;
      bucket.push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const colItems = grouped[col.key] ?? [];
        return (
          <div key={col.key} className="flex flex-col">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">
              <span className={col.color}>{col.icon}</span>
              <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
              {colItems.length > 0 && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                  {colItems.length}
                </span>
              )}
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1">
              {colItems.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-8">
                  {col.emptyText}
                </p>
              ) : (
                colItems.map((item) => (
                  <PlanCard
                    key={item.id}
                    item={item}
                    onToggleStep={(stepIndex) => onToggleStep(item.id, stepIndex)}
                    onDelete={() => onDelete(item.id)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
