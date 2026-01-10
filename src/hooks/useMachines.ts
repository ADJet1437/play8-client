import { useState, useEffect } from 'react';
import { machineApi } from '../services/api';
import { Machine, PagedResponse } from '../types';

export function useMachines(limit = 100, initialOffset = 0) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<PagedResponse<Machine> | null>(null);
  const [offset, setOffset] = useState(initialOffset);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        const data = await machineApi.list(limit, offset);
        setMachines(data.data);
        setResponse(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch machines'));
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [limit, offset]);

  const getMachine = async (id: string) => {
    try {
      setLoading(true);
      const machine = await machineApi.get(id);
      return machine;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get machine'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (response && response.data.length === limit) {
      setOffset(prev => prev + limit);
    }
  };

  const prevPage = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  return {
    machines,
    loading,
    error,
    getMachine,
    pagination: {
      total: response?.total || 0,
      limit,
      offset,
      nextPage,
      prevPage,
      hasNext: response ? response.data.length === limit : false,
      hasPrev: offset > 0,
    },
  };
}