import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, InteractionMemory, BriefingResponse, TemporalStep, KnowledgeGraphData, RenewalBrief, MeetingPrep } from '../types';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { MemoryGrowthWidget } from '../components/MemoryGrowthWidget';
import { MemoryEvolutionWidget } from '../components/MemoryEvolutionWidget';
import { CustomerKnowledgeGraph } from '../components/CustomerKnowledgeGraph';
import { TemporalEvolutionTimeline } from '../components/TemporalEvolutionTimeline';
import { CopilotResponseCard } from '../components/CopilotResponseCard';
import { Bot, Plus, ArrowLeft, Sparkles, Network, Clock, Database, Layers, UserCheck, ShieldAlert, CheckCircle2, FileText, Users, Calendar, AlertTriangle, Lightbulb } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'evolution' | 'graph' | 'temporal' | 'commitments' | 'timeline'>('evolution');

  // New Pass 3 Modals
  const [renewalBrief, setRenewalBrief] = useState<RenewalBrief | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const [meetingPrep, setMeetingPrep] = useState<MeetingPrep | null>(null);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);

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

  const handleGenerateBriefing = async (mode: 'recall' | 'reflect' = 'reflect') => {
    setLoadingBriefing(true);
    try {
      const res = await api.queryCopilot(`Prepare me for ${account?.name || accountId}'s renewal`, accountId, mode, true);
      setBriefing(res);
      showToast(`Hindsight ${mode.toUpperCase()} Complete`, `Grounded across ${res.supporting_memories?.length || 0} memories`);
    } catch (err) {
      console.error(err);
      showToast('Briefing Failed', 'Could not synthesize copilot analysis', 'error');
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
      showToast('Failed to load brief', 'Could not synthesize renewal brief', 'error');
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
      showToast('Failed to load meeting prep', 'Could not synthesize meeting prep', 'error');
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
      showToast('Meeting Remembered.', 'Saved to DB and indexed into persistent Hindsight memory bank.');
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
    return <div className="p-8 text-center text-slate-500">Loading customer account memory bank...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <NavLink to="/accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Accounts
      </NavLink>

      {/* Account Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{account.name}</h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {account.plan || account.tier}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned CSM: {account.csm_name} • Renewal in <strong className="text-slate-800 dark:text-slate-200">{account.renewal_days} days</strong> • MRR: ${(account.mrr || 50000).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons: Prepare Renewal & Meeting Prep */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenRenewalBrief}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Prepare Renewal
          </button>

          <button
            onClick={handleOpenMeetingPrep}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Prepare for Meeting
          </button>

          <button
            onClick={() => setIsNotesModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Add Meeting Notes
          </button>
        </div>
      </div>

      {/* Memory Growth Bar */}
      <MemoryGrowthWidget count={memories.length} />

      {/* Tab Navigation for Hindsight Concepts */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('evolution')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'evolution'
              ? 'bg-brand-600 text-white shadow-subtle'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Memory Evolution
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'graph'
              ? 'bg-purple-600 text-white shadow-subtle'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Network className="w-4 h-4" /> Knowledge Graph
        </button>

        <button
          onClick={() => setActiveTab('temporal')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'temporal'
              ? 'bg-amber-600 text-white shadow-subtle'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> 60-Day Evolution
        </button>

        <button
          onClick={() => setActiveTab('commitments')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'commitments'
              ? 'bg-emerald-600 text-white shadow-subtle'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Commitments ({account.commitments?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === 'timeline'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-subtle'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Raw Memory Timeline
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'evolution' && (
        <MemoryEvolutionWidget
          observations={evolutionData?.observations || []}
          rawMemories={memories}
          worldFacts={evolutionData?.world_facts || []}
          experienceFacts={evolutionData?.experience_facts || []}
        />
      )}

      {activeTab === 'graph' && (
        <CustomerKnowledgeGraph graphData={graphData} />
      )}

      {activeTab === 'temporal' && (
        <TemporalEvolutionTimeline steps={temporalSteps} />
      )}

      {activeTab === 'commitments' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" /> Account Commitments & Action Items
          </h3>
          <div className="space-y-3">
            {account.commitments && account.commitments.length > 0 ? (
              account.commitments.map((comm) => (
                <div key={comm.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">{comm.description}</span>
                    <span className="text-slate-500 dark:text-slate-400">Owner: {comm.owner_name} • Due: {comm.due_date}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    comm.status === 'overdue' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                    {comm.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No open commitments recorded for this account.</p>
            )}
          </div>
        </div>
      )}

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Memory Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Retained Memories ({memories.length})
            </h2>
            <button
              onClick={onOpenAddModal}
              className="text-xs font-semibold px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition flex items-center gap-1 shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" /> Retain New Memory
            </button>
          </div>

          <MemoryTimeline memories={memories} />
        </div>

        {/* Right: AI Copilot Renewal Intelligence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-500" /> Hindsight Copilot
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateBriefing('recall')}
                disabled={loadingBriefing}
                className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition disabled:opacity-50"
              >
                RECALL
              </button>
              <button
                onClick={() => handleGenerateBriefing('reflect')}
                disabled={loadingBriefing}
                className="text-xs font-semibold px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition disabled:opacity-50"
              >
                REFLECT
              </button>
            </div>
          </div>

          {briefing ? (
            <CopilotResponseCard briefing={briefing} />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle space-y-3">
              <Bot className="w-10 h-10 text-brand-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Trigger Hindsight Recall or Reflect</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click RECALL for factual lookup or REFLECT for deep reasoning over {memories.length} memories.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Renewal Brief Modal */}
      {isBriefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Renewal Brief
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Renewal Preparation Brief: {account.name}
                </h3>
              </div>
              <button
                onClick={() => setIsBriefModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {loadingBrief ? (
              <div className="p-12 text-center text-xs text-slate-400">Synthesizing renewal briefing from memory bank...</div>
            ) : renewalBrief ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Current Context</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{renewalBrief.current_context}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/30 space-y-2">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Key Risks
                    </span>
                    <ul className="space-y-1">
                      {renewalBrief.key_risks.map((r, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-1">
                          <span>•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/30 space-y-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Customer Priorities
                    </span>
                    <ul className="space-y-1">
                      {renewalBrief.customer_priorities.map((p, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-1">
                          <span>•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/30 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Recommended Discussion Points
                  </span>
                  <ul className="space-y-1.5">
                    {renewalBrief.recommended_discussion_points.map((pt, i) => (
                      <li key={i} className="text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <span className="font-bold text-indigo-500">{i + 1}.</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsBriefModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Prep Modal */}
      {isPrepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Calendar className="w-3.5 h-3.5" /> Meeting Prep
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Meeting Briefing: {account.name}
                </h3>
              </div>
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {loadingPrep ? (
              <div className="p-12 text-center text-xs text-slate-400">Synthesizing meeting agenda and context...</div>
            ) : meetingPrep ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/30 space-y-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 block">Recommended Meeting Strategy</span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{meetingPrep.recommended_meeting_strategy}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">What happened since last meeting?</span>
                  <ul className="space-y-1">
                    {meetingPrep.what_happened_since_last_meeting.map((item, i) => (
                      <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block">What to ask?</span>
                    <ul className="space-y-1">
                      {meetingPrep.what_to_ask.map((item, i) => (
                        <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">?</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block">What to follow up on?</span>
                    <ul className="space-y-1">
                      {meetingPrep.what_to_follow_up_on.map((item, i) => (
                        <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Close Meeting Prep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Meeting Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Add Meeting Notes for {account.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notes are stored to database and retained into Hindsight Memory Bank.
                </p>
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeetingNotes} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Technical Sync on SAML SSO"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Action Items
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What was discussed? What commitments or requests were made?"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50"
                >
                  {savingNote ? 'Remembering...' : 'Remember Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
