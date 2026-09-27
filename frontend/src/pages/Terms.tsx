import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <NavLink to="/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Workspace
      </NavLink>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-brand-500" /> Workspace Terms of Service
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: September 2026 • RenewalOS SaaS Platform Terms
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-panel">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing or using RenewalOS, you agree to comply with these Terms of Service. RenewalOS is built to assist Customer Success Managers with relationship memory retention and renewal context.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Workspace Account Usage</h3>
          <p>
            You are responsible for maintaining the confidentiality of your workspace credentials and for all activities performed within your account.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. User Responsibilities & AI Decision Support</h3>
          <p>
            RenewalOS provides AI decision support based on accumulated customer memories. CSM recommendations and risk briefings are intended to assist executive decisions and should be verified prior to initiating binding contract terms.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Intellectual Property</h3>
          <p>
            RenewalOS and its underlying software architecture, memory consolidation mechanisms, and UI components are protected by intellectual property rights.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 italic">
            For questions regarding service terms or custom enterprise SLAs, please submit a note via the Feedback page.
          </p>
        </section>
      </div>
    </div>
  );
};
