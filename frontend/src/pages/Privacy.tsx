import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <NavLink to="/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Workspace
      </NavLink>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" /> Private Workspace Data Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Privacy & Data Governance Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: September 2026 • Prepared for Enterprise Customer Success Workspaces
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Ownership & Customer Memory Isolation</h3>
          <p>
            RenewalOS retains customer interactions, sales call notes, QBR commitments, and support ticket details strictly within your isolated workspace memory bank. Memory records are scoped by workspace ID and are never exposed across tenant boundaries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Collection of Customer Interactions</h3>
          <p>
            We process interaction memories, customer facts, and CSM operational notes solely to provide grounded recall, observation consolidation, and AI copilot reasoning support for your portfolio accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Third-Party Memory & Inference Services</h3>
          <p>
            RenewalOS utilizes persistent memory infrastructure (Hindsight by Vectorize.io) and inference APIs (Groq LLM). Data transmitted to memory providers is scoped to your specified memory bank identifier (`renewal_os_bank`) without retaining training rights.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Data Rights, Retention & Deletion</h3>
          <p>
            Workspace administrators may delete account data at any time via the REST API (<code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">DELETE /api/accounts/{'{account_id}'}</code>). Deletion permanently removes database records and purges all indexed memory bank entries from Hindsight.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 italic">
            This document outlines the operational privacy framework for RenewalOS. For custom data retention policies or legal inquiries, submit a note via the Feedback page.
          </p>
        </section>
      </div>
    </div>
  );
};
