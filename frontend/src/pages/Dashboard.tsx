import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, AuditEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Compass, Plus, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
}

export const Dashboard: React.FC<Props> = ({ onOpenAddModal, onOpenSearch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [activities, setActivities] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAccounts(),
      api.getActivityEvents().catch(() => [])
    ]).then(([accs, acts]) => {
      setAccounts(accs);
      setActivities(acts);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const attentionAccounts = accounts.filter(
    a => a.risk_level === 'high' || a.unresolved_promises_count > 0 || a.renewal_days <= 30
  ).slice(0, 4);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Priya';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-4xl"
    >
      {/* Calm Greeting Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Good morning, {firstName}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Here is what needs your attention across your customer relationships today.
        </p>
      </div>

      {/* Section 1: What Needs Attention? */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Needs Attention ({attentionAccounts.length})
          </span>
          <NavLink
            to="/accounts"
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition"
          >
            View all accounts →
          </NavLink>
        </div>

        <div className="space-y-2">
          {attentionAccounts.length > 0 ? (
            attentionAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => navigate(`/accounts/${acc.id}`)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group select-none shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {acc.name}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">• {acc.plan || acc.tier}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {acc.unresolved_promises_count > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        {acc.unresolved_promises_count} unresolved commitment{acc.unresolved_promises_count > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span>Renewal approaching in {acc.renewal_days} days</span>
                    )}
                    <span className="text-slate-400"> • Assigned to {acc.csm_name}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    acc.risk_level === 'high'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}>
                    {acc.renewal_days}d until renewal
                  </span>
                  <button className="text-xs text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white font-medium flex items-center gap-1 transition">
                    <span>Review</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              No accounts currently flagged for urgent attention.
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Recent Memory Activity Stream */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recent Memory Activity
          </span>
          <NavLink
            to="/memory"
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition"
          >
            Memory Bank →
          </NavLink>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-xs">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="p-3.5 flex items-start justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {act.title}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {act.description}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                {act.created_at}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Continue Working Actions */}
      <section className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          Quick Actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/accounts/acme-corp')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Prepare a Renewal
              </span>
              <span className="text-[11px] text-slate-500">Acme Corp brief</span>
            </div>
            <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/copilot')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Ask Copilot
              </span>
              <span className="text-[11px] text-slate-500">Query memory bank</span>
            </div>
            <Compass className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Add Interaction
              </span>
              <span className="text-[11px] text-slate-500">Log note or touchpoint</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};
