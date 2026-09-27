import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount } from '../types';
import { Users, Calendar, AlertTriangle, Database, ArrowUpRight, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const atRiskAccounts = accounts.filter(a => a.risk_level === 'high');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
          <Database className="w-3.5 h-3.5" /> Powered by Hindsight Memory Layer
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Remember Every Customer. Learn From Every Renewal.
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          RenewalOS persistent AI memory synthesizes sales objections, support tickets, QBR promises, and cross-account historical churn patterns to protect your renewals.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <NavLink
            to="/demo"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-2"
          >
            Launch Interactive Hackathon Demo <ArrowRight className="w-4 h-4" />
          </NavLink>
          <NavLink
            to="/copilot"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
          >
            Ask AI Copilot
          </NavLink>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active Accounts</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">42</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-[11px] text-slate-400">Portfolio CSM: Priya Sharma</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Renewals This Month</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">8</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-[11px] text-amber-500 font-medium">3 requiring immediate attention</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Accounts At Risk</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">3</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-[11px] text-rose-500 font-medium">Acme Corp high concern</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Memories Stored</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">1,284</span>
            <Database className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">+18 added this week</span>
        </div>
      </div>

      {/* Renewal Risk Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> High Attention Renewals
          </h2>
          <NavLink to="/accounts" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Accounts →
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {atRiskAccounts.map((acc) => (
            <motion.div
              key={acc.id}
              whileHover={{ y: -2 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4 flex flex-col justify-between"
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
                className="w-full mt-4 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold text-center transition flex items-center justify-center gap-1"
              >
                Inspect Memory & Intelligence <ArrowUpRight className="w-3.5 h-3.5" />
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
