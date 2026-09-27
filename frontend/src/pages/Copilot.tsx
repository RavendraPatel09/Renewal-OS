import React, { useState } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { Bot, Send, Sparkles, Cpu, Layers } from 'lucide-react';

export const Copilot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [accountId, setAccountId] = useState('acme-corp');
  const [mode, setMode] = useState<'recall' | 'reflect'>('reflect');
  const [includeCrossAccount, setIncludeCrossAccount] = useState(true);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    { label: "Should I be concerned about Acme's renewal?", mode: 'reflect' as const },
    { label: "What did Acme say about SAML SSO?", mode: 'recall' as const },
    { label: "What changed about Acme during the last 60 days?", mode: 'reflect' as const },
    { label: "What did we promise Acme during the July QBR?", mode: 'recall' as const },
    { label: "Find similar customers who churned", mode: 'reflect' as const },
    { label: "What worked with similar accounts?", mode: 'reflect' as const }
  ];

  const handleAsk = async (promptText?: string, promptMode?: 'recall' | 'reflect') => {
    const q = promptText || query;
    const m = promptMode || mode;
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.queryCopilot(q, accountId, m, includeCrossAccount);
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
          <Bot className="w-4 h-4" /> Hindsight Memory Bank Copilot
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Ask anything about your customers.</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Distinguishes <strong className="text-emerald-500">RECALL</strong> (factual lookup) vs <strong className="text-purple-500">REFLECT</strong> (deep multi-memory reasoning) grounded in persistent Hindsight memories.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-3">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider">Hindsight Mode:</span>
            <button
              onClick={() => setMode('recall')}
              className={`px-3 py-1 rounded-lg transition ${
                mode === 'recall'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              RECALL (Factual Search)
            </button>
            <button
              onClick={() => setMode('reflect')}
              className={`px-3 py-1 rounded-lg transition ${
                mode === 'reflect'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              REFLECT (Deep Reasoning)
            </button>
          </div>

          <span className="text-slate-400 font-medium hidden sm:inline">Bank: renewal_os_bank</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Should I be concerned about Acme's renewal? or What did we promise?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className={`px-5 py-3 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 disabled:opacity-50 ${
              mode === 'reflect' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Processing...' : `Ask (${mode.toUpperCase()})`} <Send className="w-4 h-4" />
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
            <span>Enable Cross-Account Learning (Historical Memory Pattern Matching)</span>
          </label>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Suggested Hindsight Questions</span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(prompt.label);
                setMode(prompt.mode);
                handleAsk(prompt.label, prompt.mode);
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition text-left flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${prompt.mode === 'reflect' ? 'text-purple-500' : 'text-emerald-500'}`} />
              <span>{prompt.label}</span>
              <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                prompt.mode === 'reflect' ? 'bg-purple-500/10 text-purple-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>{prompt.mode}</span>
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
