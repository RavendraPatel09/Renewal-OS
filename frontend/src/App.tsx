import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
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
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/dashboard" element={<Dashboard onOpenAddModal={() => setIsModalOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountDetail onOpenAddModal={() => setIsModalOpen(true)} />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/demo" element={<Demo />} />

              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

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
    </ToastProvider>
  );
};

export default App;
