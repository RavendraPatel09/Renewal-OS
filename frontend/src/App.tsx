import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandMenu } from './components/CommandMenu';
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

  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Navbar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onOpenAddModal={() => setIsModalOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected Workspace Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard onOpenAddModal={() => setIsModalOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <ProtectedRoute>
                      <Accounts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts/:id"
                  element={
                    <ProtectedRoute>
                      <AccountDetail onOpenAddModal={() => setIsModalOpen(true)} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/copilot"
                  element={
                    <ProtectedRoute>
                      <Copilot />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/memory"
                  element={
                    <ProtectedRoute>
                      <Memory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/demo"
                  element={
                    <ProtectedRoute>
                      <Demo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />

            <CommandMenu
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />

            <AddInteractionModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
