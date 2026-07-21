import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Dumbbell, Flame, Clock3, TrendingUp, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import IntensityBadge from '../components/IntensityBadge';
import { useData } from '../context/DataContext';
import { getWeeklyActivity, getSummary, getRadarData } from '../utils/stats';

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

export default function Home() {
  const { sessions, loading } = useData();
  const summary = getSummary(sessions);
  const weekly = getWeeklyActivity(sessions);
  const radar = getRadarData(sessions);
  const recent = sessions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Dumbbell} label="Total Sessions" value={summary.totalSessions} accent="from-purple-500 to-fuchsia-500" />
        <StatCard icon={Flame} label="Calories Burned" value={summary.totalCalories.toLocaleString()} suffix="kcal" accent="from-orange-500 to-pink-500" />
        <StatCard icon={Clock3} label="Training Time" value={Math.round(summary.totalMinutes / 60)} suffix="hrs" accent="from-pink-500 to-rose-500" />
        <StatCard icon={TrendingUp} label="Avg / Session" value={summary.avgPerSession} suffix="min" accent="from-fuchsia-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="rounded-xl2 border border-border bg-surface p-5 xl:col-span-3 animate-fadeIn">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Activity</h3>
              <p className="text-xs text-gray-500">Minutes trained per day, last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly} barCategoryGap="30%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(168,85,247,0.06)' }} />
              <Bar dataKey="minutes" name="Minutes" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl2 border border-border bg-surface p-5 xl:col-span-2 animate-fadeIn">
          <h3 className="text-base font-bold text-white">Performance</h3>
          <p className="mb-2 text-xs text-gray-500">Last 28 days, across six dimensions</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radar} outerRadius="72%">
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="metric" stroke="#9ca3af" fontSize={11} />
              <Radar dataKey="value" stroke="#ec4899" fill="#a855f7" fillOpacity={0.35} strokeWidth={2} />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl2 border border-border bg-surface p-5 animate-fadeIn">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Sessions</h3>
          <Link to="/app/sessions" className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading && recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Loading your sessions...</p>
        ) : recent.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500">No sessions logged yet.</p>
            <p className="mt-1 text-xs text-gray-600">Tap "Add Session" up top to log your first workout.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((s) => (
              <div key={s._id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <Dumbbell size={17} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{s.activity}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {s.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-sm font-semibold text-gray-300">{s.burned} kcal</span>
                  <IntensityBadge level={s.intensity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
