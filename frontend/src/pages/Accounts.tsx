import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount } from '../types';
import { Search, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Accounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filtered = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(search.toLowerCase()) ||
      (acc.industry && acc.industry.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'attention') return matchesSearch && (acc.risk_level === 'high' || acc.unresolved_promises_count > 0);
    if (filter === 'healthy') return matchesSearch && acc.risk_level === 'low';
    if (filter === 'renewed') return matchesSearch && acc.status === 'renewed';
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-5 max-w-5xl"
    >
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Portfolio directory with persistent memory history, commitments, and renewal timelines.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 w-48 transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
            {[
              { id: 'all', label: 'All' },
              { id: 'attention', label: 'Attention' },
              { id: 'healthy', label: 'Healthy' },
              { id: 'renewed', label: 'Renewed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  filter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Portfolio Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-3d-interactive p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Total Accounts</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{accounts.length}</div>
        </div>
        <div className="card-3d-interactive p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Need Attention</span>
          <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {accounts.filter(a => a.risk_level === 'high' || a.unresolved_promises_count > 0).length}
          </div>
        </div>
        <div className="card-3d-interactive p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Healthy Standing</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {accounts.filter(a => a.risk_level === 'low').length}
          </div>
        </div>
        <div className="card-3d-interactive p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Renewal &lt; 45d</span>
          <div className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-0.5">
            {accounts.filter(a => a.renewal_days <= 45).length}
          </div>
        </div>
      </div>

      {/* Clean Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-850/50">
              <th className="px-4 py-2.5">Account</th>
              <th className="px-4 py-2.5">Renewal</th>
              <th className="px-4 py-2.5">Commitments</th>
              <th className="px-4 py-2.5">Sentiment</th>
              <th className="px-4 py-2.5 text-right">CSM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Loading accounts...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((acc) => (
                <tr
                  key={acc.id}
                  onClick={() => navigate(`/accounts/${acc.id}`)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">
                        {acc.plan || acc.tier}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className={acc.renewal_days <= 30 ? 'font-medium text-slate-900 dark:text-white' : ''}>
                      {acc.renewal_days} days
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {acc.unresolved_promises_count > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {acc.unresolved_promises_count} unresolved
                      </span>
                    ) : (
                      <span className="text-slate-400">0 open</span>
                    )}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    <span className={`text-[11px] font-medium ${
                      acc.recent_sentiment === 'negative' || acc.recent_sentiment === 'declining'
                        ? 'text-rose-500'
                        : acc.recent_sentiment === 'positive'
                        ? 'text-emerald-500'
                        : 'text-slate-500'
                    }`}>
                      {acc.recent_sentiment}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{acc.csm_name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No accounts found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
