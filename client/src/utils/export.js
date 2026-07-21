function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSessionsAsJSON(sessions) {
  const content = JSON.stringify(sessions, null, 2);
  download(`fittrack-sessions-${Date.now()}.json`, content, 'application/json');
}

export function exportSessionsAsCSV(sessions) {
  if (!sessions.length) {
    download('fittrack-sessions.csv', 'date,activity,duration,intensity,burned\n', 'text/csv');
    return;
  }

  const columns = ['date', 'activity', 'duration', 'intensity', 'burned', 'sets', 'reps', 'weight', 'distance', 'notes'];
  const escape = (val) => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
  };

  const header = columns.join(',');
  const rows = sessions.map((s) =>
    columns
      .map((col) => (col === 'date' ? new Date(s.date).toISOString().slice(0, 10) : escape(s[col])))
      .join(',')
  );

  download(`fittrack-sessions-${Date.now()}.csv`, [header, ...rows].join('\n'), 'text/csv');
}
