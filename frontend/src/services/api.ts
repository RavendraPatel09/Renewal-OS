import axios from 'axios';
import { CustomerAccount, InteractionMemory, BriefingResponse, TemporalStep, KnowledgeGraphData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT bearer token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('renewalos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Health
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Auth
  signup: async (data: { name: string; email: string; password: string; company?: string }) => {
    const res = await apiClient.post('/api/auth/signup', data);
    return res.data;
  },

  signin: async (data: { email: string; password: string }) => {
    const res = await apiClient.post('/api/auth/signin', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/api/auth/me');
    return res.data;
  },

  // Accounts
  getAccounts: async (): Promise<CustomerAccount[]> => {
    const res = await apiClient.get('/api/accounts');
    return res.data;
  },

  getAccount: async (id: string): Promise<CustomerAccount> => {
    const res = await apiClient.get(`/api/accounts/${id}`);
    return res.data;
  },

  getAccountTemporal: async (id: string): Promise<TemporalStep[]> => {
    const res = await apiClient.get(`/api/accounts/${id}/temporal`);
    return res.data;
  },

  getAccountGraph: async (id: string): Promise<KnowledgeGraphData> => {
    const res = await apiClient.get(`/api/accounts/${id}/graph`);
    return res.data;
  },

  getAccountInteractions: async (id: string): Promise<InteractionMemory[]> => {
    const res = await apiClient.get(`/api/accounts/${id}/interactions`);
    return res.data;
  },

  createAccountInteraction: async (accountId: string, data: {
    type: string;
    title: string;
    content: string;
    sentiment?: string;
    importance?: string;
    source?: string;
    fact_type?: string;
    occurred_at?: string;
  }) => {
    const res = await apiClient.post(`/api/accounts/${accountId}/interactions`, data);
    return res.data;
  },

  getAccountCommitments: async (id: string) => {
    const res = await apiClient.get(`/api/accounts/${id}/commitments`);
    return res.data;
  },

  createAccountCommitment: async (accountId: string, data: {
    description: string;
    owner_name?: string;
    status?: string;
    due_date: string;
  }) => {
    const res = await apiClient.post(`/api/accounts/${accountId}/commitments`, data);
    return res.data;
  },

  // Memories & Evolution
  getMemoryEvolution: async (id: string) => {
    const res = await apiClient.get(`/api/memories/evolution/${id}`);
    return res.data;
  },

  getMemories: async (accountId?: string): Promise<InteractionMemory[]> => {
    const res = await apiClient.get('/api/memories', {
      params: { account_id: accountId }
    });
    return res.data;
  },

  addMemory: async (memory: Partial<InteractionMemory>) => {
    const res = await apiClient.post('/api/memories', memory);
    return res.data;
  },

  // Copilot Reasoning
  queryCopilot: async (
    query: string,
    accountId: string = 'acme-corp',
    mode: 'recall' | 'reflect' = 'reflect',
    includeCrossAccount: boolean = false,
    demoStage?: number
  ): Promise<BriefingResponse> => {
    const res = await apiClient.post('/api/copilot/query', {
      query,
      account_id: accountId,
      mode,
      include_cross_account: includeCrossAccount,
      demo_stage: demoStage
    });
    return res.data;
  },

  // Feedback
  submitFeedback: async (data: { rating: string; category?: string; message: string; email?: string }) => {
    const res = await apiClient.post('/api/feedback', data);
    return res.data;
  },

  // Activity Stream / Audit Log
  getActivityEvents: async () => {
    const res = await apiClient.get('/api/activity');
    return res.data;
  },

  // Renewal Brief & Meeting Prep
  getRenewalBrief: async (accountId: string) => {
    const res = await apiClient.get(`/api/accounts/${accountId}/renewal-brief`);
    return res.data;
  },

  getMeetingPrep: async (accountId: string) => {
    const res = await apiClient.get(`/api/accounts/${accountId}/meeting-prep`);
    return res.data;
  },

  addMeetingNotes: async (accountId: string, data: { title: string; date?: string; participants?: string; notes: string }) => {
    const res = await apiClient.post(`/api/accounts/${accountId}/meeting-notes`, data);
    return res.data;
  },

  getObservations: async (accountId: string) => {
    const res = await apiClient.get(`/api/accounts/${accountId}/observations`);
    return res.data;
  },

  // Demo Controls
  resetDemo: async () => {
    const res = await apiClient.post('/api/demo/reset');
    return res.data;
  },

  seedDemo: async () => {
    const res = await apiClient.post('/api/demo/seed');
    return res.data;
  },

  injectAcmeStage2: async () => {
    const res = await apiClient.post('/api/demo/inject-acme-stage2');
    return res.data;
  },

  injectCrossAccountStage3: async () => {
    const res = await apiClient.post('/api/demo/inject-cross-account-stage3');
    return res.data;
  }
};

