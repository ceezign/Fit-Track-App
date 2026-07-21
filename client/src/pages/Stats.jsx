import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Flame, Clock3, Dumbbell, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getWeeklyActivity, getSummary } from '../utils/stats';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-semibold text-gray-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Stats() {
  const { sessions } = useData();
  const weekly = getWeeklyActivity(sessions);
  const summary = getSummary(sessions);

  const bestDay = [...weekly].sort((a, b) => b.calories - a.calories)[0];
  const activeDays = weekly.filter((d) => d.sessions > 0).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl2 border border-border bg-surface p-5 animate-fadeIn">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">7-Day Trend</h3>
          <p className="text-xs text-gray-500">Calories burned and minutes trained, by day</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
            <Line type="monotone" dataKey="calories" name="Calories" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 4, fill: '#ec4899' }} />
            <Line type="monotone" dataKey="minutes" name="Minutes" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4, fill: '#a855f7' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl2 border border-border bg-surface p-5">
          <Dumbbell size={18} className="mb-2 text-purple-400" />
          <p className="text-xl font-extrabold text-white">{summary.totalSessions}</p>
          <p className="text-xs text-gray-500">Total sessions logged</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-5">
          <Flame size={18} className="mb-2 text-pink-400" />
          <p className="text-xl font-extrabold text-white">{summary.totalCalories.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Calories burned overall</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-5">
          <Clock3 size={18} className="mb-2 text-fuchsia-400" />
          <p className="text-xl font-extrabold text-white">{activeDays}/7</p>
          <p className="text-xs text-gray-500">Active days this week</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-5">
          <TrendingUp size={18} className="mb-2 text-rose-400" />
          <p className="text-xl font-extrabold text-white">{bestDay?.calories ? bestDay.day : '—'}</p>
          <p className="text-xs text-gray-500">Best day this week</p>
        </div>
      </div>
    </div>
  );
}
