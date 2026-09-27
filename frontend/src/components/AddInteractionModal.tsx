import React, { useState } from 'react';
import { api } from '../services/api';
import { Plus, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountId?: string;
  onSuccess?: () => void;
}

export const AddInteractionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultAccountId = 'acme-corp',
  onSuccess
}) => {
  const { showToast } = useToast();
  const [accountId, setAccountId] = useState(defaultAccountId);
  const [interactionType, setInteractionType] = useState('support');
  const [factType, setFactType] = useState<'world_fact' | 'experience_fact'>('experience_fact');
  const [date, setDate] = useState('2026-08-15');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('negative');
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('high');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please provide a title and interaction description.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await api.createAccountInteraction(accountId, {
        type: interactionType,
        title,
        content,
        sentiment,
        importance,
        source: 'Manual CSM Entry',
        fact_type: factType,
        occurred_at: date
      });

      setSuccessMsg(true);
      showToast('Interaction Retained', `Stored into Hindsight memory bank for ${accountId}`);

      setTimeout(() => {
        setSuccessMsg(false);
        setLoading(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to save interaction.';
      setError(msg);
      showToast('Save Failed', msg, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-500" /> Retain Customer Interaction
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Interaction Retained</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interaction saved to database & retained in Hindsight persistent memory bank.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="acme-corp">Acme Corp</option>
                <option value="northstar-logistics">NorthStar Logistics</option>
                <option value="vantage-retail">Vantage Retail</option>
                <option value="novahealth">NovaHealth</option>
                <option value="bluepeak-systems">BluePeak Systems</option>
                <option value="orbit-finance">Orbit Finance</option>
                <option value="vertex-manufacturing">Vertex Manufacturing</option>
                <option value="summit-commerce">Summit Commerce</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Interaction Type</label>
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="call">Sales / Check-in Call</option>
                  <option value="meeting">Executive Meeting</option>
                  <option value="qbr">QBR Review</option>
                  <option value="support">Support Escalation</option>
                  <option value="email">Customer Email</option>
                  <option value="product_feedback">Product Feedback</option>
                  <option value="renewal">Renewal Discussion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Occurred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Summary Title</label>
              <input
                type="text"
                placeholder="e.g. SSO authentication timeout complaint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Interaction Content & Details</label>
              <textarea
                rows={3}
                placeholder="Details of what the customer expressed, requested, or promised..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sentiment</label>
                <select
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Memory Fact Type</label>
                <select
                  value={factType}
                  onChange={(e) => setFactType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="experience_fact">Experience Fact (Action taken)</option>
                  <option value="world_fact">World Fact (Customer state)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-subtle transition text-xs disabled:opacity-50"
            >
              {loading ? 'Retaining in Hindsight & Saving...' : 'Retain Memory'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
