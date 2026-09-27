import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-3">
          <Logo size={24} />
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            Remember Every Customer. Learn From Every Renewal.  
            Persistent AI memory workspace for Customer Success teams.
          </p>
          <span className="text-[11px] text-slate-400 block pt-2">
            © {new Date().getFullYear()} RenewalOS. All rights reserved.
          </span>
        </div>

        {/* Column 2: Product */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-3">
            Product
          </span>
          <ul className="space-y-2">
            <li><NavLink to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">Overview Dashboard</NavLink></li>
            <li><NavLink to="/accounts" className="hover:text-slate-900 dark:hover:text-white transition">Customer Accounts</NavLink></li>
            <li><NavLink to="/copilot" className="hover:text-slate-900 dark:hover:text-white transition">Renewal Copilot</NavLink></li>
            <li><NavLink to="/memory" className="hover:text-slate-900 dark:hover:text-white transition">Memory System</NavLink></li>
            <li><NavLink to="/demo" className="hover:text-slate-900 dark:hover:text-white transition">Interactive Demo</NavLink></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-3">
            Workspace
          </span>
          <ul className="space-y-2">
            <li><NavLink to="/feedback" className="hover:text-slate-900 dark:hover:text-white transition">Send Feedback</NavLink></li>
            <li><NavLink to="/settings" className="hover:text-slate-900 dark:hover:text-white transition">Settings</NavLink></li>
            <li><NavLink to="/signin" className="hover:text-slate-900 dark:hover:text-white transition">Sign In</NavLink></li>
            <li><NavLink to="/signup" className="hover:text-slate-900 dark:hover:text-white transition">Create Workspace</NavLink></li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-3">
            Legal & Trust
          </span>
          <ul className="space-y-2">
            <li><NavLink to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="hover:text-slate-900 dark:hover:text-white transition">Terms & Conditions</NavLink></li>
            <li><span className="text-slate-400">Private Enterprise Workspace</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
