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
          <Shield className="w-3.5 h-3.5 text-brand-500" /> Private Workspace Data Policy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: September 2026 • Prepared for Enterprise Customer Success Workspaces
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-panel">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Ownership & Customer Memory Isolation</h3>
          <p>
            RenewalOS is designed to retain customer interactions, sales call notes, QBR commitments, and support ticket details strictly within your isolated enterprise workspace memory bank. Customer memory data retained in RenewalOS is owned exclusively by your organization.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Collection of Customer Interactions</h3>
          <p>
            We process interaction memories, customer facts, and CSM operational notes solely to provide grounded recall, observation consolidation, and AI copilot reasoning support for your portfolio accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Third-Party Memory Services</h3>
          <p>
            RenewalOS utilizes persistent memory infrastructure (Hindsight by Vectorize.io) and high-throughput inference APIs (Groq LLM). Interaction data transmitted to memory providers is scoped to your specified memory bank identifier (`renewal_os_bank`).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Data Retention & Deletion</h3>
          <p>
            Workspace administrators may reset, export, or delete interaction memories at any time via the workspace settings panel or demo state controls.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 italic">
            This document outlines the operational privacy framework for RenewalOS. Final legal compliance requirements should be reviewed by your corporate legal counsel.
          </p>
        </section>
      </div>
    </div>
  );
};
