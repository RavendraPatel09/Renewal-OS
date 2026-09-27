import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, Bot, Layers, PlayCircle, Settings, MessageSquare, Sun, Moon, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const CommandMenu: React.FC<Props> = ({ isOpen, onClose, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open menu via parent state if needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Customer Accounts', path: '/accounts', icon: Users },
    { label: 'Acme Corp Memory Detail', path: '/accounts/acme-corp', icon: Users },
    { label: 'Renewal Copilot', path: '/copilot', icon: Bot },
    { label: 'Memory Architecture Explainer', path: '/memory', icon: Layers },
    { label: 'Interactive Hackathon Demo', path: '/demo', icon: PlayCircle },
    { label: 'Send Product Feedback', path: '/feedback', icon: MessageSquare },
    { label: 'Workspace Settings', path: '/settings', icon: Settings }
  ];

  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search RenewalOS commands or accounts... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation & Actions
            </div>

            {filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-500" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Jump</span>
                </button>
              );
            })}

            {/* Quick Preference Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-brand-500" />}
                  <span>Switch to {darkMode ? 'Light' : 'Dark'} Mode</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Theme</span>
              </button>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Navigation Shortcut</span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">ESC</span>
              <span>to close</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
