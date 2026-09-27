import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building, Sun, Moon, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Settings: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  const { showToast } = useToast();
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'appearance' | 'notifications' | 'security'>('profile');

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'priya@company.com');
  const [workspaceName, setWorkspaceName] = useState('Enterprise CSM Workspace');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PS';

  const handleSignOut = () => {
    signout();
    showToast('Signed out', 'Session terminated successfully');
    navigate('/signin');
  };

  const [renewalAlerts, setRenewalAlerts] = useState(true);
  const [memoryUpdates, setMemoryUpdates] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile updated', 'Your profile settings have been saved');
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Workspace saved', 'Workspace name updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Workspace Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your account preferences, appearance, notifications, and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Tabs */}
        <div className="w-full md:w-56 shrink-0 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'workspace', label: 'Workspace', icon: Building },
            { id: 'appearance', label: 'Appearance', icon: Sun },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-subtle'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Tab Content */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-panel">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Profile Settings
              </h3>

              <div className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 rounded-full bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center border-2 border-brand-200 dark:border-brand-800 shadow-sm">
                  {initials}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{name || 'Priya Sharma'}</span>
                  <span className="text-[11px] text-slate-500 block">{email || 'priya@company.com'} • Active Workspace Member</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition"
              >
                Save Profile
              </button>
            </form>
          )}

          {activeTab === 'workspace' && (
            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Workspace Settings
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Workspace Tier</span>
                <p className="text-slate-500 dark:text-slate-400">RenewalOS Enterprise Pro Plan • 1,284 memories retained</p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-subtle transition"
              >
                Save Workspace
              </button>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Appearance Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`p-4 rounded-xl border text-left space-y-2 transition ${
                    !darkMode ? 'border-brand-500 ring-2 ring-brand-500/20 bg-slate-50' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500" />
                  <span className="font-bold text-xs text-slate-900 block">Light Mode</span>
                  <p className="text-[11px] text-slate-500">Sophisticated light-first interface</p>
                </button>

                <button
                  onClick={() => setDarkMode(true)}
                  className={`p-4 rounded-xl border text-left space-y-2 transition ${
                    darkMode ? 'border-brand-500 ring-2 ring-brand-500/20 bg-slate-900' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Moon className="w-6 h-6 text-brand-400" />
                  <span className="font-bold text-xs text-white block">Dark Mode</span>
                  <p className="text-[11px] text-slate-400">Deep neutral dark interface</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Renewal Risk Alerts</span>
                    <span className="text-slate-500 dark:text-slate-400">Notify when an account risk score exceeds 70</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={renewalAlerts}
                    onChange={(e) => setRenewalAlerts(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Memory Ingestion Updates</span>
                    <span className="text-slate-500 dark:text-slate-400">Notify when new interaction memories are stored</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={memoryUpdates}
                    onChange={(e) => setMemoryUpdates(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Security & Sessions
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Active Workspace Session</span>
                <p className="text-slate-500 dark:text-slate-400">Signed in on macOS • Current browser session active</p>
              </div>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-subtle transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out of Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
