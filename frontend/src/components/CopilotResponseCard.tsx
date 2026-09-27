import React, { useState } from 'react';
import { BriefingResponse } from '../types';
import { ShieldAlert, AlertTriangle, Lightbulb, Eye, EyeOff, Layers, History, Database, Cpu, CheckCircle2, GitBranch, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  briefing: BriefingResponse;
}

export const CopilotResponseCard: React.FC<Props> = ({ briefing }) => {
  const [showEvidence, setShowEvidence] = useState(true);
  const [showDirectives, setShowDirectives] = useState(false);
  const [showTrace, setShowTrace] = useState(true);

  return (
    <div className="space-y-4 text-slate-900 dark:text-white">
      {/* Top Banner with Mode & Executive Answer */}
      <div className="p-6 bg-slate-900 text-white dark:bg-slate-950 rounded-2xl border border-slate-800 shadow-panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              briefing.query_mode === 'reflect'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              HINDSIGHT {briefing.query_mode.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-medium">Memory Bank: renewal_os_bank</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Risk Assessment:</span>
            <span className={`px-2.5 py-0.5 rounded font-bold text-xs uppercase ${
              briefing.risk_score > 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {briefing.risk_score} / 100 • {briefing.risk_level}
            </span>
          </div>
        </div>

        {/* Executive Answer */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Executive Briefing Answer</span>
          <p className="text-base font-medium leading-relaxed text-slate-100">
            {briefing.summary}
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            onClick={() => setShowTrace(!showTrace)}
            className="flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <GitBranch className="w-3.5 h-3.5" />
            {showTrace ? 'Hide Memory Trace' : 'View Memory Trace'}
          </button>

          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white transition"
          >
            {showEvidence ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            {showEvidence ? 'Hide Evidence Sources' : 'View Supporting Evidence'}
          </button>

          <button
            onClick={() => setShowDirectives(!showDirectives)}
            className="flex items-center gap-1.5 font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-500" /> Bank Directives
          </button>
        </div>
      </div>

      {/* Memory Trace High-Level Progression */}
      {showTrace && briefing.memory_trace && briefing.memory_trace.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-500" /> Hindsight Memory Trace
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 text-xs">
            {briefing.memory_trace.map((step, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] block">{step.step}</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Bank Directives Dropdown */}
      <AnimatePresence>
        {showDirectives && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-slate-900/90 text-slate-300 border border-slate-800 rounded-xl space-y-2 text-xs"
          >
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" /> Configured Hindsight Bank Mission
            </h4>
            <p className="italic text-slate-400 border-l-2 border-indigo-500 pl-2">
              "{briefing.bank_mission}"
            </p>
            <span className="font-bold text-slate-200 block pt-1">Active Directives:</span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px]">
              {briefing.bank_directives.map((dir, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-indigo-400 font-bold">✓</span> {dir}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Signals */}
      {briefing.key_signals && briefing.key_signals.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            Key Memory Signals
          </span>
          <div className="space-y-1.5">
            {briefing.key_signals.map((sig, sIdx) => (
              <div key={sIdx} className="p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relevant Observations */}
      {briefing.observations && briefing.observations.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Relevant Hindsight Observations
          </h4>
          {briefing.observations.map((obs, i) => (
            <div key={i} className="p-3 bg-amber-50/30 dark:bg-amber-950/20 rounded-lg space-y-1 text-xs border border-amber-200/60 dark:border-amber-900/40">
              <span className="font-bold text-slate-900 dark:text-white">{obs.title}</span>
              <p className="text-slate-600 dark:text-slate-300">{obs.description}</p>
              <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                Evidence: {obs.evidence_count} memories • Timeline: {obs.first_detected} $\rightarrow$ {obs.last_confirmed}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Supporting Evidence Memories */}
      <AnimatePresence>
        {showEvidence && briefing.supporting_memories && briefing.supporting_memories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-500" /> Supporting Memories ({briefing.supporting_memories.length})
              </h4>
              <span className="text-[10px] text-slate-400">Exact Memory Bank Records</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {briefing.supporting_memories.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg text-xs flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{m.date}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {m.interaction_type}
                      </span>
                      {m.fact_type && (
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono">
                          {m.fact_type}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">"{m.summary || m.content}"</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{m.account_id}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Concerns & Promises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {briefing.key_concerns && briefing.key_concerns.length > 0 && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Key Account Concerns
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {briefing.key_concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {briefing.open_commitments && briefing.open_commitments.length > 0 && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Open Commitments
            </h4>
            <ul className="space-y-2 text-xs">
              {briefing.open_commitments.map((comm, i) => (
                <li key={i} className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-slate-800 dark:text-slate-200">{comm.description}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] shrink-0 ${
                    comm.status === 'overdue' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                    {comm.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Historical Pattern Matching */}
      {briefing.historical_patterns && briefing.historical_patterns.length > 0 && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Cross-Account Pattern Learning
          </h4>
          {briefing.historical_patterns.map((pat, i) => (
            <p key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {pat}
            </p>
          ))}
        </div>
      )}

      {/* Recommended Next Actions */}
      <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" /> Recommended Next Steps
        </h4>
        <p className="text-xs text-slate-800 dark:text-emerald-200 font-semibold leading-relaxed">
          {briefing.recommended_action}
        </p>
        {briefing.recommended_next_steps && briefing.recommended_next_steps.length > 0 && (
          <div className="pt-2 border-t border-emerald-500/20 space-y-1">
            {briefing.recommended_next_steps.map((st, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uncertainty Disclaimer */}
      {briefing.uncertainty && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span><strong>Uncertainty Assessment:</strong> {briefing.uncertainty}</span>
        </div>
      )}
    </div>
  );
};
