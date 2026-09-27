import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Users, Calendar, AlertTriangle, Database, ArrowUpRight, TrendingDown, ArrowRight, Search, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
}

export const Dashboard: React.FC<Props> = ({ onOpenAddModal, onOpenSearch }) => {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemoData, setShowDemoData] = useState(true);

  useEffect(() => {
    if (showDemoData) {
      api.getAccounts().then((data) => {
        setAccounts(data);
        setLoading(false);
      }).catch(console.error);
    } else {
      setAccounts([]);
      setLoading(false);
    }
  }, [showDemoData]);

  const atRiskAccounts = accounts.filter(a => a.risk_level === 'high');

  return (
    <div className="flex gap-6 pb-12">
      {/* App Shell Sidebar */}
      <Sidebar onOpenAddModal={onOpenAddModal} />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Workspace Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Workspace</span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Good morning, Priya
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customer Success Portfolio • 42 accounts assigned
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle Demo Data vs Empty State */}
            <button
              onClick={() => setShowDemoData(!showDemoData)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-200 dark:border-slate-700"
            >
              {showDemoData ? 'View Clean Empty State' : 'Load Portfolio Demo Data'}
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs transition"
              title="Search workspace (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-subtle transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> + Add interaction
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        {showDemoData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active Accounts</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-white">42</span>
                <Users className="w-5 h-5 text-brand-500" />
              </div>
              <span className="text-[11px] text-slate-400">Assigned CSM: Priya Sharma</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Renewals This Month</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-white">8</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[11px] text-amber-500 font-medium">3 requiring immediate attention</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Accounts At Risk</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400">3</span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-[11px] text-rose-500 font-medium">Acme Corp high attention</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Memories Stored</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-brand-600 dark:text-brand-400">1,284</span>
                <Database className="w-5 h-5 text-brand-500" />
              </div>
              <span className="text-[11px] text-emerald-500 font-medium">+18 retained this week</span>
            </div>
          </div>
        ) : (
          /* Intentional Polished Empty State */
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your customer memory starts here.</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add your first interaction and RenewalOS will begin building persistent memory context around your accounts.
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-subtle transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add first interaction
            </button>
          </div>
        )}

        {/* High Attention Accounts Grid */}
        {showDemoData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" /> High Attention Renewals
              </h2>
              <NavLink to="/accounts" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                View All Accounts →
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {atRiskAccounts.map((acc) => (
                <motion.div
                  key={acc.id}
                  whileHover={{ y: -2 }}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{acc.name}</span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Risk {acc.risk_score}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-2">
                      <span>Renewal in <strong className="text-slate-800 dark:text-slate-200">{acc.renewal_days} days</strong></span>
                      <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" /> {acc.recent_sentiment}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Open Issues:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{acc.open_issues_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Unresolved Promises:</span>
                        <span className="font-semibold text-rose-500">{acc.unresolved_promises_count}</span>
                      </div>
                    </div>
                  </div>

                  <NavLink
                    to={`/accounts/${acc.id}`}
                    className="w-full mt-4 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                  >
                    Inspect Account Memory & Intelligence <ArrowUpRight className="w-3.5 h-3.5" />
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
