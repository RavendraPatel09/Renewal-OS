import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, InteractionMemory, BriefingResponse, TemporalStep, KnowledgeGraphData, Observation } from '../types';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { MemoryEvolutionWidget } from '../components/MemoryEvolutionWidget';
import { CustomerKnowledgeGraph } from '../components/CustomerKnowledgeGraph';
import { TemporalEvolutionTimeline } from '../components/TemporalEvolutionTimeline';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { Bot, Plus, ArrowLeft, Sparkles, Network, Clock, Database, Layers } from 'lucide-react';

interface Props {
  onOpenAddModal: () => void;
}

export const AccountDetail: React.FC<Props> = ({ onOpenAddModal }) => {
  const { id } = useParams<{ id: string }>();
  const accountId = id || 'acme-corp';

  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [temporalSteps, setTemporalSteps] = useState<TemporalStep[]>([]);
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], links: [] });
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [activeTab, setActiveTab] = useState<'evolution' | 'graph' | 'temporal' | 'timeline'>('evolution');

  const loadData = () => {
    api.getAccount(accountId).then(setAccount).catch(console.error);
    api.getMemories(accountId).then(setMemories).catch(console.error);
    api.getAccountTemporal(accountId).then(setTemporalSteps).catch(console.error);
    api.getAccountGraph(accountId).then(setGraphData).catch(console.error);
    api.getMemoryEvolution(accountId).then(setEvolutionData).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [accountId]);

  const handleGenerateBriefing = async (mode: 'recall' | 'reflect' = 'reflect') => {
    setLoadingBriefing(true);
    try {
      const res = await api.queryCopilot(`Prepare me for ${account?.name || accountId}'s renewal`, accountId, mode, true);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  if (!account) {
    return <div className="p-8 text-center text-slate-500">Loading customer account memory bank...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <NavLink to="/accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Accounts
      </NavLink>

      {/* Account Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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

      {/* Tab Navigation for Hindsight Concepts */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('evolution')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'evolution'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Memory Evolution
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'graph'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Network className="w-4 h-4" /> Knowledge Graph
        </button>

        <button
          onClick={() => setActiveTab('temporal')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'temporal'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> 60-Day Temporal Evolution
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'timeline'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Raw Memory Timeline
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'evolution' && (
        <MemoryEvolutionWidget
          observations={evolutionData?.observations || []}
          rawMemories={memories}
          worldFacts={evolutionData?.world_facts || []}
          experienceFacts={evolutionData?.experience_facts || []}
        />
      )}

      {activeTab === 'graph' && (
        <CustomerKnowledgeGraph graphData={graphData} />
      )}

      {activeTab === 'temporal' && (
        <TemporalEvolutionTimeline steps={temporalSteps} />
      )}

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Memory Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Retained Memories ({memories.length})
            </h2>
            <button
              onClick={onOpenAddModal}
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Retain New Memory
            </button>
          </div>

          <MemoryTimeline memories={memories} />
        </div>

        {/* Right: AI Copilot Renewal Intelligence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-500" /> Hindsight Copilot
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateBriefing('recall')}
                disabled={loadingBriefing}
                className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition disabled:opacity-50"
              >
                RECALL
              </button>
              <button
                onClick={() => handleGenerateBriefing('reflect')}
                disabled={loadingBriefing}
                className="text-xs font-semibold px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition disabled:opacity-50"
              >
                REFLECT
              </button>
            </div>
          </div>

          {briefing ? (
            <CopilotResponseCard briefing={briefing} />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <Bot className="w-10 h-10 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Trigger Hindsight Recall or Reflect</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click RECALL for factual lookup or REFLECT for deep reasoning over {memories.length} memories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
