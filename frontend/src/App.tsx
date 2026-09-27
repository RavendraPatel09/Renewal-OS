import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { CommandPalette } from './components/CommandPalette';
import { AddInteractionModal } from './components/AddInteractionModal';

import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { AccountDetail } from './pages/AccountDetail';
import { Copilot } from './pages/Copilot';
import { Memory } from './pages/Memory';
import { Demo } from './pages/Demo';
import { Feedback } from './pages/Feedback';
import { Settings } from './pages/Settings';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts (⌘K and / for search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (
        e.key === '/' &&
        !isSearchOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchOpen]);

  // Helper wrapper for protected workspace routes inside AppLayout
  const renderWorkspaceRoute = (children: React.ReactNode) => (
    <ProtectedRoute>
      <AppLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddModal={() => setIsModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      >
        {children}
      </AppLayout>
    </ProtectedRoute>
  );

  return (
    <ToastProvider>
      <AuthProvider>
        <UIProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <Landing />
                      </div>
                    </div>
                  }
                />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected Workspace Routes (wrapped in AppLayout) */}
                <Route
                  path="/dashboard"
                  element={renderWorkspaceRoute(
                    <Dashboard
                      onOpenAddModal={() => setIsModalOpen(true)}
                      onOpenSearch={() => setIsSearchOpen(true)}
                    />
                  )}
                />
                <Route
                  path="/accounts"
                  element={renderWorkspaceRoute(<Accounts />)}
                />
                <Route
                  path="/accounts/:id"
                  element={renderWorkspaceRoute(
                    <AccountDetail onOpenAddModal={() => setIsModalOpen(true)} />
                  )}
                />
                <Route
                  path="/copilot"
                  element={renderWorkspaceRoute(<Copilot />)}
                />
                <Route
                  path="/memory"
                  element={renderWorkspaceRoute(<Memory />)}
                />
                <Route
                  path="/demo"
                  element={renderWorkspaceRoute(<Demo />)}
                />
                <Route
                  path="/feedback"
                  element={renderWorkspaceRoute(<Feedback />)}
                />
                <Route
                  path="/settings"
                  element={renderWorkspaceRoute(
                    <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                  )}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Global Modals & Command Palette */}
              <CommandPalette
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onOpenAddModal={() => setIsModalOpen(true)}
              />

              <AddInteractionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </Router>
        </UIProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
