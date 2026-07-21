import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [sessionsRes, goalsRes] = await Promise.all([api.get('/sessions'), api.get('/goals')]);
      setSessions(sessionsRes.data.sessions || []);
      setGoals(goalsRes.data.goals || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAll();
    else {
      setSessions([]);
      setGoals([]);
    }
  }, [token, fetchAll]);

  const addSession = useCallback(async (payload) => {
    const { data } = await api.post('/sessions', payload);
    setSessions((prev) => [data.session, ...prev]);
    return data.session;
  }, []);

  const removeSession = useCallback(async (id) => {
    await api.delete(`/sessions/${id}`);
    setSessions((prev) => prev.filter((s) => s._id !== id));
  }, []);

  const addGoal = useCallback(async (payload) => {
    const { data } = await api.post('/goals', payload);
    setGoals((prev) => [...prev, data.goal]);
    return data.goal;
  }, []);

  const updateGoal = useCallback(async (id, payload) => {
    const { data } = await api.put(`/goals/${id}`, payload);
    setGoals((prev) => prev.map((g) => (g._id === id ? data.goal : g)));
    return data.goal;
  }, []);

  const removeGoal = useCallback(async (id) => {
    await api.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g._id !== id));
  }, []);

  return (
    <DataContext.Provider
      value={{
        sessions,
        goals,
        loading,
        error,
        refresh: fetchAll,
        addSession,
        removeSession,
        addGoal,
        updateGoal,
        removeGoal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
