import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { InteractionMemory, AuditEvent } from '../types';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { Layers, Database, Sparkles, Cpu, Clock, CheckCircle2, Activity, HelpCircle, Shield, GitCommit } from 'lucide-react';

export const Memory: React.FC = () => {
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [activities, setActivities] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMemories(),
      api.getActivityEvents().catch(() => [])
    ]).then(([memData, actData]) => {
      setMemories(memData);
      setActivities(actData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-panel space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <Layers className="w-3.5 h-3.5" /> Hindsight Memory Bank Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Customer Memory Engine</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
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

      {/* Two Column Layout: Retained Memories & Real Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Retained Memories Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-500" /> All Retained Memories ({memories.length})
            </h2>
          </div>
          <MemoryTimeline memories={memories} />
        </div>

        {/* Right: Real Agent Activity Stream */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Agent Activity Stream
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Live Audit Events</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
            {activities.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{act.created_at}</span>
                      <span className="uppercase font-bold text-brand-600 dark:text-brand-400">{act.event_type.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block">{act.title}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{act.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* "Why Hindsight?" Explainer Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Hindsight? Traditional DB vs Persistent Memory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-300 block">Database</span>
            <p className="text-slate-400 leading-relaxed">
              Stores raw records (PostgreSQL rows, Salesforce notes, Zendesk tickets). Does not understand evolution, sentiment shifts, or consolidated customer patterns.
            </p>
          </div>

          <div className="p-4 bg-brand-950/40 rounded-xl border border-brand-800/60 space-y-1.5">
            <span className="font-bold text-brand-300 block">Hindsight</span>
            <p className="text-slate-300 leading-relaxed">
              Remembers customer experience. Builds dynamic observations, links entities across touchpoints, and surfaces temporal progressions.
            </p>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1.5">
            <span className="font-bold text-emerald-300 block">RenewalOS</span>
            <p className="text-slate-300 leading-relaxed">
              Uses that persistent memory to reason about what happens next. Prepares renewal briefings, suggests meeting agendas, and prevents churn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
