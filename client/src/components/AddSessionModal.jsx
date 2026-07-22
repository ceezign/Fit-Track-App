import React, { useState } from 'react';
import { X, Calendar, Flame, Timer, Activity, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import ActivityCombobox from './ActivityCombobox';

const ACTIVITIES = [
  'Strength Training',
  'Running',
  'Cycling',
  'Swimming',
  'HIIT',
  'Yoga',
  'CrossFit',
  'Rowing',
  'Boxing',
  'Basketball',
  'Hiking',
  'Pilates',
];

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
  date: today(),
  activity: ACTIVITIES[0],
  duration: '',
  intensity: 'Medium',
  burned: '',
  sets: '',
  reps: '',
  weight: '',
  distance: '',
  notes: '',
};

export default function AddSessionModal({ open, onClose }) {
  const { addSession } = useData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(false);

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setForm(EMPTY_FORM);
    setShowMore(false);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.duration || !form.burned) {
      setError('Duration and calories burned are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: form.date,
        activity: form.activity,
        duration: Number(form.duration),
        intensity: form.intensity,
        burned: Number(form.burned),
      };
      if (form.sets) payload.sets = Number(form.sets);
      if (form.reps) payload.reps = Number(form.reps);
      if (form.weight) payload.weight = Number(form.weight);
      if (form.distance) payload.distance = Number(form.distance);
      if (form.notes) payload.notes = form.notes;

      await addSession(payload);
      reset();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this session');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl2 border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-white">Log a session</h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Date</label>
              <div className="relative">
                <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  value={form.date}
                  max={today()}
                  onChange={(e) => update('date', e.target.value)}
                  className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Activity</label>
              <ActivityCombobox
                value={form.activity}
                onChange={(val) => update('activity', val)}
                options={ACTIVITIES}
                icon={Activity}
                placeholder="Select or type an activity"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Duration (min)</label>
              <div className="relative">
                <Timer size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  min="1"
                  placeholder="45"
                  value={form.duration}
                  onChange={(e) => update('duration', e.target.value)}
                  className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Calories burned</label>
              <div className="relative">
                <Flame size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  min="0"
                  placeholder="320"
                  value={form.burned}
                  onChange={(e) => update('burned', e.target.value)}
                  className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => update('intensity', level)}
                    className={`rounded-lg border py-2 text-sm font-semibold transition ${
                      form.intensity === level
                        ? 'border-transparent gradient-bg text-white shadow-glow'
                        : 'border-border bg-base text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                {showMore ? 'Hide optional details' : '+ Add sets, weight, distance or notes'}
              </button>
            </div>

            {showMore && (
              <>
                <div className="col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400">Sets</label>
                  <input
                    type="number"
                    min="0"
                    value={form.sets}
                    onChange={(e) => update('sets', e.target.value)}
                    className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400">Reps</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reps}
                    onChange={(e) => update('reps', e.target.value)}
                    className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400">Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                    className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400">Distance (km)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.distance}
                    onChange={(e) => update('distance', e.target.value)}
                    className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400">Notes</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="How did it feel?"
                    className="w-full resize-none rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={17} className="animate-spin" /> : null}
            {submitting ? 'Saving...' : 'Save session'}
          </button>
        </form>
      </div>
    </div>
  );
}
