import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { BriefingResponse, Account } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { Compass, Search, Sparkles, CornerDownLeft, ArrowRight, Layers, ShieldCheck, History, Database } from 'lucide-react';

export const Copilot: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialAccount = searchParams.get('account') || 'acme-corp';

  const [query, setQuery] = useState('');
  const [accountId, setAccountId] = useState(initialAccount);
  const [mode, setMode] = useState<'recall' | 'reflect'>('reflect');
  const [includeCrossAccount, setIncludeCrossAccount] = useState(true);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    api.getAccounts().then(setAccounts).catch(console.error);
  }, []);

  const samplePrompts = [
    {
      q: "Should I be concerned about Acme's renewal?",
      m: 'reflect' as const,
      desc: 'Deep multi-memory risk synthesis & open commitments',
      account: 'acme-corp'
    },
    {
      q: "What did Acme say about SAML SSO in previous calls?",
      m: 'recall' as const,
      desc: 'Factual lookup across historical touchpoints',
      account: 'acme-corp'
    },
    {
      q: "What changed about Acme during the last 60 days?",
      m: 'reflect' as const,
      desc: 'Temporal evolution of sentiment and ticket escalations',
      account: 'acme-corp'
    },
    {
      q: "Have we seen similar churn risks in other accounts?",
      m: 'reflect' as const,
      desc: 'Cross-account pattern matching (NorthStar & NovaHealth)',
      account: 'acme-corp'
    },
    {
      q: "Prepare a renewal strategy for NorthStar Logistics",
      m: 'reflect' as const,
      desc: 'Commercial strategy grounded in previous touchpoints',
      account: 'northstar-logistics'
    },
    {
      q: "What did we promise Acme during the July QBR?",
      m: 'recall' as const,
      desc: 'Extract binding commitments and timeline promises',
      account: 'acme-corp'
    }
  ];

  const handleAsk = async (promptQuery?: string, promptMode?: 'recall' | 'reflect', promptAccount?: string) => {
    const q = promptQuery || query;
    const m = promptMode || mode;
    const acc = promptAccount || accountId;

    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);
    if (promptMode) setMode(promptMode);
    if (promptAccount) setAccountId(promptAccount);

    try {
      const res = await api.queryCopilot(q, acc, m, includeCrossAccount);
      setBriefing(res);
    } catch (err) {
      console.error('Error querying copilot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-900 dark:text-white" />
            Customer Intelligence Copilot
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query persistent Hindsight memories with verified World Facts, Experience Facts, and consolidated Observations.
          </p>
        </div>

        {/* Hindsight Status Tag */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>bank: <strong className="text-slate-700 dark:text-slate-300">renewal_os_bank</strong></span>
        </div>
      </div>

      {/* Main Workspace Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-xs">
          {/* Target Account Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Account:</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
            >
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.plan})
                  </option>
                ))
              ) : (
                <>
                  <option value="acme-corp">Acme Corp</option>
                  <option value="northstar-logistics">NorthStar Logistics</option>
                  <option value="vantage-retail">Vantage Retail</option>
                  <option value="novahealth">NovaHealth</option>
                  <option value="bluepeak-systems">BluePeak Systems</option>
                  <option value="orbit-finance">Orbit Finance</option>
                </>
              )}
            </select>
          </div>

          {/* Mode Tabs: RECALL vs REFLECT */}
          <div className="flex items-center gap-1.5 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setMode('reflect')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                mode === 'reflect'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              REFLECT (Reasoning)
            </button>
            <button
              onClick={() => setMode('recall')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                mode === 'recall'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              RECALL (Factual Lookup)
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="p-4 space-y-3">
          <textarea
            rows={3}
            placeholder={
              mode === 'reflect'
                ? "Ask a strategic reasoning question (e.g. 'Should I be concerned about Acme's renewal?' or 'What changed over the last 60 days?')..."
                : "Ask a factual memory query (e.g. 'What did Acme say about SAML SSO?' or 'What promises were made during the QBR?')..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          {/* Bottom Bar inside Input Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={includeCrossAccount}
                onChange={(e) => setIncludeCrossAccount(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="text-[11px]">Include Cross-Account Experience Patterns</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">⌘ + Enter to submit</span>
              <button
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-40 flex items-center gap-1.5"
              >
                {loading ? 'Synthesizing...' : `Ask Copilot`}
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Scenario Prompts */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Suggested Inquiries Grounded in Memory Bank
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(item.q, item.m, item.account)}
              className="p-2.5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-lg transition group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                    item.m === 'reflect'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                  }`}>
                    {item.m}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition" />
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white leading-snug">
                  {item.q}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Response Card Container */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Scanning Hindsight memory bank for {accountId}...
          </p>
          <span className="text-[11px] text-slate-400">
            Matching World Facts, Experience Facts, and dynamic Observations
          </span>
        </div>
      ) : briefing ? (
        <div className="pt-2">
          <CopilotResponseCard briefing={briefing} />
        </div>
      ) : null}
    </div>
  );
};
