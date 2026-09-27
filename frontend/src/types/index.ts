export interface CommitmentItem {
  id: string;
  account_id: string;
  description: string;
  owner_name: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'fulfilled' | 'overdue';
}

export interface CustomerAccount {
  id: string;
  name: string;
  tier: string;
  plan?: string;
  renewal_days: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  open_issues_count: number;
  unresolved_promises_count: number;
  recent_sentiment: 'positive' | 'neutral' | 'negative' | 'declining';
  status: 'active' | 'renewed' | 'churned';
  mrr: number;
  csm_name: string;
  commitments?: CommitmentItem[];
  contacts?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_champion?: boolean;
    is_decision_maker?: boolean;
  }>;
}

export interface Observation {
  id: string;
  account_id: string;
  title: string;
  description: string;
  evidence_count: number;
  first_detected: string;
  last_confirmed: string;
  status: string;
  supporting_memory_ids: string[];
}

export interface TemporalStep {
  days_ago: string;
  status_color: string;
  label: string;
  description: string;
  trigger_memory_id?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'account' | 'topic' | 'person' | 'ticket' | 'department';
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface InteractionMemory {
  id: string;
  account_id: string;
  interaction_type: 'sales_call' | 'meeting' | 'qbr' | 'support_ticket' | 'email' | 'product_feedback' | 'renewal_call' | 'internal_note';
  fact_type?: 'world_fact' | 'experience_fact';
  date: string;
  summary: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  importance: 'low' | 'medium' | 'high';
  source: string;
}

export interface BriefingResponse {
  query_mode: 'recall' | 'reflect';
  summary: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  observations: Observation[];
  world_facts: string[];
  experience_facts: string[];
  key_concerns: string[];
  open_promises: string[];
  sentiment_trend: string;
  historical_patterns: string[];
  recommended_action: string;
  supporting_memories: InteractionMemory[];
  bank_mission: string;
  bank_directives: string[];
}
