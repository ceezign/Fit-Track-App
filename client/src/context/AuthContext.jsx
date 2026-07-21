import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fittrack_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fittrack_token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('fittrack_token', token);
    else localStorage.removeItem('fittrack_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('fittrack_user', JSON.stringify(user));
    else localStorage.removeItem('fittrack_user');
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Unable to sign in. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Unable to create your account.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, authError, login, register, logout, updateUser, setAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
