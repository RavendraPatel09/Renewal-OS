import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  count: number;
}

export const MemoryGrowthWidget: React.FC<Props> = ({ count }) => {
  const getStage = (c: number) => {
    if (c === 0) return { label: 'Cold Start', desc: 'No memory context', color: 'text-slate-400', progress: 5 };
    if (c < 6) return { label: 'Context', desc: 'Recent interactions logged', color: 'text-amber-500', progress: 35 };
    if (c < 15) return { label: 'Deep Memory', desc: 'Full account timeline grounded', color: 'text-blue-500', progress: 70 };
    return { label: 'Learned Pattern', desc: 'Cross-account intelligence active', color: 'text-emerald-500', progress: 100 };
  };

  const stage = getStage(count);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            Hindsight Intelligence Depth
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Watch the Agent Learn
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{count}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Memories Retained</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className={count === 0 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>0 (Cold)</span>
          <span className={count > 0 && count <= 5 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>5 (Context)</span>
          <span className={count > 5 && count <= 12 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>12 (Deep)</span>
          <span className={count > 12 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>25+ (Learned)</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${stage.progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800/60">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 block">Customer Facts</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(count, 8)}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 block">Open Promises</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{count > 3 ? 2 : 0}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 block">Sentiment Signals</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(count, 6)}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 block">Historical Patterns</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{count > 10 ? 2 : 0}</span>
        </div>
      </div>
    </div>
  );
};
