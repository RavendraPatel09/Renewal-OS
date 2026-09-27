import React from 'react';
import { InteractionMemory } from '../types';
import { Calendar, Tag, ShieldAlert, ArrowUpRight, MessageSquare, Mail, Ticket, Phone, FileText } from 'lucide-react';

interface Props {
  memories: InteractionMemory[];
}

export const MemoryTimeline: React.FC<Props> = ({ memories }) => {
  if (!memories || memories.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        No interaction memories stored yet. Click "+ Add Interaction" to log memories into Hindsight.
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales_call': return <Phone className="w-4 h-4 text-blue-500" />;
      case 'support_ticket': return <Ticket className="w-4 h-4 text-red-500" />;
      case 'email': return <Mail className="w-4 h-4 text-amber-500" />;
      case 'qbr': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Positive</span>;
      case 'negative':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400">Negative</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400">Neutral</span>;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {memories.map((mem, i) => (
        <div key={mem.id || i} className="relative group">
          {/* Dot */}
          <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition duration-150 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {getTypeIcon(mem.interaction_type)}
                {mem.interaction_type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {mem.date}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {mem.summary}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              "{mem.content}"
            </p>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-2">
                {getSentimentBadge(mem.sentiment)}
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 capitalize">Importance: {mem.importance}</span>
              </div>
              <span className="text-slate-400 italic">Source: {mem.source}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
