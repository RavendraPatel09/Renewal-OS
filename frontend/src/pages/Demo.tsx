import React, { useState } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import {
  PlayCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Database,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Bot,
  Layers,
  ShieldAlert,
  Lightbulb,
  FilePlus,
  HelpCircle,
  Eye
} from 'lucide-react';
import { useToast } from '../components/Toast';

export const Demo: React.FC = () => {
  const { showToast } = useToast();
  const [scene, setScene] = useState<number>(1);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Scene 1: Cold start — limited context available.');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Scene Descriptions
  const sceneMeta = [
    {
      number: 1,
      title: "Start With Almost No Context",
      tagline: "Cold start baseline with limited memory",
      desc: "Before interactions are logged, the agent has no memory. Answers are cautious and indicate lack of context."
    },
    {
      number: 2,
      title: "The Agent Remembers",
      tagline: "RECALL factual lookup across memory bank",
      desc: "We retain multiple interactions into Hindsight. A factual lookup query retrieves exact historical records."
    },
    {
      number: 3,
      title: "Memory Becomes Understanding",
      tagline: "Consolidated Hindsight Observations",
      desc: "Repeated raw memories coalesce into a consolidated Observation backed by concrete memory IDs."
    },
    {
      number: 4,
      title: "The Agent Understands Change",
      tagline: "60-Day Temporal Evolution Recall",
      desc: "Temporal retrieval surfaces how health shifted over time (Kickoff 🟢 $\rightarrow$ Ticket #4821 🟡 $\rightarrow$ QBR Promise 🟠 $\rightarrow$ Overdue 🔴)."
    },
    {
      number: 5,
      title: "The Agent Reasons",
      tagline: "REFLECT deep multi-memory synthesis",
      desc: "The agent synthesizes observations, open commitments, and cross-account historical churn patterns."
    },
    {
      number: 6,
      title: "The Agent Acts",
      tagline: "Evidence-backed recommendation & commitments",
      desc: "Generates grounded action: address overdue SAML SSO commitment before negotiating commercial terms."
    },
    {
      number: 7,
      title: "The Loop Continues",
      tagline: "New interaction updates future intelligence",
      desc: "Add a new customer interaction. Future Copilot reasoning immediately adapts with updated memory context."
    }
  ];

  // Scene Execution Handlers
  const handleScene1ColdStart = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      setScene(1);
      setMemoryCount(0);
      setStatusMsg('Scene 1: Account initialized with zero memories. Copilot reports cold start context.');
      const res = await api.queryCopilot("What should I do about Acme?", 'acme-corp', 'reflect', false, 1);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene2Remember = async () => {
    setLoading(true);
    try {
      await api.addMemory({
        account_id: 'acme-corp',
        interaction_type: 'support_ticket',
        fact_type: 'world_fact',
        date: '2026-07-02',
        summary: 'Ticket #4821 logged: Okta SAML SSO token authentication failure.',
        content: 'Customer reported recurring SAML SSO login timeouts affecting 450 engineering users.',
        sentiment: 'negative',
        importance: 'high',
        source: 'Zendesk'
      });
      await api.addMemory({
        account_id: 'acme-corp',
        interaction_type: 'qbr',
        fact_type: 'experience_fact',
        date: '2026-07-18',
        summary: 'QBR: CSM promised dedicated SAML v2.4 engineering patch by Q3.',
        content: 'Product & CSM lead committed to releasing SAML v2.4 fix before end of quarter.',
        sentiment: 'neutral',
        importance: 'high',
        source: 'Zoom Notes'
      });
      setScene(2);
      setMemoryCount(2);
      setStatusMsg('Scene 2: Retained 2 memories. Executing Hindsight RECALL ("What problems has Acme experienced?").');
      const res = await api.queryCopilot("What problems has Acme experienced with SSO?", 'acme-corp', 'recall', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene3Observe = async () => {
    setLoading(true);
    try {
      await api.injectAcmeStage2();
      setScene(3);
      setMemoryCount(5);
      setStatusMsg('Scene 3: 5 memories consolidated into Hindsight Observation ("Persistent SSO dissatisfaction").');
      const res = await api.queryCopilot("What observations have consolidated for Acme?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene4Temporal = async () => {
    setLoading(true);
    try {
      setScene(4);
      setStatusMsg('Scene 4: Executing Hindsight Temporal Recall ("What changed over the last 60 days?").');
      const res = await api.queryCopilot("What changed over the last 60 days for Acme?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene5Reflect = async () => {
    setLoading(true);
    try {
      setScene(5);
      setStatusMsg('Scene 5: Executing Hindsight REFLECT ("What should I do before the renewal?").');
      const res = await api.queryCopilot("What should I do before the renewal?", 'acme-corp', 'reflect', false);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene6Act = async () => {
    setLoading(true);
    try {
      await api.injectCrossAccountStage3();
      setScene(6);
      setMemoryCount(18);
      setStatusMsg('Scene 6: Cross-account pattern matched (NorthStar & NovaHealth). Grounded action synthesized.');
      const res = await api.queryCopilot("Have we seen this pattern before in churned accounts?", 'acme-corp', 'reflect', true);
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScene7LoopContinues = async () => {
    setLoading(true);
    try {
      // Ingest new executive sync interaction
      await api.addMemory({
        account_id: 'acme-corp',
        interaction_type: 'meeting',
        fact_type: 'experience_fact',
        date: '2026-08-15',
        summary: 'Emergency VP Sync: Engineering committed binding hotfix release on Aug 20.',
        content: 'VP Engineering confirmed SAML v2.4 patch will be deployed to staging on Aug 18, resolving ticket #4821 and #5102.',
        sentiment: 'positive',
        importance: 'high',
        source: 'Executive Sync Notes'
      });
      setScene(7);
      setMemoryCount((prev) => prev + 1);
      setStatusMsg('Scene 7: New interaction retained! Refreshed REFLECT query now reflects binding Aug 20 fix.');
      const res = await api.queryCopilot("What is the latest status and next action for Acme's renewal?", 'acme-corp', 'reflect', true);
      setBriefing(res);
      showToast('Memory Loop Updated', 'New touchpoint influenced future reasoning.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (scene === 1) handleScene2Remember();
    else if (scene === 2) handleScene3Observe();
    else if (scene === 3) handleScene4Temporal();
    else if (scene === 4) handleScene5Reflect();
    else if (scene === 5) handleScene6Act();
    else if (scene === 6) handleScene7LoopContinues();
  };

  const handlePrevStep = () => {
    if (scene === 7) handleScene6Act();
    else if (scene === 6) handleScene5Reflect();
    else if (scene === 5) handleScene4Temporal();
    else if (scene === 4) handleScene3Observe();
    else if (scene === 3) handleScene2Remember();
    else if (scene === 2) handleScene1ColdStart();
  };

  const handleLoadFullDataset = async () => {
    setLoading(true);
    try {
      const res = await api.seedDemo();
      setScene(6);
      setMemoryCount(res.memories_count || 176);
      setStatusMsg(`Full Hackathon Dataset Loaded (${res.memories_count || 176} memories across 8 accounts).`);
      showToast('Dataset Seeded', `${res.memories_count || 176} memories active in Hindsight Memory Bank.`);
      const bRes = await api.queryCopilot("What should I do before Acme's renewal?", 'acme-corp', 'reflect', true);
      setBriefing(bRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      setScene(1);
      setMemoryCount(0);
      setBriefing(null);
      setStatusMsg('Demo memory bank reset cleanly. Ready for scenario run.');
      setIsResetModalOpen(false);
      showToast('Demo Reset', 'Demo memory bank cleared.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = sceneMeta[scene - 1];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-panel border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
              <PlayCircle className="w-3.5 h-3.5" /> Hackathon Demo Walkthrough
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Remember Every Customer. Learn From Every Renewal.
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Step through the 7-scene Hindsight demonstration showing the live loop: <strong>Retain $\rightarrow$ Recall $\rightarrow$ Observe $\rightarrow$ Temporal $\rightarrow$ Reflect $\rightarrow$ Act $\rightarrow$ Learn Again</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
            </button>

            <button
              onClick={handleLoadFullDataset}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Full Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memoryCount} />

      {/* 7-Scene Progression Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-bold">
        {[
          { id: 1, label: '1. Cold Start', fn: handleScene1ColdStart },
          { id: 2, label: '2. RECALL', fn: handleScene2Remember },
          { id: 3, label: '3. OBSERVE', fn: handleScene3Observe },
          { id: 4, label: '4. TEMPORAL', fn: handleScene4Temporal },
          { id: 5, label: '5. REFLECT', fn: handleScene5Reflect },
          { id: 6, label: '6. ACT', fn: handleScene6Act },
          { id: 7, label: '7. LEARN AGAIN', fn: handleScene7LoopContinues }
        ].map((item) => (
          <button
            key={item.id}
            onClick={item.fn}
            disabled={loading}
            className={`p-2.5 rounded-xl border text-[11px] transition ${
              scene === item.id
                ? 'bg-brand-600 text-white border-brand-500 shadow-md ring-2 ring-brand-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Scene Explanation Card with Navigation */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Scene {scene} of 7 • {currentMeta.tagline}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentMeta.title}
            </h3>
          </div>

          {/* Previous / Next Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={scene === 1 || loading}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Scene
            </button>
            <button
              onClick={handleNextStep}
              disabled={scene === 7 || loading}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1"
            >
              Next Scene <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentMeta.desc}
        </p>

        {/* Live Status Message */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{statusMsg}</span>
        </div>
      </div>

      {/* Copilot Response Display */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Executing Hindsight memory pipeline stage...</p>
          <span className="text-[11px] text-slate-400">Processing persistent memory bank synthesis</span>
        </div>
      ) : briefing ? (
        <CopilotResponseCard briefing={briefing} />
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          Click any scene above or "Load Full Dataset" to run the live Hindsight demo.
        </div>
      )}

      {/* "Why Hindsight?" Judge Explainer Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Why Hindsight? Traditional DB vs Persistent Memory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-300 block">Traditional Database</span>
            <p className="text-slate-400 leading-relaxed">
              Stores raw static records (rows in PostgreSQL, tickets in Zendesk). Cannot reason about customer shifts or synthesize observations over time.
            </p>
          </div>

          <div className="p-4 bg-brand-950/40 rounded-xl border border-brand-800/60 space-y-1.5">
            <span className="font-bold text-brand-300 block">Hindsight Memory Bank</span>
            <p className="text-slate-300 leading-relaxed">
              Remembers customer experience. Classifies World vs Experience facts, consolidates high-level Observations, and performs Temporal Recall.
            </p>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1.5">
            <span className="font-bold text-emerald-300 block">RenewalOS Agent</span>
            <p className="text-slate-300 leading-relaxed">
              Uses persistent memory to reason about what happens next. Grounded recommendations, open promises, and cross-account learning.
            </p>
          </div>
        </div>
      </div>

      {/* Safe Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reset Demo Scenario?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will safely clear only the demo memory bank cache for fresh scenario walkthroughs. Your production account records will remain intact.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
