import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';

export const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast('Reset instructions sent', `Sent link to ${email}`);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-panel">
        <div className="text-center space-y-2">
          <Logo className="justify-center" size={32} showText={false} />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset your password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your work email address and we'll send reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-6 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Check your email</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We've sent a password reset link to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.
            </p>
            <NavLink to="/signin" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline pt-2">
              <ArrowLeft className="w-4 h-4" /> Return to sign in
            </NavLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send reset link'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <NavLink to="/signin" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </NavLink>
        </div>
      </div>
    </div>
  );
};
