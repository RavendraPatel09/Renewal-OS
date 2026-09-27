import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowLeft, SearchX } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-panel">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
          <SearchX className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-slate-900 dark:text-white block">404</span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">This page doesn't exist</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The memory or route you are looking for couldn't be retrieved from the workspace navigation.
          </p>
        </div>

        <NavLink
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </NavLink>
      </div>
    </div>
  );
};
