import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ActivityCombobox({ value, onChange, options, icon: Icon, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const query = value.toLowerCase();
  const filtered = options.filter((o) => o.toLowerCase().includes(query));

  function selectOption(option) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      {Icon && (
        <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        maxLength={40}
        className="w-full rounded-lg border border-border bg-base py-2.5 pl-9 pr-8 text-sm text-gray-200 outline-none focus:border-purple-500"
        required
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        tabIndex={-1}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-card animate-fadeIn">
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => selectOption(option)}
                className={`block w-full px-3.5 py-2.5 text-left text-sm transition hover:bg-white/5 ${
                  option.toLowerCase() === query ? 'text-purple-400' : 'text-gray-300'
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-3.5 py-2.5 text-sm text-gray-500">
              No match — "{value}" will be saved as a custom activity
            </p>
          )}
        </div>
      )}
    </div>
  );
}
