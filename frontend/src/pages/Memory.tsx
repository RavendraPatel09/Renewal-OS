import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { InteractionMemory, AuditEvent, Account } from '../types';
import { Layers, Database, Search, Activity, HelpCircle, CheckCircle2, ArrowUpRight, Filter, Globe, Zap, Sparkles } from 'lucide-react';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { MemoryTimeline } from '../components/MemoryTimeline';

export const Memory: React.FC = () => {
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [activities, setActivities] = useState<AuditEvent[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [factTypeFilter, setFactTypeFilter] = useState<'all' | 'world_fact' | 'experience_fact' | 'observation'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    Promise.all([
      api.getMemories(),
      api.getActivityEvents().catch(() => []),
      api.getAccounts().catch(() => [])
    ]).then(([memData, actData, accData]) => {
      setMemories(memData);
      setActivities(actData);
      setAccounts(accData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      // Fact type filter
      if (factTypeFilter === 'world_fact' && m.fact_type !== 'world_fact') return false;
      if (factTypeFilter === 'experience_fact' && m.fact_type !== 'experience_fact') return false;
      if (factTypeFilter === 'observation' && !m.interaction_type.toLowerCase().includes('observation')) return false;

      // Account filter
      if (accountFilter !== 'all' && m.account_id !== accountFilter) return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSummary = m.summary?.toLowerCase().includes(q);
        const matchesContent = m.content?.toLowerCase().includes(q);
        const matchesAccount = m.account_id?.toLowerCase().includes(q);
        const matchesSource = m.source?.toLowerCase().includes(q);
        if (!matchesSummary && !matchesContent && !matchesAccount && !matchesSource) return false;
      }

      return true;
    });
  }, [memories, factTypeFilter, accountFilter, searchQuery]);

  // Fact counts
  const worldCount = useMemo(() => memories.filter(m => m.fact_type === 'world_fact').length, [memories]);
  const expCount = useMemo(() => memories.filter(m => m.fact_type === 'experience_fact').length, [memories]);
  const obsCount = useMemo(() => memories.filter(m => m.interaction_type.toLowerCase().includes('observation')).length, [memories]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-900 dark:text-white" />
            Hindsight Memory Bank Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit persistent memories, categorizations, and real-time consolidated customer understanding.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-md self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{memories.length} Total Retained Records</span>
        </div>
      </div>

      {/* Memory Classification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFactTypeFilter(factTypeFilter === 'world_fact' ? 'all' : 'world_fact')}
          className={`card-3d-interactive p-4 rounded-xl border text-left transition ${
            factTypeFilter === 'world_fact'
              ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 ring-1 ring-blue-500/20 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">World Facts</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{worldCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Durable customer attributes, contract scale, SSO requirements, and organizational structure.
          </p>
        </button>

        <button
          onClick={() => setFactTypeFilter(factTypeFilter === 'experience_fact' ? 'all' : 'experience_fact')}
          className={`card-3d-interactive p-4 rounded-xl border text-left transition ${
            factTypeFilter === 'experience_fact'
              ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 ring-1 ring-purple-500/20 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Experience Facts</span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{expCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Touchpoints, CSM commitments, bug escalations, and meeting takeaways logged over time.
          </p>
        </button>

        <button
          onClick={() => setFactTypeFilter(factTypeFilter === 'observation' ? 'all' : 'observation')}
          className={`card-3d-interactive p-4 rounded-xl border text-left transition ${
            factTypeFilter === 'observation'
              ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-1 ring-amber-500/20 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Observations</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{obsCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Consolidated patterns automatically inferred across multiple related memories.
          </p>
        </button>
      </div>

      {/* Memory Capacity Bar */}
      <MemoryGrowthWidget count={memories.length} />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search memory records by quote, ticket, note, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>

        {/* Account Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs font-medium">Account:</span>
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Accounts ({memories.length})</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Fact Type Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setFactTypeFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              factTypeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFactTypeFilter('world_fact')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              factTypeFilter === 'world_fact'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            World
          </button>
          <button
            onClick={() => setFactTypeFilter('experience_fact')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              factTypeFilter === 'experience_fact'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Experience
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Memory Timeline List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Retained Touchpoint Timeline ({filteredMemories.length})
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              Loading memory bank records...
            </div>
          ) : filteredMemories.length > 0 ? (
            <MemoryTimeline memories={filteredMemories} />
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No matching memories found</p>
              <p className="text-[11px] text-slate-400">Try changing your search query or fact type filter.</p>
            </div>
          )}
        </div>

        {/* Live Agent Activity Audit Stream */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Live Audit Trail
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Agent Events</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
            {activities.length > 0 ? (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/70 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{act.created_at}</span>
                      <span className="uppercase font-semibold text-slate-700 dark:text-slate-300">
                        {act.event_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white block text-[11px]">
                      {act.title}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 text-center">No audit activity logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Why Hindsight Architecture Explanation */}
      <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Architecture Distinction: Relational DB vs Hindsight Memory Bank
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-200 block text-[11px]">1. Relational Database</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Stores raw historical records (PostgreSQL rows, Salesforce notes, Zendesk tickets). Has no concept of temporal decay or consolidated insight.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1">
            <span className="font-bold text-blue-300 block text-[11px]">2. Hindsight Memory Bank</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Retains World vs Experience Facts. Automatically consolidates recurring signals into high-level Observations with temporal recall.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-300 block text-[11px]">3. RenewalOS Agent</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Synthesizes Hindsight memory to generate grounded renewal briefings, track open commitments, and compare cross-account churn patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
