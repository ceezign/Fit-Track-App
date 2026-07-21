import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Target, LineChart, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/app', end: true, icon: Home, label: 'Home' },
  { to: '/app/sessions', icon: Dumbbell, label: 'Sessions' },
  { to: '/app/goals', icon: Target, label: 'Goals' },
  { to: '/app/stats', icon: LineChart, label: 'Stats' },
];

function NavIcon({ to, end, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-glow'
            : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
        }`
      }
    >
      <Icon size={20} strokeWidth={2.1} />
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-gray-200 opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100 z-50">
        {label}
      </span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center border-r border-border bg-surface/60 backdrop-blur-xl py-6 z-40">
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-glow">
          <Flame size={20} className="text-white" strokeWidth={2.4} />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-3">
          {NAV_ITEMS.map((item) => (
            <NavIcon key={item.to} {...item} />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-base text-xs font-bold text-gray-300"
            title={user?.name}
          >
            {initials}
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={19} strokeWidth={2.1} />
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 backdrop-blur-xl px-2 py-2">
        {NAV_ITEMS.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium ${
                isActive ? 'text-pink-400' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} strokeWidth={2.1} />
            {label}
          </NavLink>
        ))}
        <button onClick={logout} className="flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium text-gray-500">
          <LogOut size={20} strokeWidth={2.1} />
          Exit
        </button>
      </nav>
    </>
  );
}
