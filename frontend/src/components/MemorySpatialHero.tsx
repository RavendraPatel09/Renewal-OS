import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Database, Zap, Sparkles, ShieldAlert, ArrowUpRight, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  accountName?: string;
  memoryCount?: number;
  openIssues?: number;
  onExploreMemory?: () => void;
}

export const MemorySpatialHero: React.FC<Props> = ({
  accountName = "Acme Corp",
  memoryCount = 18,
  openIssues = 2,
  onExploreMemory
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking with spring damping
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800/90 shadow-panel p-5 sm:p-6 perspective-1000 select-none"
    >
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              Spatial Memory Architecture
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live interconnected knowledge state for active portfolio accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hindsight Bank: <strong className="text-slate-700 dark:text-slate-300">Active</strong></span>
        </div>
      </div>

      {/* 3D Interactive Spatial Canvas */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative py-6 sm:py-8 flex items-center justify-center min-h-[220px]"
      >
        {/* Subtle Spatial Connecting SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30">
          <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-slate-400 dark:text-slate-600" />
          <line x1="75%" y1="35%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-slate-400 dark:text-slate-600" />
          <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-slate-400 dark:text-slate-600" />
          <line x1="70%" y1="75%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-slate-400 dark:text-slate-600" />
        </svg>

        {/* Node 1: Top Left - World Fact */}
        <motion.div
          style={{ transform: "translateZ(30px)" }}
          whileHover={{ scale: 1.05, transform: "translateZ(45px)" }}
          className="absolute top-2 left-4 sm:left-12 p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs text-xs space-y-1 w-44 card-3d-interactive cursor-default"
        >
          <div className="flex items-center justify-between text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> World Fact</span>
            <span>Durable</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            Enterprise Tier • 450 Active Users
          </p>
          <span className="text-[9px] text-slate-400 font-mono block">Okta SAML SSO Requirement</span>
        </motion.div>

        {/* Node 2: Top Right - Experience Fact */}
        <motion.div
          style={{ transform: "translateZ(25px)" }}
          whileHover={{ scale: 1.05, transform: "translateZ(40px)" }}
          className="absolute top-2 right-4 sm:right-12 p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs text-xs space-y-1 w-44 card-3d-interactive cursor-default"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-slate-600 dark:text-slate-300" /> Experience</span>
            <span>Support</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            Ticket #4821 Escalated
          </p>
          <span className="text-[9px] text-slate-400 font-mono block">Token timeout on login</span>
        </motion.div>

        {/* Central Core: Active Account Brain Object */}
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          whileHover={{ scale: 1.04, transform: "translateZ(65px)" }}
          className="relative z-20 p-4 sm:p-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-panel border border-slate-800 dark:border-slate-200 text-center space-y-1.5 w-52 sm:w-56 card-3d-interactive"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-600 block">
            Memory Anchor
          </span>
          <h3 className="text-sm font-extrabold tracking-tight">
            {accountName}
          </h3>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono pt-1">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-100 text-slate-200 dark:text-slate-800 font-bold">
              {memoryCount} Memories
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 dark:text-rose-700 font-bold">
              {openIssues} Open Risks
            </span>
          </div>
        </motion.div>

        {/* Node 3: Bottom Left - Consolidated Observation */}
        <motion.div
          style={{ transform: "translateZ(35px)" }}
          whileHover={{ scale: 1.05, transform: "translateZ(50px)" }}
          className="absolute bottom-2 left-4 sm:left-14 p-3 bg-white/95 dark:bg-slate-900/95 border border-amber-200 dark:border-amber-900/60 rounded-xl shadow-xs text-xs space-y-1 w-44 card-3d-interactive cursor-default"
        >
          <div className="flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Observation</span>
            <span>Pattern</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            Persistent SSO Friction
          </p>
          <span className="text-[9px] text-slate-400 font-mono block">5 Linked Evidence IDs</span>
        </motion.div>

        {/* Node 4: Bottom Right - Grounded Action / Renewal Brief */}
        <motion.div
          style={{ transform: "translateZ(30px)" }}
          whileHover={{ scale: 1.05, transform: "translateZ(45px)" }}
          className="absolute bottom-2 right-4 sm:right-14 p-3 bg-white/95 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-900/60 rounded-xl shadow-xs text-xs space-y-1 w-44 card-3d-interactive cursor-default"
        >
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Grounded Action</span>
            <span>Decide</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            VP Engineering Sync
          </p>
          <span className="text-[9px] text-slate-400 font-mono block">Patch timeline before renewal</span>
        </motion.div>
      </motion.div>

      {/* Footer Info Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
        <span className="text-[10px] text-slate-400">
          Spatial interaction: Move pointer to explore relationship depth
        </span>
        {onExploreMemory && (
          <button
            onClick={onExploreMemory}
            className="font-bold text-slate-900 dark:text-white hover:underline inline-flex items-center gap-1 text-[11px]"
          >
            Open Memory Explorer <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
