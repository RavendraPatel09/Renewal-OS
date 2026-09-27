import React from 'react';
import { KnowledgeGraphData } from '../types';
import { Network, Database } from 'lucide-react';

interface Props {
  graphData: KnowledgeGraphData;
}

export const CustomerKnowledgeGraph: React.FC<Props> = ({ graphData }) => {
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        No entity graph nodes available.
      </div>
    );
  }

  const getNodeBadge = (type: string) => {
    switch (type) {
      case 'account': return 'bg-indigo-600 text-white font-bold';
      case 'topic': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      case 'person': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      case 'ticket': return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
      default: return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
            Hindsight Entity Graph Memory
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-500" /> Customer Knowledge Graph
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{graphData.nodes.length} entities connected</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
        {graphData.nodes.map((node) => (
          <div
            key={node.id}
            className={`p-3 rounded-xl shadow-xs transition hover:scale-105 flex flex-col justify-between space-y-1 ${getNodeBadge(node.type)}`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold block">{node.type}</span>
            <span className="text-xs font-bold leading-tight block">{node.label}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Entity Relationships & Traversals</span>
        <div className="flex flex-wrap gap-2">
          {graphData.links.map((link, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <strong className="text-indigo-600 dark:text-indigo-400">{link.source}</strong>
              <span className="text-slate-400 font-normal">--[{link.label}]--&gt;</span>
              <strong className="text-slate-900 dark:text-white">{link.target}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
