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
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import { useToast } from '../components/Toast';

export const Demo: React.FC = () => {
  const { showToast } = useToast();
  const [scene, setScene] = useState<number>(1);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Scene 1: Cold start — limited baseline context.');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  const sceneMeta = [
    {
      number: 1,
      title: "Cold Start: Baseline Context",
      tagline: "Uninformed baseline without memory",
      desc: "Before touchpoints are retained, the agent has no customer memory. Queries return cautious answers indicating lack of context."
    },
    {
      number: 2,
      title: "Retain & Recall: Factual Search",
      tagline: "Factual search across World & Experience facts",
      desc: "We retain initial support tickets and QBR commitments into Hindsight. A factual RECALL query accurately retrieves exact historical quotes and timestamps."
    },
    {
      number: 3,
      title: "Consolidation: Memory to Observation",
      tagline: "Coalescing related facts into dynamic understanding",
      desc: "Multiple related touchpoints automatically coalesce into a consolidated Observation ('Persistent SSO dissatisfaction') linked directly to supporting memory IDs."
    },
    {
      number: 4,
      title: "Temporal Retrieval: 60-Day Evolution",
      tagline: "Understanding customer trajectory over time",
      desc: "Temporal recall surfaces how account health shifted over the last 60 days (Kickoff [Healthy] → Ticket #4821 [Issue] → QBR Promise [Pending] → Overdue [Critical])."
    },
    {
      number: 5,
      title: "Multi-Memory Synthesis: REFLECT",
      tagline: "Deep reasoning across memories and commitments",
      desc: "The agent synthesizes open commitments, key objections, and timeline dependencies to reason about the upcoming renewal."
    },
    {
      number: 6,
      title: "Grounded Action: Cross-Account Learning",
      tagline: "Comparing active risks against historical churn playbooks",
      desc: "Matches Acme's unresolved SSO pattern against historical churned accounts (NorthStar & NovaHealth) to suggest concrete intervention playbooks."
    },
    {
      number: 7,
      title: "The Continuous Loop: Learning Again",
      tagline: "New interaction immediately updates future reasoning",
      desc: "A new VP sync interaction is retained. Subsequent Copilot queries immediately reflect the binding engineering patch without re-prompting."
    }
  ];

  // Execution Handlers
  const handleScene1ColdStart = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      setScene(1);
      setMemoryCount(0);
      setStatusMsg('Scene 1: Memory bank initialized. Copilot reports cold start context.');
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
      setStatusMsg('Scene 2: Retained 2 memories. Executing RECALL query: "What problems has Acme experienced with SSO?".');
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
      setStatusMsg('Scene 6: Cross-account pattern matched against historical churn. Action synthesized.');
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
      setStatusMsg('Scene 7: New interaction retained. Refreshed REFLECT query reflects binding Aug 20 fix.');
      const res = await api.queryCopilot("What is the latest status and next action for Acme's renewal?", 'acme-corp', 'reflect', true);
      setBriefing(res);
      showToast('Continuous Loop Verified', 'New touchpoint updated future Copilot reasoning.');
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
      setStatusMsg(`Full Dataset Active (${res.memories_count || 176} memories across 8 accounts).`);
      showToast('Dataset Seeded', `${res.memories_count || 176} memories loaded into Hindsight bank.`);
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
      setStatusMsg('Demo memory bank reset. Ready for scenario walk-through.');
      setIsResetModalOpen(false);
      showToast('Demo Reset', 'Demo memory bank cleared cleanly.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = sceneMeta[scene - 1];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-slate-900 dark:text-white" />
            Hindsight Demo Walkthrough
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step through the 7-scene demonstration showing how memory transforms raw customer events into strategic renewal intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleLoadFullDataset}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Full Dataset</span>
          </button>
        </div>
      </div>

      {/* Memory Capacity Bar */}
      <MemoryGrowthWidget count={memoryCount} />

      {/* 7-Step Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1">
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
              className={`px-2 py-2 rounded-lg text-xs font-medium transition text-center ${
                scene === item.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Scene Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Scene {scene} of 7 • {currentMeta.tagline}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {currentMeta.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={scene === 1 || loading}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={scene === 7 || loading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 disabled:opacity-40 text-white dark:text-slate-900 text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {currentMeta.desc}
        </p>

        {/* Live Status Message */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
          <span className="font-medium">{statusMsg}</span>
        </div>
      </div>

      {/* Response Display Area */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Running Scene {scene} Hindsight memory pipeline...
          </p>
          <span className="text-[11px] text-slate-400">
            Synthesizing persistent memory bank state
          </span>
        </div>
      ) : briefing ? (
        <CopilotResponseCard briefing={briefing} />
      ) : (
        <div className="p-10 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
          Click any scene step above or "Load Full Dataset" to run the live Hindsight demo.
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reset Demo Scenario?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will clear the demo memory bank cache for fresh scenario walkthroughs.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-md text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md text-xs transition"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
