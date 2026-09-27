import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { InteractionMemory } from '../types';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { Layers, Database, Sparkles, Cpu, Clock, CheckCircle2 } from 'lucide-react';

export const Memory: React.FC = () => {
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemories().then((data) => {
      setMemories(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-panel space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <Layers className="w-3.5 h-3.5" /> Hindsight Memory Bank Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Customer Memory Engine</h1>
        <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
          RenewalOS does not treat customer history as static documents. It continuously retains interactions, categorizes World vs Experience Facts, and consolidates high-level Observations over time.
        </p>
      </div>

      {/* Memory Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            🌐
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">World Facts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Durable facts about the customer organization, deployment scale, SAML requirements, and contract terms.
          </p>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block pt-2">e.g. Acme has 450 active users</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Experience Facts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Actions taken by CSMs, Support, or Engineering during past customer touchpoints.
          </p>
          <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 block pt-2">e.g. Support escalated ticket #4821</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            ✨
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Consolidated Observations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            High-level patterns automatically consolidated across multiple related interaction memories over time.
          </p>
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 block pt-2">e.g. Persistent SSO dissatisfaction</span>
        </div>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memories.length} />

      {/* Retained Memories Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-500" /> All Retained Memories ({memories.length})
          </h2>
        </div>
        <MemoryTimeline memories={memories} />
      </div>
    </div>
  );
};
