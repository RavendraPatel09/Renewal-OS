import React, { useState } from 'react';
import { BriefingResponse } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, Eye, EyeOff, Layers, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  briefing: BriefingResponse;
}

export const CopilotResponseCard: React.FC<Props> = ({ briefing }) => {
  const [showMemories, setShowMemories] = useState(false);

  return (
    <div className="space-y-4 text-slate-900 dark:text-white">
      {/* Header Badge & Summary */}
      <div className="p-5 bg-slate-900 text-white dark:bg-slate-950 rounded-xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
            RENEWAL BRIEFING
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Risk Score:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-xs ${
              briefing.risk_score > 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {briefing.risk_score} / 100 ({briefing.risk_level.toUpperCase()})
            </span>
          </div>
        </div>

        <p className="text-base font-medium leading-relaxed text-slate-200">
          {briefing.summary}
        </p>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setShowMemories(!showMemories)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            {showMemories ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showMemories ? 'Hide Memories' : 'Why am I seeing this? (View memories)'}
          </button>
        </div>
      </div>

      {/* Supporting Memories Modal / Expandable Box */}
      <AnimatePresence>
        {showMemories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Layers className="w-4 h-4" /> This insight was grounded & generated from Hindsight:
            </h4>
            <div className="space-y-2">
              {briefing.supporting_memories && briefing.supporting_memories.length > 0 ? (
                briefing.supporting_memories.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 rounded-lg text-xs flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">✓ {m.interaction_type.toUpperCase()} — {m.date}</span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{m.summary}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 italic shrink-0 ml-2">{m.account_id}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No specific supporting memories found for this stage.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Concerns and Open Promises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Concerns */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Key Account Concerns
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {briefing.key_concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span> {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Open Promises */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Open Product Promises
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {briefing.open_promises.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Historical Pattern Matching (Cross-account) */}
      {briefing.historical_patterns && briefing.historical_patterns.length > 0 && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <History className="w-4 h-4" /> Historical Churn Pattern Match
          </h4>
          {briefing.historical_patterns.map((pat, i) => (
            <p key={i} className="text-xs text-slate-700 dark:text-purple-200 leading-relaxed font-medium">
              {pat}
            </p>
          ))}
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4" /> Recommended Next CSM Action
        </h4>
        <p className="text-xs text-slate-800 dark:text-emerald-200 font-semibold leading-relaxed">
          {briefing.recommended_action}
        </p>
      </div>
    </div>
  );
};
