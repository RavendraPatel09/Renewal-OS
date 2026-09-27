import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, InteractionMemory, BriefingResponse } from '../types';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { AlertTriangle, Plus, Bot, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  onOpenAddModal: () => void;
}

export const AccountDetail: React.FC<Props> = ({ onOpenAddModal }) => {
  const { id } = useParams<{ id: string }>();
  const accountId = id || 'acme-corp';

  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const loadData = () => {
    api.getAccount(accountId).then(setAccount).catch(console.error);
    api.getMemories(accountId).then(setMemories).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [accountId]);

  const handleGenerateBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await api.queryCopilot(`Prepare me for ${account?.name || accountId}'s renewal`, accountId, true);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  if (!account) {
    return <div className="p-8 text-center text-slate-500">Loading customer account memory...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <NavLink to="/accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Accounts
      </NavLink>

      {/* Account Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{account.name}</h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {account.tier}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned CSM: {account.csm_name} • Renewal in <strong className="text-slate-800 dark:text-slate-200">{account.renewal_days} days</strong>
          </p>
        </div>

        {/* Risk Card Badge */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{account.risk_score} / 100</span>
          </div>
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-700" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-rose-500 block uppercase tracking-wider">{account.risk_level} Attention</span>
            <span className="text-slate-500 dark:text-slate-400 block">{account.unresolved_promises_count} Overdue Promises</span>
          </div>
        </div>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memories.length} />

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Memory Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Customer Memory Timeline ({memories.length})
            </h2>
            <button
              onClick={onOpenAddModal}
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Memory
            </button>
          </div>

          <MemoryTimeline memories={memories} />
        </div>

        {/* Right: AI Copilot Renewal Intelligence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-500" /> AI Renewal Briefing
            </h2>
            <button
              onClick={handleGenerateBriefing}
              disabled={loadingBriefing}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-lg transition disabled:opacity-50"
            >
              {loadingBriefing ? 'Synthesizing...' : 'Generate Briefing'}
            </button>
          </div>

          {briefing ? (
            <CopilotResponseCard briefing={briefing} />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <Bot className="w-10 h-10 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Generate Renewal Intelligence</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click above to have RenewalOS ground all {memories.length} memories into an executive briefing card.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
