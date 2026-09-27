import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, InteractionMemory, BriefingResponse, TemporalStep, KnowledgeGraphData, RenewalBrief, MeetingPrep } from '../types';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { MemoryEvolutionWidget } from '../components/MemoryEvolutionWidget';
import { CustomerKnowledgeGraph } from '../components/CustomerKnowledgeGraph';
import { TemporalEvolutionTimeline } from '../components/TemporalEvolutionTimeline';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { ArrowLeft, Sparkles, Compass, Plus, Calendar, FileText, ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, ChevronRight, Layers, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';

interface Props {
  onOpenAddModal: () => void;
}

export const AccountDetail: React.FC<Props> = ({ onOpenAddModal }) => {
  const { id } = useParams<{ id: string }>();
  const accountId = id || 'acme-corp';
  const { showToast } = useToast();

  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [temporalSteps, setTemporalSteps] = useState<TemporalStep[]>([]);
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], links: [] });
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'evolution' | 'temporal' | 'graph'>('timeline');

  // Briefing Modals
  const [renewalBrief, setRenewalBrief] = useState<RenewalBrief | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const [meetingPrep, setMeetingPrep] = useState<MeetingPrep | null>(null);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);

  // Meeting Notes Form Modal
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [noteParticipants, setNoteParticipants] = useState('Priya Sharma, VP Engineering');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadData = () => {
    api.getAccount(accountId).then(setAccount).catch(console.error);
    api.getAccountInteractions(accountId).then(setMemories).catch(console.error);
    api.getAccountTemporal(accountId).then(setTemporalSteps).catch(console.error);
    api.getAccountGraph(accountId).then(setGraphData).catch(console.error);
    api.getMemoryEvolution(accountId).then(setEvolutionData).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [accountId]);

  const handleGenerateCopilot = async (mode: 'recall' | 'reflect' = 'reflect') => {
    setLoadingBriefing(true);
    try {
      const res = await api.queryCopilot(`Prepare me for ${account?.name || accountId}'s renewal`, accountId, mode, true);
      setBriefing(res);
      showToast(`Hindsight ${mode.toUpperCase()} Complete`, `Grounded across ${res.supporting_memories?.length || 0} memories`);
    } catch (err) {
      console.error(err);
      showToast('Error', 'Could not generate copilot response', 'error');
    } finally {
      setLoadingBriefing(false);
    }
  };

  const handleOpenRenewalBrief = async () => {
    setLoadingBrief(true);
    setIsBriefModalOpen(true);
    try {
      const data = await api.getRenewalBrief(accountId);
      setRenewalBrief(data);
    } catch (err) {
      console.error(err);
      showToast('Error', 'Could not generate renewal brief', 'error');
    } finally {
      setLoadingBrief(false);
    }
  };

  const handleOpenMeetingPrep = async () => {
    setLoadingPrep(true);
    setIsPrepModalOpen(true);
    try {
      const data = await api.getMeetingPrep(accountId);
      setMeetingPrep(data);
    } catch (err) {
      console.error(err);
      showToast('Error', 'Could not generate meeting prep', 'error');
    } finally {
      setLoadingPrep(false);
    }
  };

  const handleSaveMeetingNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    setSavingNote(true);
    try {
      await api.addMeetingNotes(accountId, {
        title: noteTitle,
        date: noteDate,
        participants: noteParticipants,
        notes: noteContent
      });
      showToast('Meeting Remembered.', 'Saved to database and retained into Hindsight memory bank.');
      setNoteTitle('');
      setNoteContent('');
      setIsNotesModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error', 'Failed to store meeting note', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  if (!account) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading customer memory...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-6 max-w-5xl pb-12"
    >
      {/* Back Link */}
      <NavLink
        to="/accounts"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Accounts
      </NavLink>

      {/* Account Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {account.name}
            </h1>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {account.plan || account.tier}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned CSM: {account.csm_name} • Renewal in <strong className="text-slate-800 dark:text-slate-200">{account.renewal_days} days</strong> • MRR: ${(account.mrr || 50000).toLocaleString()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenRenewalBrief}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Prepare Renewal
          </button>

          <button
            onClick={handleOpenMeetingPrep}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Prepare for Meeting
          </button>

          <button
            onClick={() => setIsNotesModalOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Add Meeting Notes
          </button>
        </div>
      </div>

      {/* Customer Evolution & Commitments Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{account.status}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              account.risk_level === 'high' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
            }`}>
              Risk {account.risk_score}/100
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Open Commitments</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {account.unresolved_promises_count > 0 ? `${account.unresolved_promises_count} Overdue` : '0 Pending'}
            </span>
            <span className="text-xs text-slate-400 font-medium">{account.commitments?.length || 0} total</span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Retained Memories</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{memories.length} Ingested</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Memory Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for View Modes */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 text-xs font-medium">
        {[
          { id: 'timeline', label: `Timeline (${memories.length})` },
          { id: 'evolution', label: 'Observation Explorer' },
          { id: 'temporal', label: '60-Day Evolution' },
          { id: 'graph', label: 'Entity Graph' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs transition ${
              activeTab === tab.id
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Viewport */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Memory Timeline
              </span>
              <button
                onClick={onOpenAddModal}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add memory
              </button>
            </div>
            <MemoryTimeline memories={memories} />
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Copilot Analysis
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleGenerateCopilot('recall')}
                  disabled={loadingBriefing}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] font-semibold transition"
                >
                  Recall
                </button>
                <button
                  onClick={() => handleGenerateCopilot('reflect')}
                  disabled={loadingBriefing}
                  className="px-2 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-[11px] font-semibold transition"
                >
                  Reflect
                </button>
              </div>
            </div>

            {briefing ? (
              <CopilotResponseCard briefing={briefing} />
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
                <Compass className="w-6 h-6 text-slate-400 mx-auto" />
                <p>Click Recall or Reflect to synthesize intelligence over {memories.length} customer memories.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <MemoryEvolutionWidget
          observations={evolutionData?.observations || []}
          rawMemories={memories}
          worldFacts={evolutionData?.world_facts || []}
          experienceFacts={evolutionData?.experience_facts || []}
        />
      )}

      {activeTab === 'temporal' && (
        <TemporalEvolutionTimeline steps={temporalSteps} />
      )}

      {activeTab === 'graph' && (
        <CustomerKnowledgeGraph graphData={graphData} />
      )}

      {/* Renewal Brief Modal Drawer */}
      {isBriefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-xl text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Grounded Intelligence</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Renewal Brief: {account.name}
                </h3>
              </div>
              <button
                onClick={() => setIsBriefModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            {loadingBrief ? (
              <div className="p-12 text-center text-slate-400">Synthesizing renewal brief...</div>
            ) : renewalBrief ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Current Context</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{renewalBrief.current_context}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">Key Risks</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {renewalBrief.key_risks.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Customer Priorities</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {renewalBrief.customer_priorities.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Recommended Discussion Points</span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {renewalBrief.recommended_discussion_points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-brand-600 dark:text-brand-400">{i + 1}.</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsBriefModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Prep Modal Drawer */}
      {isPrepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-xl text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Meeting Preparation</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Meeting Briefing: {account.name}
                </h3>
              </div>
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            {loadingPrep ? (
              <div className="p-12 text-center text-slate-400">Synthesizing meeting strategy...</div>
            ) : meetingPrep ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <span className="font-bold text-brand-600 dark:text-brand-400 block">Recommended Meeting Strategy</span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{meetingPrep.recommended_meeting_strategy}</p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">What happened since last meeting?</span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {meetingPrep.what_happened_since_last_meeting.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">What to ask?</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {meetingPrep.what_to_ask.map((item, i) => (
                        <li key={i}>? {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">What to follow up on?</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {meetingPrep.what_to_follow_up_on.map((item, i) => (
                        <li key={i}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Meeting Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Meeting Notes for {account.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Notes are saved to the database and retained into the persistent memory bank.
                </p>
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeetingNotes} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Executive Sync on SAML SSO"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Participants
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma, Alex Chen"
                    value={noteParticipants}
                    onChange={(e) => setNoteParticipants(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Discussion
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What was discussed? What commitments or requests were made?"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg text-xs transition disabled:opacity-50"
                >
                  {savingNote ? 'Remembering...' : 'Remember Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
