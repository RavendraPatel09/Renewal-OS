import React, { useState } from 'react';
import { Observation, InteractionMemory } from '../types';
import { Sparkles, Layers, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, ShieldAlert, Eye, Calendar, Tag, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';

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
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const activeObservation = observations && observations.length > 0 ? observations[0] : null;

  return (
    <div className="space-y-6">
      {/* Main Memory Evolution Pipeline Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-panel space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Memory Evolution Engine
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Raw Memories $\rightarrow$ Observations $\rightarrow$ Reasoning
            </h3>
          </div>
          {activeObservation && (
            <button
              onClick={() => {
                setSelectedObs(activeObservation);
                setIsExplorerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> Open Observation Explorer
            </button>
          )}
        </div>

        {/* 4-Stage Evolution Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1: Raw Memories */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stage 1: Raw Memories</span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                {rawMemories.length} Retained
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {rawMemories.slice(0, 4).map((m, idx) => (
                <div key={idx} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{m.date}</span>
                    <span className="uppercase font-bold text-slate-600 dark:text-slate-300">{m.interaction_type}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium line-clamp-1">{m.summary || m.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 2: Consolidated Observation */}
          <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Stage 2: Observation</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 uppercase">
                {activeObservation?.status || 'Active'}
              </span>
            </div>
            {activeObservation ? (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-snug">
                  {activeObservation.title}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeObservation.description}
                </p>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold pt-1">
                  Backed by {activeObservation.evidence_count} evidence memories
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Accumulate 2+ memories to consolidate pattern.</p>
            )}
          </div>

          {/* Stage 3: Agent Understanding */}
          <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Stage 3: Understanding</span>
              <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Synthesis</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeObservation?.agent_understanding ||
                  "This is no longer an isolated technical issue. The repeated unresolved problem directly undermines customer trust and renewal confidence."}
              </p>
            </div>
          </div>

          {/* Stage 4: Suggested Action */}
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Stage 4: Grounded Action</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Next Step</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeObservation?.suggested_action ||
                  "Address unresolved technical commitments before presenting commercial expansion terms."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observation Explorer Modal / Drawer */}
      {isExplorerOpen && selectedObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5" /> Hindsight Observation Explorer
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  "{selectedObs.title}"
                </h3>
              </div>
              <button
                onClick={() => setIsExplorerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Why does the agent believe this? */}
            <div className="p-4 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-brand-500" /> Why does the agent believe this?
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedObs.description}
              </p>
            </div>

            {/* Meta Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">First Detected</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedObs.first_detected}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Most Recent Evidence</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedObs.last_confirmed}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Evidence Count</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{selectedObs.evidence_count} Memories</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Observation Status</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">{selectedObs.status}</span>
              </div>
            </div>

            {/* Evolution Timeline Stages */}
            {selectedObs.evolution_stages && selectedObs.evolution_stages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Observation Progression Stages
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-4 ml-1">
                  {selectedObs.evolution_stages.map((stage, sIdx) => (
                    <div key={sIdx} className="space-y-1 relative">
                      <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-brand-500" />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{stage.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({stage.date})</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{stage.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicting Evidence if any */}
            {selectedObs.conflicting_evidence && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Historical Context & Nuance</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedObs.conflicting_evidence}</p>
              </div>
            )}

            {/* Related Entities */}
            {selectedObs.related_entities && selectedObs.related_entities.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Related Graph Entities</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedObs.related_entities.map((entity, eIdx) => (
                    <span key={eIdx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsExplorerOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
