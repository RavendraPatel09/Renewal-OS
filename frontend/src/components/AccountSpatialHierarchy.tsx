import React from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquare, ShieldAlert, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface Props {
  accountName: string;
  interactionCount: number;
  commitmentCount: number;
  observationCount: number;
  renewalDays: number;
}

export const AccountSpatialHierarchy: React.FC<Props> = ({
  accountName,
  interactionCount,
  commitmentCount,
  observationCount,
  renewalDays
}) => {
  const stages = [
    {
      label: "Customer Anchor",
      value: accountName,
      detail: "Enterprise Account",
      icon: User,
      color: "text-slate-900 dark:text-white",
      bg: "bg-slate-100 dark:bg-slate-800"
    },
    {
      label: "Touchpoints",
      value: `${interactionCount} Retained`,
      detail: "Calls, Tickets, QBRs",
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40"
    },
    {
      label: "Commitments",
      value: `${commitmentCount} Open`,
      detail: "Binding SLAs & Tasks",
      icon: ShieldAlert,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40"
    },
    {
      label: "Observations",
      value: `${observationCount} Consolidated`,
      detail: "Pattern Understanding",
      icon: Sparkles,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40"
    },
    {
      label: "Renewal Target",
      value: `In ${renewalDays} Days`,
      detail: "Strategic Deciding Window",
      icon: Calendar,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40"
    }
  ];

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl shadow-xs overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] gap-2">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <React.Fragment key={idx}>
              <motion.div
                whileHover={{ y: -2 }}
                className="flex-1 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-white dark:hover:bg-slate-800 transition shadow-xs space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-md ${st.bg} ${st.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {st.label}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {st.value}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {st.detail}
                </div>
              </motion.div>

              {idx < stages.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
