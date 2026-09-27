import axios from 'axios';
import { CustomerAccount, InteractionMemory, BriefingResponse } from '../types';

const API_BASE = 'http://localhost:8000';

export const api = {
  getHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  getAccounts: async (): Promise<CustomerAccount[]> => {
    const res = await axios.get(`${API_BASE}/accounts`);
    return res.data;
  },

  getAccount: async (id: string): Promise<CustomerAccount> => {
    const res = await axios.get(`${API_BASE}/accounts/${id}`);
    return res.data;
  },

  getMemories: async (accountId?: string): Promise<InteractionMemory[]> => {
    const res = await axios.get(`${API_BASE}/memories`, {
      params: { account_id: accountId }
    });
    return res.data;
  },

  addMemory: async (memory: Partial<InteractionMemory>) => {
    const res = await axios.post(`${API_BASE}/memories`, memory);
    return res.data;
  },

  queryCopilot: async (
    query: string,
    accountId: string = 'acme-corp',
    includeCrossAccount: boolean = false,
    demoStage?: number
  ): Promise<BriefingResponse> => {
    const res = await axios.post(`${API_BASE}/copilot/query`, {
      query,
      account_id: accountId,
      include_cross_account: includeCrossAccount,
      demo_stage: demoStage
    });
    return res.data;
  },

  resetDemo: async () => {
    const res = await axios.post(`${API_BASE}/demo/reset`);
    return res.data;
  },

  seedDemo: async () => {
    const res = await axios.post(`${API_BASE}/demo/seed`);
    return res.data;
  },

  injectAcmeStage2: async () => {
    const res = await axios.post(`${API_BASE}/demo/inject-acme-stage2`);
    return res.data;
  },

  injectCrossAccountStage3: async () => {
    const res = await axios.post(`${API_BASE}/demo/inject-cross-account-stage3`);
    return res.data;
  }
};
