import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { LayoutDashboard, Users, Bot, Layers, PlayCircle, Search, Sun, Moon, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<Props> = ({
  darkMode,
  setDarkMode,
  onOpenAddModal,
  onOpenSearch
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PS';

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <NavLink to="/" className="hover:opacity-90 transition">
          <Logo size={26} />
        </NavLink>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                isActive ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
          </NavLink>

          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                isActive ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Users className="w-3.5 h-3.5" /> Accounts
          </NavLink>

          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                isActive ? 'bg-slate-200/60 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Bot className="w-3.5 h-3.5 text-brand-500" /> Copilot
          </NavLink>

          <NavLink
            to="/memory"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                isActive ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5" /> Memory
          </NavLink>

          <NavLink
            to="/demo"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <PlayCircle className="w-3.5 h-3.5 text-brand-500" /> Demo
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-xs text-slate-500 dark:text-slate-400 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">⌘K</kbd>
          </button>

          {/* Add Interaction Action */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-subtle transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Interaction
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle color mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Auth state */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={`Workspace settings (${user?.email || 'priya@company.com'})`}
            >
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center border border-brand-500 shadow-sm">
                {initials}
              </div>
            </button>
          ) : (
            <NavLink
              to="/signin"
              className="text-xs font-semibold px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
