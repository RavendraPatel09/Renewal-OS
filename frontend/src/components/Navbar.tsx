import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Search, Sun, Moon, Plus, Compass, LayoutDashboard, Users, Layers, PlayCircle, Maximize2, Minimize2, ListFilter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<Props> = ({
  darkMode,
  setDarkMode,
  onOpenAddModal,
  onOpenSearch
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { focusMode, toggleFocusMode, density, toggleDensity, activeAccountContext } = useUI();

  // Page title resolution
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Overview';
    if (path.startsWith('/accounts/')) return 'Account Detail';
    if (path.startsWith('/accounts')) return 'Accounts';
    if (path.startsWith('/copilot')) return 'Copilot Intelligence';
    if (path.startsWith('/memory')) return 'Memory Bank';
    if (path.startsWith('/demo')) return 'Hackathon Demo';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/feedback')) return 'Feedback';
    return 'RenewalOS';
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PS';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-12 flex items-center px-4 justify-between select-none">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <NavLink to="/dashboard" className="md:hidden flex items-center gap-1.5 hover:opacity-90">
          <Logo size={20} />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">RenewalOS</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{getPageTitle()}</span>
          {focusMode && (
            <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              FOCUS (Esc)
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Global Search ⌘K */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-xs text-slate-500 dark:text-slate-400 transition"
          title="Search or Jump (⌘K or /)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline text-[11px]">Search...</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={toggleFocusMode}
          className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition ${
            focusMode
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={focusMode ? 'Exit Focus Mode (Esc)' : 'Enter Focus Mode'}
        >
          {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="text-[11px] hidden lg:inline">{focusMode ? 'Focus' : 'Focus'}</span>
        </button>

        {/* Data Density Toggle */}
        <button
          onClick={toggleDensity}
          className="hidden md:flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
          title={`Switch to ${density === 'comfortable' ? 'compact' : 'comfortable'} view`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono capitalize">{density}</span>
        </button>

        {/* Quick Add Action (Mobile & Tablet) */}
        <button
          onClick={onOpenAddModal}
          className="md:hidden flex items-center gap-1 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline text-[11px]">Add</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Toggle color theme"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* User / Settings Profile */}
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/settings')}
            className="md:hidden flex items-center p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
              {initials}
            </div>
          </button>
        ) : (
          <NavLink
            to="/signin"
            className="text-xs font-semibold px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};
