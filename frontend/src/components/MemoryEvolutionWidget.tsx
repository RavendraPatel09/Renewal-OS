import React from 'react';
import { Observation, InteractionMemory } from '../types';
import { Sparkles, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  observations: Observation[];
  rawMemories: InteractionMemory[];
  worldFacts: string[];
  experienceFacts: string[];
}

export const MemoryEvolutionWidget: React.FC<Props> = ({
  observations,
  rawMemories,
  worldFacts,
  experienceFacts
}) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Memory Evolution Engine
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> Hindsight Consolidation Flow
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block">Raw Memory Ingestion $\rightarrow$ Consolidated Observation</span>
        </div>
      </div>

      {/* Evolution Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 1: Raw Memories */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1: Raw Memories</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{rawMemories.length} Retained</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rawMemories.slice(0, 4).map((m, i) => (
              <div key={i} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{m.date} — {m.interaction_type.toUpperCase()}</span>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-1">"{m.summary}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="hidden md:flex items-center justify-center -mx-3 z-10">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: World & Experience Facts */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Step 2: Fact Extraction</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">World & Experience</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">World Facts</span>
              {worldFacts.slice(0, 2).map((wf, idx) => (
                <div key={idx} className="p-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded border border-blue-500/20">
                  🌐 {wf}
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Experience Facts</span>
              {experienceFacts.slice(0, 2).map((ef, idx) => (
                <div key={idx} className="p-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded border border-purple-500/20">
                  ⚡ {ef}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Consolidated Hindsight Observation */}
        <div className="p-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-xl border border-indigo-500/40 shadow-md space-y-3 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step 3: Hindsight Observation</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white uppercase tracking-wider">
              {observations[0]?.status || 'Active Risk'}
            </span>
          </div>

          {observations && observations.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white leading-tight">
                "{observations[0].title}"
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {observations[0].description}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Evidence: <strong className="text-white">{observations[0].evidence_count} memories</strong></span>
                <span>Detected: <strong className="text-indigo-300">{observations[0].first_detected} $\rightarrow$ {observations[0].last_confirmed}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Log 3+ related interaction memories to trigger automatic Hindsight observation consolidation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
