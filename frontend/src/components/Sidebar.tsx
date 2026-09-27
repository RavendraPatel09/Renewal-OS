import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, Layers, PlayCircle, MessageSquare, Settings, Shield, Plus, ChevronRight } from 'lucide-react';

interface Props {
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<Props> = ({ onOpenAddModal }) => {
  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Workspace Selector */}
      <div className="p-3 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            R
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">Enterprise CSM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Priya Sharma Workspace</span>
          </div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold rounded">Pro</span>
      </div>

      {/* Quick Action */}
      <button
        onClick={onOpenAddModal}
        className="w-full py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-subtle transition flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> + Add Interaction
      </button>

      {/* Section 1: WORKSPACE */}
      <div className="space-y-1">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          WORKSPACE
        </span>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Overview</span>
          </div>
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-slate-500" />
            <span>Accounts</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">42</span>
        </NavLink>

        <NavLink
          to="/copilot"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-brand-500" />
            <span>Copilot</span>
          </div>
        </NavLink>

        <NavLink
          to="/memory"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Memory System</span>
          </div>
        </NavLink>

        <NavLink
          to="/demo"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <PlayCircle className="w-4 h-4 text-brand-500" />
            <span>Hackathon Demo</span>
          </div>
        </NavLink>
      </div>

      {/* Section 2: TOOLS & UTILITIES */}
      <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          TOOLS & RESOURCES
        </span>

        <NavLink
          to="/feedback"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Feedback</span>
          </div>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </div>
        </NavLink>
      </div>

      {/* Footer Profile Box */}
      <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
              PS
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">Priya Sharma</span>
              <span className="text-[10px] text-slate-400 block truncate">priya@company.com</span>
            </div>
          </div>
          <NavLink to="/settings" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
