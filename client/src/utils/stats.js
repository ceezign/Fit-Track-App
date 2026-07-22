const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function lastNDays(n) {
  const days = [];
  const today = startOfDay(new Date());
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export function getWeeklyActivity(sessions) {
  const days = lastNDays(7);
  return days.map((day) => {
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const daySessions = sessions.filter((s) => {
      const t = new Date(s.date).getTime();
      return t >= day.getTime() && t < dayEnd.getTime();
    });
    return {
      day: DAY_LABELS[day.getDay()],
      date: day.toISOString().slice(0, 10),
      minutes: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      calories: daySessions.reduce((sum, s) => sum + (s.burned || 0), 0),
      sessions: daySessions.length,
    };
  });
}

export function getSummary(sessions) {
  const totalSessions = sessions.length;
  const totalCalories = sessions.reduce((sum, s) => sum + (s.burned || 0), 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgPerSession = totalSessions ? Math.round(totalMinutes / totalSessions) : 0;

  return { totalSessions, totalCalories, totalMinutes, avgPerSession };
}

// Heuristic "performance" radar built from real logged data.
export function getRadarData(sessions) {
  const recent = sessions.filter((s) => {
    const d = new Date(s.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 28);
    return d >= cutoff;
  });

  const days = new Set(recent.map((s) => new Date(s.date).toISOString().slice(0, 10)));
  const consistency = Math.min(100, Math.round((days.size / 28) * 100 * 1.5));

  const intensityScore = { Low: 33, Medium: 66, High: 100 };
  const avgIntensity = recent.length
    ? Math.round(recent.reduce((sum, s) => sum + (intensityScore[s.intensity] || 50), 0) / recent.length)
    : 0;

  const totalMinutes = recent.reduce((sum, s) => sum + (s.duration || 0), 0);
  const volume = Math.min(100, Math.round((totalMinutes / (28 * 30)) * 100));

  const matchesAny = (activity, keywords) => {
    const lower = (activity || '').toLowerCase();
    return keywords.some((k) => lower.includes(k));
  };

  const CARDIO_KEYWORDS = ['run', 'cycl', 'bike', 'swim', 'row', 'hiit', 'hik', 'cardio', 'sprint'];
  const STRENGTH_KEYWORDS = ['strength', 'weight', 'lift', 'crossfit', 'boxing', 'gym'];
  const RECOVERY_KEYWORDS = ['yoga', 'pilates', 'stretch', 'mobility', 'recovery'];

  const cardioMinutes = recent
    .filter((s) => matchesAny(s.activity, CARDIO_KEYWORDS))
    .reduce((sum, s) => sum + (s.duration || 0), 0);
  const endurance = Math.min(100, Math.round((cardioMinutes / (28 * 20)) * 100));

  const strengthSessions = recent.filter((s) => matchesAny(s.activity, STRENGTH_KEYWORDS)).length;
  const strength = Math.min(100, Math.round((strengthSessions / 12) * 100));

  const recoverySessions = recent.filter(
    (s) => matchesAny(s.activity, RECOVERY_KEYWORDS) || s.intensity === 'Low'
  ).length;
  const recovery = Math.min(100, Math.round((recoverySessions / 8) * 100));

  return [
    { metric: 'Volume', value: volume || 8 },
    { metric: 'Intensity', value: avgIntensity || 8 },
    { metric: 'Consistency', value: consistency || 8 },
    { metric: 'Endurance', value: endurance || 8 },
    { metric: 'Strength', value: strength || 8 },
    { metric: 'Recovery', value: recovery || 8 },
  ];
}

export function daysUntil(dateStr) {
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(dateStr));
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
