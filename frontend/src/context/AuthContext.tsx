import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  workspace_id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company?: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('renewalos_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'user-priya-sharma',
      name: 'Priya Sharma',
      email: 'priya@company.com',
      workspace_id: 'workspace-enterprise-csm'
    };
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('renewalos_token') || 'dev_session_token';
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('renewalos_token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email
          });
          setToken(storedToken);
        } catch (err) {
          console.warn('Session verification failed, using local session state:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.signin({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('renewalos_token', res.access_token);
      localStorage.setItem('renewalos_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, company?: string) => {
    setIsLoading(true);
    try {
      const res = await api.signup({ name, email, password, company });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('renewalos_token', res.access_token);
      localStorage.setItem('renewalos_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('renewalos_token');
    localStorage.removeItem('renewalos_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        signin,
        signup,
        signout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
