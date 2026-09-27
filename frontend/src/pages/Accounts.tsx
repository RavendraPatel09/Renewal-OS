import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount } from '../types';
import { Search, Filter, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAccounts().then(setAccounts).catch(console.error);
  }, []);

  const filtered = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'risk') return matchesSearch && acc.risk_level === 'high';
    if (filter === 'renewed') return matchesSearch && acc.status === 'renewed';
    if (filter === 'churned') return matchesSearch && acc.status === 'churned';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Accounts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Persistent memory intelligence across 42 portfolio accounts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition ${filter === 'all' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('risk')}
              className={`px-3 py-1 rounded-md transition ${filter === 'risk' ? 'bg-white dark:bg-slate-900 text-rose-600 font-bold shadow-sm' : ''}`}
            >
              High Risk
            </button>
            <button
              onClick={() => setFilter('renewed')}
              className={`px-3 py-1 rounded-md transition ${filter === 'renewed' ? 'bg-white dark:bg-slate-900 text-emerald-600 font-bold shadow-sm' : ''}`}
            >
              Renewed
            </button>
            <button
              onClick={() => setFilter('churned')}
              className={`px-3 py-1 rounded-md transition ${filter === 'churned' ? 'bg-white dark:bg-slate-900 text-slate-400 font-bold shadow-sm' : ''}`}
            >
              Churned
            </button>
          </div>
        </div>
      </div>

      {/* Account Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-6 py-3">Account Name</th>
              <th className="px-6 py-3">Tier</th>
              <th className="px-6 py-3">Renewal</th>
              <th className="px-6 py-3">Risk Score</th>
              <th className="px-6 py-3">Open Issues</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filtered.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                  {acc.name}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {acc.tier}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {acc.renewal_days} days
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    acc.risk_score > 70
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : acc.risk_score > 40
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {acc.risk_score} / 100
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {acc.open_issues_count} open ({acc.unresolved_promises_count} promises)
                </td>
                <td className="px-6 py-4 capitalize font-medium text-slate-600 dark:text-slate-300">
                  {acc.status}
                </td>
                <td className="px-6 py-4 text-right">
                  <NavLink
                    to={`/accounts/${acc.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Memory <ArrowUpRight className="w-3.5 h-3.5" />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
