import React, { useState } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { PlayCircle, PlusCircle, History, Sparkles, CheckCircle2, Clock, Database, ArrowRight } from 'lucide-react';

export const Demo: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Step 1: RETAIN single memory');

  const handleStep1Retain = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      await api.addMemory({
        account_id: 'acme-corp',
        interaction_type: 'sales_call',
        fact_type: 'world_fact',
        date: '2026-06-04',
        summary: 'Acme reported an SSO issue during sales call.',
        content: 'Acme expressed concern about pricing and stated SAML SSO is required.',
        sentiment: 'negative',
        importance: 'medium',
        source: 'Salesforce Gong'
      });
      setStep(1);
      setMemoryCount(1);
      setStatusMsg('Step 1: Retained single memory into Hindsight Memory Bank.');
      setBriefing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Recall = async () => {
    setLoading(true);
    try {
      const res = await api.queryCopilot("What problems has Acme had with SSO?", 'acme-corp', 'recall', false);
      setStep(2);
      setStatusMsg('Step 2: Executed Hindsight RECALL (Factual Search across memory bank).');
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Observe = async () => {
    setLoading(true);
    try {
      await api.injectAcmeStage2();
      setStep(3);
      setMemoryCount(5);
      setStatusMsg('Step 3: Consolidated Hindsight Observation formed: "Persistent SSO dissatisfaction".');
      const res = await api.queryCopilot("What observations have consolidated for Acme?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Temporal = async () => {
    setLoading(true);
    try {
      setStep(4);
      setStatusMsg('Step 4: Executed Hindsight Temporal Recall ("How has Acme\'s relationship changed over the last 60 days?").');
      const res = await api.queryCopilot("How has Acme's relationship changed over the last 60 days?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep5Reflect = async () => {
    setLoading(true);
    try {
      setStep(5);
      setStatusMsg('Step 5: Executed Hindsight REFLECT ("What should I do before the renewal?").');
      const res = await api.queryCopilot("What should I do before the renewal?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep6LearnAndAct = async () => {
    setLoading(true);
    try {
      await api.injectCrossAccountStage3();
      setStep(6);
      setMemoryCount(18);
      setStatusMsg('Step 6 & 7: LEARN & ACT across historical renewal accounts (NorthStar & NovaHealth matched).');
      const res = await api.queryCopilot("Have we seen this pattern before in churned accounts?", 'acme-corp', 'reflect', true);
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
      setStep(6);
      setMemoryCount(res.memories_count || 176);
      setStatusMsg(`Full Hackathon Environment Ready! (${res.memories_count || 176} memories across 8 accounts)`);
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
            <PlayCircle className="w-3.5 h-3.5" /> Full Hindsight Demo Flow
          </div>
          <h1 className="text-3xl font-extrabold">Retain $\rightarrow$ Recall $\rightarrow$ Observe $\rightarrow$ Temporal $\rightarrow$ Reflect $\rightarrow$ Learn $\rightarrow$ Act</h1>
          <p className="text-slate-300 text-sm mt-1">
            Complete demonstration of Hindsight's native memory architecture for the hackathon judges.
          </p>
        </div>

        <button
          onClick={handleLoadFullDataset}
          disabled={loading}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Load Seed Dataset
        </button>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memoryCount} />

      {/* Interactive 7-Step Hackathon Progression Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-bold">
        <button
          onClick={handleStep1Retain}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 1 ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          1. RETAIN
        </button>

        <button
          onClick={handleStep2Recall}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 2 ? 'bg-emerald-600 text-white border-emerald-500 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          2. RECALL
        </button>

        <button
          onClick={handleStep3Observe}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 3 ? 'bg-amber-600 text-white border-amber-500 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          3. OBSERVE
        </button>

        <button
          onClick={handleStep4Temporal}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 4 ? 'bg-amber-700 text-white border-amber-600 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          4. TEMPORAL
        </button>

        <button
          onClick={handleStep5Reflect}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 5 ? 'bg-purple-600 text-white border-purple-500 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          5. REFLECT
        </button>

        <button
          onClick={handleStep6LearnAndAct}
          disabled={loading}
          className={`p-3 rounded-xl border transition ${step === 6 ? 'bg-rose-600 text-white border-rose-500 shadow' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          6 & 7. LEARN & ACT
        </button>
      </div>

      {/* Current Status Banner */}
      <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{statusMsg}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400">Step {step} of 6</span>
      </div>

      {/* Briefing Output Card */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-medium">Executing Hindsight memory pipeline stage...</p>
        </div>
      ) : briefing ? (
        <CopilotResponseCard briefing={briefing} />
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          Click step 1 through 6 above to execute the complete live Hindsight hackathon demo.
        </div>
      )}
    </div>
  );
};
