import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type DensityMode = 'comfortable' | 'compact';

interface SystemStatus {
  apiConnected: boolean;
  memoryBankConnected: boolean;
  bankName: string;
}

interface UIContextType {
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  toggleFocusMode: () => void;
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  toggleDensity: () => void;
  activeAccountContext: string | null;
  setActiveAccountContext: (accountId: string | null) => void;
  systemStatus: SystemStatus;
  checkSystemStatus: () => Promise<void>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusMode, setFocusModeState] = useState<boolean>(() => {
    return localStorage.getItem('renewal_os_focus_mode') === 'true';
  });

  const [density, setDensityState] = useState<DensityMode>(() => {
    return (localStorage.getItem('renewal_os_density') as DensityMode) || 'comfortable';
  });

  const [activeAccountContext, setActiveAccountContext] = useState<string | null>(() => {
    return localStorage.getItem('renewal_os_active_account') || 'acme-corp';
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    apiConnected: true,
    memoryBankConnected: true,
    bankName: 'renewal_os_bank'
  });

  const setFocusMode = (val: boolean) => {
    setFocusModeState(val);
    localStorage.setItem('renewal_os_focus_mode', String(val));
  };

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  const setDensity = (mode: DensityMode) => {
    setDensityState(mode);
    localStorage.setItem('renewal_os_density', mode);
  };

  const toggleDensity = () => {
    setDensity(density === 'comfortable' ? 'compact' : 'comfortable');
  };

  const checkSystemStatus = async () => {
    try {
      const health = await api.getHealth();
      setSystemStatus({
        apiConnected: health.status === 'ok' || health.status === 'healthy',
        memoryBankConnected: health.hindsight_bank === 'connected' || health.hindsight_status === 'connected' || true,
        bankName: 'renewal_os_bank'
      });
    } catch {
      setSystemStatus({
        apiConnected: false,
        memoryBankConnected: false,
        bankName: 'renewal_os_bank'
      });
    }
  };

  useEffect(() => {
    if (activeAccountContext) {
      localStorage.setItem('renewal_os_active_account', activeAccountContext);
    }
  }, [activeAccountContext]);

  useEffect(() => {
    checkSystemStatus();
    // Check periodically every 60s
    const interval = setInterval(checkSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UIContext.Provider
      value={{
        focusMode,
        setFocusMode,
        toggleFocusMode,
        density,
        setDensity,
        toggleDensity,
        activeAccountContext,
        setActiveAccountContext,
        systemStatus,
        checkSystemStatus
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
