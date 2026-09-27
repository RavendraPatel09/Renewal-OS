import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings, PlayCircle, Layers, Compass, Plus, LogOut, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Logo } from './Logo';

interface Props {
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<Props> = ({ onOpenAddModal }) => {
  const { user } = useAuth();
  const { focusMode, toggleFocusMode, systemStatus } = useUI();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PS';

  if (focusMode) {
    return (
      <aside className="w-14 shrink-0 hidden md:flex flex-col items-center justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 h-screen sticky top-0 py-3 select-none transition-all duration-200">
        <div className="flex flex-col items-center gap-4">
          <NavLink to="/dashboard" title="RenewalOS Dashboard">
            <Logo size={20} showText={false} />
          </NavLink>
          <button
            onClick={onOpenAddModal}
            className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:scale-105 transition"
            title="Add Interaction"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={toggleFocusMode}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Exit Focus Mode (Esc)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <span
            className={`w-2 h-2 rounded-full ${systemStatus.apiConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}
            title={systemStatus.apiConnected ? 'Memory Bank Connected' : 'Memory Bank Offline'}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 h-screen sticky top-0 p-3 select-none transition-all duration-200">
      {/* Brand & Workspace */}
      <div className="px-2.5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-3">
        <NavLink to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition">
          <Logo size={22} />
          <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">RenewalOS</span>
        </NavLink>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${systemStatus.apiConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}
            title={systemStatus.apiConnected ? 'Hindsight Bank Active' : 'Memory Bank Offline'}
          />
        </div>
      </div>

      {/* Quick Add Action */}
      <div className="px-1 mb-3">
        <button
          onClick={onOpenAddModal}
          className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Interaction</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-0.5 text-xs font-medium">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors group ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            <span>Accounts</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">8</span>
        </NavLink>

        <NavLink
          to="/copilot"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <Compass className="w-4 h-4 text-brand-500 transition-colors" />
          <span>Copilot</span>
        </NavLink>

        <NavLink
          to="/memory"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <Layers className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span>Memory</span>
        </NavLink>

        <NavLink
          to="/demo"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span>Demo</span>
        </NavLink>

        {/* Utilities Section */}
        <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800/60 mt-3">
          <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Preferences
          </span>

          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            <span>Feedback</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* User Session Box */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <NavLink
          to="/settings"
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="truncate flex-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {user?.name || 'Priya Sharma'}
            </span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
