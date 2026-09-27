import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Bot, PlayCircle, Layers, ArrowRight, Database, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 pb-16 pt-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-500/20">
          <Database className="w-3.5 h-3.5" /> Persistent Customer Success Memory Layer
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Your Customer's History Shouldn't Reset Every Quarter.
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          RenewalOS gives Customer Success teams persistent AI memory across every sales objection, support ticket, QBR commitment, and renewal conversation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NavLink
            to="/copilot"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> Open Renewal Copilot
          </NavLink>

          <NavLink
            to="/demo"
            className="px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition flex items-center gap-2 shadow-subtle"
          >
            <PlayCircle className="w-4 h-4 text-brand-500" /> Watch the Agent Learn
          </NavLink>
        </div>
      </div>

      {/* Visual Memory Architecture Diagram */}
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-panel max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Architecture Pipeline</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">How RenewalOS Transforms Scattered Touchpoints</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto font-bold">1</div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Customer Memory</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sales calls, support tickets, QBRs, emails retained in Hindsight</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto font-bold">2</div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Persistent Recall</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Factual search across World Facts and Experience Facts</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto font-bold">3</div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pattern Recognition</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Consolidated observations and historical churn pattern matching</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto font-bold">4</div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Better Renewals</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Grounded briefings and concrete next-step CSM interventions</p>
          </div>
        </div>
      </div>

      {/* Product Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">✓</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Context That Stays With the Account</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When CSMs transition or months pass between QBRs, RenewalOS ensures zero loss of commitments, objections, or unresolved issues.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">✓</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Grounded Memory Evidence</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every briefing card links directly back to supported Hindsight memories. Never guess why an account risk score was generated.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">✓</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cross-Account Churn Intelligence</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Compares active accounts against previous churned and renewed experiences to suggest proven intervention playbooks.
          </p>
        </div>
      </div>
    </div>
  );
};
