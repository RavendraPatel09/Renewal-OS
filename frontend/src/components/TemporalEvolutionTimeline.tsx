import React from 'react';
import { TemporalStep } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Props {
  steps: TemporalStep[];
}

export const TemporalEvolutionTimeline: React.FC<Props> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        No temporal memory progression available.
      </div>
    );
  }

  const getStatusBg = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-500 text-white';
      case 'yellow': return 'bg-amber-500 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      case 'red': return 'bg-rose-600 text-white';
      case 'darkred': return 'bg-rose-950 text-white border border-rose-500/50';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Hindsight Temporal Memory Search
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> 60-Day Customer Evolution
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-semibold">Temporal Recall</span>
      </div>

      {/* Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{step.days_ago}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusBg(step.status_color)}`} />
            </div>

            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {step.label}
            </h4>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
