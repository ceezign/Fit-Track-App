import React, { useMemo, useState } from 'react';
import { Dumbbell, Trash2, Search } from 'lucide-react';
import IntensityBadge from '../components/IntensityBadge';
import { useData } from '../context/DataContext';

const FILTERS = ['All', 'Low', 'Medium', 'High'];

export default function Sessions() {
  const { sessions, loading, removeSession } = useData();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchesFilter = filter === 'All' || s.intensity === filter;
      const matchesQuery = s.activity.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [sessions, filter, query]);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await removeSession(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                filter === f
                  ? 'gradient-bg text-white shadow-glow'
                  : 'border border-border bg-surface text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl2 border border-border bg-surface">
        {loading && sessions.length === 0 ? (
          <p className="py-14 text-center text-sm text-gray-500">Loading sessions...</p>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-500">No sessions match here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((s) => (
              <div key={s._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.02]">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                    <Dumbbell size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{s.activity}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {s.notes ? ` · ${s.notes}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-6 sm:flex-none">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-200">{s.duration} min</p>
                    <p className="text-xs text-gray-500">{s.burned} kcal</p>
                  </div>
                  <IntensityBadge level={s.intensity} />
                  <button
                    onClick={() => handleDelete(s._id)}
                    disabled={deletingId === s._id}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
