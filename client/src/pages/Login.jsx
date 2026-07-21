import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Flame, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, loading, authError, setAuthError, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/app', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    setAuthError('');
  }, [mode, setAuthError]);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok =
      mode === 'login' ? await login(email, password) : await register(name, email, password);
    if (ok) navigate('/app', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg shadow-glow">
            <Flame size={26} className="text-white" strokeWidth={2.4} />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text">FitTrack</h1>
          <p className="mt-1.5 text-sm text-gray-500">Train with intent. Track with precision.</p>
        </div>

        <div className="rounded-xl2 border border-border bg-surface p-2 shadow-card">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-base p-1">
            <button
              onClick={() => setMode('login')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === 'login' ? 'gradient-bg text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('register')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === 'register' ? 'gradient-bg text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-4 pb-5 pt-5">
            {authError && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-400">
                {authError}
              </div>
            )}

            {mode === 'register' && (
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-gray-400">Full name</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-10 text-sm text-gray-200 outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="mt-1.5 text-xs text-gray-600">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : null}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          {mode === 'login' ? "Don't have an account? " : 'Already training with us? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-semibold text-purple-400 hover:text-purple-300"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
