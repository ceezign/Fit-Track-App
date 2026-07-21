import React from 'react';

const STYLES = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default function IntensityBadge({ level }) {
  const style = STYLES[level] || STYLES.Medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}
