import React, { useState } from 'react';
import { InteractionMemory } from '../types';
import { ChevronDown, ChevronUp, MessageSquare, Phone, Ticket, Mail, FileText, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  memories: InteractionMemory[];
}

export const MemoryTimeline: React.FC<Props> = ({ memories }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!memories || memories.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
        No interaction memories recorded yet.
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales_call':
      case 'call': return <Phone className="w-3.5 h-3.5 text-slate-500" />;
      case 'support_ticket':
      case 'support': return <Ticket className="w-3.5 h-3.5 text-slate-500" />;
      case 'email': return <Mail className="w-3.5 h-3.5 text-slate-500" />;
      case 'qbr': return <FileText className="w-3.5 h-3.5 text-slate-500" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800 select-none">
      {memories.map((mem, idx) => {
        const isExpanded = expandedId === (mem.id || String(idx));
        return (
          <div key={mem.id || idx} className="relative group">
            {/* Timeline Bullet Node */}
            <div className={`absolute -left-[23px] top-2.5 w-3 h-3 rounded-full border-2 transition-colors ${
              mem.sentiment === 'negative'
                ? 'bg-white dark:bg-slate-900 border-rose-500'
                : 'bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-600'
            }`} />

            {/* Timeline Item Card */}
            <div
              onClick={() => toggleExpand(mem.id || String(idx))}
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{mem.date}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {getTypeIcon(mem.interaction_type)}
                    <span className="capitalize">{mem.interaction_type.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {mem.fact_type && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {mem.fact_type}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {mem.summary || mem.content}
              </p>

              {/* Inline Expansion */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs"
                  >
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      "{mem.content}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Source: <strong className="text-slate-600 dark:text-slate-300">{mem.source || 'Manual Entry'}</strong></span>
                      <span className="capitalize">Importance: {mem.importance || 'medium'}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};
