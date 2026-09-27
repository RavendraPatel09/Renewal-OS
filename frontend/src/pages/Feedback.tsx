import React, { useState } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Smile, Frown, Meh, Award } from 'lucide-react';
import { useToast } from '../components/Toast';

export const Feedback: React.FC = () => {
  const { showToast } = useToast();
  const [rating, setRating] = useState<'excellent' | 'good' | 'okay' | 'poor'>('excellent');
  const [category, setCategory] = useState('memory_timeline');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      await api.submitFeedback({
        rating,
        category,
        message: feedbackText,
        email: email || undefined
      });
      setSubmitted(true);
      showToast('Feedback submitted', 'Thank you for helping us refine RenewalOS');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to submit feedback.';
      setError(msg);
      showToast('Submission failed', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-500/20">
          <MessageSquare className="w-3.5 h-3.5" /> Workspace Product Feedback
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Help us improve RenewalOS</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Share your experience with the customer memory layer, copilot reasoning, and workflow design.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-panel">
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thank you for your feedback!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your feedback has been saved directly to the database to inform future memory engine iterations.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFeedbackText('');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Submit another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Experience Rating */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                How was your experience with RenewalOS today?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'excellent', label: 'Excellent', icon: Award, color: 'text-emerald-500' },
                  { id: 'good', label: 'Good', icon: Smile, color: 'text-brand-500' },
                  { id: 'okay', label: 'Okay', icon: Meh, color: 'text-amber-500' },
                  { id: 'poor', label: 'Poor', icon: Frown, color: 'text-rose-500' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = rating === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRating(item.id as any)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 border-brand-500 ring-2 ring-brand-500/20 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-[11px] font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature Category */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Feature Area
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="memory_timeline">Memory Timeline & Ingestion</option>
                <option value="copilot">AI Renewal Copilot & Reasoning</option>
                <option value="account_detail">Account Intelligence Dashboard</option>
                <option value="ui_performance">UI Polish & Performance</option>
              </select>
            </div>

            {/* Feedback Content */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                What can we improve?
              </label>
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share specific suggestions, memory recall accuracy notes, or UI feedback..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Email Optional */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@company.com"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting to database...' : 'Send Feedback'} <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
