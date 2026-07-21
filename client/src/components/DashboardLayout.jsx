import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Plus, Download, ChevronDown, FileJson, FileSpreadsheet } from 'lucide-react';
import Sidebar from './Sidebar';
import AddSessionModal from './AddSessionModal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { exportSessionsAsCSV, exportSessionsAsJSON } from '../utils/export';

const TITLES = {
  '/app': { title: 'Overview', subtitle: 'Your training at a glance' },
  '/app/sessions': { title: 'Sessions', subtitle: 'Every workout you have logged' },
  '/app/goals': { title: 'Goals', subtitle: 'Targets you are chasing' },
  '/app/stats': { title: 'Stats', subtitle: 'Trends across the last week' },
};

export default function DashboardLayout() {
  const location = useLocation();
  const { sessions } = useData();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  const meta = TITLES[location.pathname] || TITLES['/app'];

  useEffect(() => {
    function onClick(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="min-h-screen bg-base">
      <Sidebar />

      <div className="md:pl-20 pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-base/80 px-6 py-5 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-extrabold gradient-text">{meta.title}</h1>
            <p className="text-sm text-gray-500">{meta.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-400">
              Welcome back, <span className="font-semibold text-gray-200">{user?.name?.split(' ')[0]}</span>
            </span>

            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:text-white"
              >
                <Download size={16} />
                Export
                <ChevronDown size={14} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-card animate-fadeIn">
                  <button
                    onClick={() => {
                      exportSessionsAsJSON(sessions);
                      setExportOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5"
                  >
                    <FileJson size={15} /> Export as JSON
                  </button>
                  <button
                    onClick={() => {
                      exportSessionsAsCSV(sessions);
                      setExportOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5"
                  >
                    <FileSpreadsheet size={15} /> Export as CSV
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Session
            </button>
          </div>
        </header>

        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>

      <AddSessionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
