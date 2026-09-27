import React, { useState } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { Bot, Send, Sparkles, Database } from 'lucide-react';

export const Copilot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [accountId, setAccountId] = useState('acme-corp');
  const [includeCrossAccount, setIncludeCrossAccount] = useState(true);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Prepare me for Acme's renewal",
    "What did we promise Acme?",
    "Why is Acme at risk?",
    "What changed since the last QBR?",
    "Find similar customers who churned",
    "What worked with similar accounts?"
  ];

  const handleAsk = async (promptText?: string) => {
    const q = promptText || query;
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.queryCopilot(q, accountId, includeCrossAccount);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
          <Bot className="w-4 h-4" /> Renewal Copilot Memory Interface
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Ask anything about your customers.</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Every response is grounded in persistent Hindsight memories across sales calls, support tickets, and QBR commitments.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Prepare me for Acme's renewal or What promises are overdue?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Recalling...' : 'Ask Copilot'} <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Account Selector & Options */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 px-1 gap-3">
          <div className="flex items-center gap-2">
            <span>Target Account:</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              <option value="acme-corp">Acme Corp</option>
              <option value="northstar-logistics">NorthStar Logistics</option>
              <option value="vantage-retail">Vantage Retail</option>
              <option value="novahealth">NovaHealth</option>
              <option value="bluepeak-systems">BluePeak Systems</option>
              <option value="orbit-finance">Orbit Finance</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeCrossAccount}
              onChange={(e) => setIncludeCrossAccount(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Enable Cross-Account Learning (Hindsight Pattern Matching)</span>
          </label>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Suggested Questions</span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(prompt);
                handleAsk(prompt);
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition text-left flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Response Card */}
      {briefing && (
        <div className="pt-4">
          <CopilotResponseCard briefing={briefing} />
        </div>
      )}
    </div>
  );
};
