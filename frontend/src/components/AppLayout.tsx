import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { LayoutDashboard, Users, Compass, Layers, PlayCircle } from 'lucide-react';
import { useUI } from '../context/UIContext';

interface Props {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
}

export const AppLayout: React.FC<Props> = ({
  children,
  darkMode,
  setDarkMode,
  onOpenAddModal,
  onOpenSearch
}) => {
  const { focusMode, setFocusMode } = useUI();

  // Handle global Esc to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, setFocusMode]);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Desktop Sidebar */}
      <Sidebar onOpenAddModal={onOpenAddModal} />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenAddModal={onOpenAddModal}
          onOpenSearch={onOpenSearch}
        />

        {/* Content Container */}
        <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-12 transition-all duration-200 ${
          focusMode ? 'max-w-7xl' : 'max-w-6xl'
        }`}>
          {children}
        </main>

        {/* Mobile Bottom Tab Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-14 px-2 select-none">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-3 rounded-lg ${
                isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-3 rounded-lg ${
                isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <Users className="w-4 h-4" />
            <span>Accounts</span>
          </NavLink>

          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-3 rounded-lg ${
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <Compass className="w-4 h-4" />
            <span>Copilot</span>
          </NavLink>

          <NavLink
            to="/memory"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-3 rounded-lg ${
                isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <Layers className="w-4 h-4" />
            <span>Memory</span>
          </NavLink>

          <NavLink
            to="/demo"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-3 rounded-lg ${
                isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <PlayCircle className="w-4 h-4" />
            <span>Demo</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
