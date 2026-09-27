import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowRight, Compass, Database, Layers, CheckCircle2, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 pb-16 pt-4 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Persistent AI Memory for Customer Success</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Customer context shouldn’t reset every quarter.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          RenewalOS uses Hindsight to retain sales notes, support tickets, and QBR commitments — synthesizing dynamic observations and cross-account churn patterns.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NavLink
            to="/dashboard"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-2"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>

          <NavLink
            to="/demo"
            className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs border border-slate-200 dark:border-slate-800 transition flex items-center gap-2"
          >
            <span>Demo Walkthrough</span>
          </NavLink>
        </div>
      </div>

      {/* Architecture Flow */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Architecture
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              The Hindsight Memory Pipeline
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Retain → Recall → Reflect</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Retain</h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Touchpoints ingested as World Facts (contracts, scale) and Experience Facts (tickets, QBRs).
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Recall</h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Temporal and factual search across historical memory timestamps with high precision.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Consolidate</h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Recurring signals coalesce into dynamic Observations with audit traces back to raw memories.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">4</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reflect</h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Synthesizes open commitments and cross-account historical churn patterns to prescribe action.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Comparative Value
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            How RenewalOS Differs from Traditional Tools
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Traditional CRM / Notes</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fragmented Data Silos</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Notes sit untouched in Salesforce or Zendesk. When a CSM leaves or months pass, historical commitments and nuance are lost.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Standard Vector RAG</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Static Chunk Similarity</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Finds similar text chunks without understanding temporal progression, shifts in account sentiment, or multi-stage commitments.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-900 dark:border-slate-700 rounded-xl space-y-2 shadow-xs ring-1 ring-slate-900/10 dark:ring-slate-100/10">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">RenewalOS + Hindsight</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Grounded Memory Reasoning</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Maintains durable memory banks, tracks open promises, links observations to evidence, and learns from previous renewal outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
