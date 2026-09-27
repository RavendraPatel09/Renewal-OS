import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CustomerAccount, InteractionMemory } from '../types';
import { useUI } from '../context/UIContext';
import {
  Search,
  LayoutDashboard,
  Users,
  Compass,
  Layers,
  PlayCircle,
  Settings,
  MessageSquare,
  Sun,
  Moon,
  X,
  Plus,
  ArrowRight,
  Maximize2,
  Minimize2,
  ListFilter,
  Sparkles,
  FileText,
  ShieldAlert,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Accounts' | 'Memories & Insights' | 'Actions';
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<Props> = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  onOpenAddModal
}) => {
  const navigate = useNavigate();
  const { focusMode, toggleFocusMode, density, toggleDensity, setActiveAccountContext } = useUI();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [memories, setMemories] = useState<InteractionMemory[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'Accounts' | 'Memories & Insights' | 'Actions' | 'Navigation'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch real data for search
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);

      api.getAccounts().then(setAccounts).catch(console.error);
      api.getMemories().then(data => setMemories(data.slice(0, 30))).catch(console.error);
    }
  }, [isOpen]);

  // Global keydown handler for ⌘K, /, and Esc
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      // '/' when not in an input/textarea
      if (
        e.key === '/' &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable)
      ) {
        e.preventDefault();
        // open command palette
      }
      // Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Build command items list
  const commandItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [];

    // 1. Navigation items
    items.push(
      {
        id: 'nav-dashboard',
        category: 'Navigation',
        label: 'Overview Dashboard',
        sublabel: 'Portfolio overview, spatial memory map, and activity stream',
        icon: LayoutDashboard,
        action: () => { navigate('/dashboard'); onClose(); }
      },
      {
        id: 'nav-accounts',
        category: 'Navigation',
        label: 'Accounts Portfolio',
        sublabel: 'Full customer accounts directory and renewal risk',
        icon: Users,
        action: () => { navigate('/accounts'); onClose(); }
      },
      {
        id: 'nav-copilot',
        category: 'Navigation',
        label: 'Customer Intelligence Copilot',
        sublabel: 'Query Hindsight memory bank with Recall & Reflect',
        icon: Compass,
        action: () => { navigate('/copilot'); onClose(); }
      },
      {
        id: 'nav-memory',
        category: 'Navigation',
        label: 'Hindsight Memory Bank Explorer',
        sublabel: 'World Facts, Experience Facts, and dynamic Observations',
        icon: Layers,
        action: () => { navigate('/memory'); onClose(); }
      },
      {
        id: 'nav-demo',
        category: 'Navigation',
        label: 'Interactive Hackathon Demo Showcase',
        sublabel: 'Guided 7-stage Hindsight Retain → Recall → Reflect journey',
        icon: PlayCircle,
        badge: 'Interactive',
        action: () => { navigate('/demo'); onClose(); }
      },
      {
        id: 'nav-settings',
        category: 'Navigation',
        label: 'Workspace Settings & Data Rights',
        sublabel: 'Team settings, Hindsight configuration, and GDPR memory purge',
        icon: Settings,
        action: () => { navigate('/settings'); onClose(); }
      },
      {
        id: 'nav-feedback',
        category: 'Navigation',
        label: 'Send Feedback',
        sublabel: 'Provide product notes to the RenewalOS team',
        icon: MessageSquare,
        action: () => { navigate('/feedback'); onClose(); }
      }
    );

    // 2. Real Accounts from Database
    accounts.forEach(acc => {
      items.push({
        id: `account-${acc.id}`,
        category: 'Accounts',
        label: acc.name,
        sublabel: `${acc.plan || acc.tier || 'Enterprise'} • Renewal in ${acc.renewal_days}d • CSM: ${acc.csm_name}`,
        icon: Users,
        badge: acc.risk_level === 'high' ? 'High Risk' : `${acc.status}`,
        action: () => {
          setActiveAccountContext(acc.id);
          navigate(`/accounts/${acc.id}`);
          onClose();
        }
      });
    });

    // 3. Real Memories & Observations
    memories.slice(0, 15).forEach(m => {
      items.push({
        id: `memory-${m.id}`,
        category: 'Memories & Insights',
        label: m.summary || m.content.substring(0, 70),
        sublabel: `${m.account_id} • ${m.interaction_type} • ${m.date || 'Recent'}`,
        icon: m.interaction_type.toLowerCase().includes('observation') ? Sparkles : FileText,
        badge: m.fact_type || m.importance || undefined,
        action: () => {
          setActiveAccountContext(m.account_id);
          navigate(`/accounts/${m.account_id}`);
          onClose();
        }
      });
    });

    // 4. Quick Actions
    items.push(
      {
        id: 'action-add-interaction',
        category: 'Actions',
        label: 'Add Customer Interaction',
        sublabel: 'Log meeting notes, ticket, or QBR for Hindsight retention',
        icon: Plus,
        badge: '⌘N',
        action: () => {
          onClose();
          onOpenAddModal();
        }
      },
      {
        id: 'action-toggle-focus',
        category: 'Actions',
        label: focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode',
        sublabel: 'Collapse secondary chrome and expand workspace surface',
        icon: focusMode ? Minimize2 : Maximize2,
        badge: 'Esc',
        action: () => {
          toggleFocusMode();
          onClose();
        }
      },
      {
        id: 'action-toggle-density',
        category: 'Actions',
        label: `Switch to ${density === 'comfortable' ? 'Compact' : 'Comfortable'} Density`,
        sublabel: 'Adjust UI whitespace across tables, timelines, and memory lists',
        icon: ListFilter,
        badge: density.toUpperCase(),
        action: () => {
          toggleDensity();
          onClose();
        }
      },
      {
        id: 'action-toggle-theme',
        category: 'Actions',
        label: `Switch to ${darkMode ? 'Light' : 'Dark'} Theme`,
        sublabel: 'Toggle application color palette',
        icon: darkMode ? Sun : Moon,
        action: () => {
          setDarkMode(!darkMode);
          onClose();
        }
      },
      {
        id: 'action-copilot-acme',
        category: 'Actions',
        label: "Ask Copilot: 'Should I be concerned about Acme's renewal?'",
        sublabel: 'Multi-memory risk synthesis and open commitments',
        icon: Compass,
        action: () => {
          navigate('/copilot?account=acme-corp');
          onClose();
        }
      }
    );

    return items;
  }, [accounts, memories, focusMode, density, darkMode, navigate, onClose, onOpenAddModal, setDarkMode, toggleDensity, toggleFocusMode, setActiveAccountContext]);

  // Filtered by search query and category
  const filteredItems = useMemo(() => {
    let result = commandItems;

    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(item =>
        item.label.toLowerCase().includes(q) ||
        (item.sublabel && item.sublabel.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }

    return result;
  }, [commandItems, activeCategory, query]);

  // Handle keyboard list navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white flex flex-col max-h-[80vh]"
        >
          {/* Header Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search accounts, memories, actions, or jump anywhere... (↑ ↓ Enter)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-[11px]">
            {[
              { id: 'all', label: 'All' },
              { id: 'Accounts', label: `Accounts (${accounts.length})` },
              { id: 'Memories & Insights', label: 'Memories' },
              { id: 'Actions', label: 'Actions' },
              { id: 'Navigation', label: 'Navigation' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSelectedIndex(0);
                }}
                className={`px-2 py-0.5 rounded-md font-medium transition shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Result List */}
          <div ref={listRef} className="flex-1 p-2 overflow-y-auto space-y-0.5 text-xs">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-1">
                <p className="font-semibold text-slate-600 dark:text-slate-300">No matching records found</p>
                <p className="text-[11px]">Try searching with a customer name, SLA commitment, or action</p>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs font-semibold">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.sublabel && (
                          <p className="text-[10px] text-slate-400 truncate">{item.sublabel}</p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-slate-400">
                      <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 sm:opacity-100">
                        {item.category}
                      </span>
                      <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">↑</kbd>
                <kbd className="px-1 py-0.2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">↓</kbd>
                <span className="ml-0.5">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">↵</kbd>
                <span className="ml-0.5">open</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[10px] font-mono">Hindsight bank live</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
