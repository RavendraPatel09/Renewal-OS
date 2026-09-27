export interface CustomerAccount {
  id: string;
  name: string;
  tier: string;
  renewal_days: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  open_issues_count: number;
  unresolved_promises_count: number;
  recent_sentiment: 'positive' | 'neutral' | 'negative' | 'declining';
  status: 'active' | 'renewed' | 'churned';
  mrr: number;
  csm_name: string;
}

export interface InteractionMemory {
  id: string;
  account_id: string;
  interaction_type: 'sales_call' | 'meeting' | 'qbr' | 'support_ticket' | 'email' | 'product_feedback' | 'renewal_call' | 'internal_note';
  date: string;
  summary: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  importance: 'low' | 'medium' | 'high';
  source: string;
}

export interface BriefingResponse {
  summary: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  key_concerns: string[];
  open_promises: string[];
  sentiment_trend: string;
  historical_patterns: string[];
  recommended_action: string;
  supporting_memories: InteractionMemory[];
}
