import React, { useState } from 'react';
import { Plus, Trash2, CalendarClock, Minus, PlusCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { daysUntil } from '../utils/stats';
import AddGoalModal from '../components/AddGoalModal';

function ProgressBar({ pct }) {
  const color = pct >= 100 ? 'from-emerald-500 to-teal-400' : 'from-purple-500 to-pink-500';
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-base">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  );
}

export default function Goals() {
  const { goals, loading, updateGoal, removeGoal } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  async function bump(goal, delta) {
    const next = Math.max(0, goal.current + delta);
    await updateGoal(goal._id, { current: next });
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-purple-500/50 hover:text-white"
        >
          <Plus size={16} />
          New goal
        </button>
      </div>

      {loading && goals.length === 0 ? (
        <p className="py-14 text-center text-sm text-gray-500">Loading goals...</p>
      ) : goals.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-border py-16 text-center">
          <p className="text-sm text-gray-500">You haven't set any goals yet.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 text-sm font-semibold text-purple-400 hover:text-purple-300"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => {
            const pct = g.goal > 0 ? Math.round((g.current / g.goal) * 100) : 0;
            const remaining = daysUntil(g.deadline);
            const isOverdue = remaining < 0 && pct < 100;
            const isDone = pct >= 100;

            return (
              <div key={g._id} className="card-hover rounded-xl2 border border-border bg-surface p-5 animate-fadeIn">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-100">{g.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {g.current} / {g.goal} {g.metric}
                    </p>
                  </div>
                  <button
                    onClick={() => removeGoal(g._id)}
                    className="rounded-lg p-1.5 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <ProgressBar pct={pct} />

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isDone ? 'text-emerald-400' : isOverdue ? 'text-rose-400' : 'text-gray-400'
                    }`}
                  >
                    {pct}% complete
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarClock size={13} />
                    {isDone
                      ? 'Achieved'
                      : isOverdue
                      ? `${Math.abs(remaining)}d overdue`
                      : `${remaining}d left`}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => bump(g, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-gray-400 hover:text-white"
                  >
                    <Minus size={13} />
                  </button>
                  <button
                    onClick={() => bump(g, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-gray-400 hover:text-white"
                  >
                    <PlusCircle size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
