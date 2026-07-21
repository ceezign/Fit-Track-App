import React from 'react';

export default function StatCard({ icon: Icon, label, value, suffix, accent = 'from-purple-500 to-pink-500' }) {
  return (
    <div className="card-hover rounded-xl2 border border-border bg-surface p-5 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {value}
            {suffix ? <span className="ml-1 text-sm font-semibold text-gray-500">{suffix}</span> : null}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-glow`}>
          <Icon size={20} className="text-white" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}
