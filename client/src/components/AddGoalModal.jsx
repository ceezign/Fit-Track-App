import React, { useState } from 'react';
import { X, Target, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

const METRICS = ['sessions', 'km', 'kg', 'min', 'kcal'];

const EMPTY = { name: '', goal: '', current: '', metric: METRICS[0], deadline: '' };

export default function AddGoalModal({ open, onClose }) {
  const { addGoal } = useData();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.goal || !form.deadline) {
      setError('Name, target and deadline are required');
      return;
    }

    setSubmitting(true);
    try {
      await addGoal({
        name: form.name,
        goal: Number(form.goal),
        current: form.current ? Number(form.current) : 0,
        metric: form.metric,
        deadline: form.deadline,
      });
      setForm(EMPTY);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create this goal');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-xl2 border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-white">New goal</h2>
          <button
            onClick={() => {
              setForm(EMPTY);
              onClose();
            }}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-gray-400">Goal name</label>
            <div className="relative">
              <Target size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Run 50km this month"
                className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Target</label>
              <input
                type="number"
                min="0"
                value={form.goal}
                onChange={(e) => update('goal', e.target.value)}
                placeholder="50"
                className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Metric</label>
              <select
                value={form.metric}
                onChange={(e) => update('metric', e.target.value)}
                className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
              >
                {METRICS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Current (optional)</label>
              <input
                type="number"
                min="0"
                value={form.current}
                onChange={(e) => update('current', e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => update('deadline', e.target.value)}
                className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={17} className="animate-spin" /> : null}
            {submitting ? 'Saving...' : 'Create goal'}
          </button>
        </form>
      </div>
    </div>
  );
}
