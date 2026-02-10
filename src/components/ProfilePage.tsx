import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { PlanBoard } from './plan/PlanBoard';
import { planApi } from '../services/api';
import { PlanItem } from '../types';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    try {
      const data = await planApi.list();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlan();
    }
  }, [isAuthenticated, fetchPlan]);

  const handleToggleStep = async (itemId: string, stepIndex: number) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newChecked = [...item.checked_steps];
        newChecked[stepIndex] = !newChecked[stepIndex];
        const allChecked = newChecked.length > 0 && newChecked.every(Boolean);
        const anyChecked = newChecked.some(Boolean);
        const status = allChecked ? 'complete' : anyChecked ? 'in_progress' : 'todo';
        return { ...item, checked_steps: newChecked, status } as PlanItem;
      })
    );

    // Persist
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newChecked = [...item.checked_steps];
      newChecked[stepIndex] = !newChecked[stepIndex];
      try {
        await planApi.updateProgress(itemId, newChecked);
      } catch (error) {
        console.error('Failed to update progress:', error);
        fetchPlan(); // Revert on error
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await planApi.remove(itemId);
    } catch (error) {
      console.error('Failed to delete plan item:', error);
      fetchPlan(); // Revert on error
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      {/* User info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
          {getInitials(user.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Training Plan */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          My Training Plan
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-24" />
                <div className="h-24 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/40">
            <p className="text-gray-500 dark:text-gray-400 mb-1">No cards in your plan yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Open a training card and click "Add to plan" to get started.
            </p>
          </div>
        ) : (
          <PlanBoard
            items={items}
            onToggleStep={handleToggleStep}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
