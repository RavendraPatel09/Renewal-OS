import React, { useState } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { PlayCircle, RefreshCw, PlusCircle, History, Sparkles, CheckCircle2 } from 'lucide-react';

export const Demo: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stageMessage, setStageMessage] = useState<string>('Stage 1: Cold Start initialized (0 memories)');

  const question = "Prepare me for Acme's renewal.";

  const handleResetStage1 = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      setStage(1);
      setMemoryCount(0);
      setBriefing(null);
      setStageMessage('Stage 1: Cold Start initialized (0 memories)');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunStage1Query = async () => {
    setLoading(true);
    try {
      const res = await api.queryCopilot(question, 'acme-corp', false, 1);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStage2AddMemories = async () => {
    setLoading(true);
    try {
      await api.injectAcmeStage2();
      setStage(2);
      setMemoryCount(5);
      setStageMessage('Stage 2: 5 Acme customer memories injected into Hindsight!');
      const res = await api.queryCopilot(question, 'acme-corp', false, 2);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStage3EnableCrossAccount = async () => {
    setLoading(true);
    try {
      await api.injectCrossAccountStage3();
      setStage(3);
      setMemoryCount(18);
      setStageMessage('Stage 3: Cross-account historical renewal memories active!');
      const res = await api.queryCopilot("Is Acme showing a known churn pattern?", 'acme-corp', true, 3);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFullDataset = async () => {
    setLoading(true);
    try {
      const res = await api.seedDemo();
      setStage(3);
      setMemoryCount(res.memories_count || 176);
      setStageMessage(`Full Hackathon Environment Ready! (${res.memories_count || 176} memories across 8 accounts)`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
            <PlayCircle className="w-3.5 h-3.5" /> Hackathon Demo Experience
          </div>
          <h1 className="text-3xl font-extrabold">Watch RenewalOS Learn</h1>
          <p className="text-slate-300 text-sm mt-1">
            Same customer. Same question. Dramatically better answer as memories accumulate.
          </p>
        </div>

        <button
          onClick={handleLoadFullDataset}
          disabled={loading}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Load Full Hackathon Seed Data
        </button>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memoryCount} />

      {/* Interactive 3-Stage Stepper Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1 */}
        <div className={`p-5 rounded-xl border transition space-y-3 ${
          stage === 1 ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stage 1</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">0 Memories</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Cold Start</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query RenewalOS with no customer context. Standard LLM fallback.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleResetStage1}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-300 transition"
            >
              Reset 0
            </button>
            <button
              onClick={handleRunStage1Query}
              disabled={loading}
              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
            >
              Ask RenewalOS
            </button>
          </div>
        </div>

        {/* Stage 2 */}
        <div className={`p-5 rounded-xl border transition space-y-3 ${
          stage === 2 ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Stage 2</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">5 Memories</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Customer Context</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inject 5 Acme interactions (sales, support ticket, QBR promise).
          </p>
          <button
            onClick={handleStage2AddMemories}
            disabled={loading}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add 5 Customer Memories
          </button>
        </div>

        {/* Stage 3 */}
        <div className={`p-5 rounded-xl border transition space-y-3 ${
          stage === 3 ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Stage 3</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">Cross-Account</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Learned Patterns</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enable cross-account historical churn memories & pattern match.
          </p>
          <button
            onClick={handleStage3EnableCrossAccount}
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <History className="w-4 h-4" /> Enable Cross-Account Learning
          </button>
        </div>
      </div>

      {/* Current Status Message Bar */}
      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>{stageMessage}</span>
      </div>

      {/* Question & Live Result Display */}
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Target Question: "{stage === 3 ? 'Is Acme showing a known churn pattern?' : question}"</span>
          <span className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Grounded Output</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs font-medium">Recalling Hindsight memories and executing AI reasoning...</p>
          </div>
        ) : briefing ? (
          <CopilotResponseCard briefing={briefing} />
        ) : (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            Click any stage button above to run the live hackathon demo comparison.
          </div>
        )}
      </div>
    </div>
  );
};
