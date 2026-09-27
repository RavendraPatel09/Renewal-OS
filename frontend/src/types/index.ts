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

export interface EvolutionStage {
  date: string;
  label: string;
  detail: string;
  memory_id?: string;
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
  agent_understanding?: string;
  suggested_action?: string;
  conflicting_evidence?: string;
  related_entities?: string[];
  evolution_stages?: EvolutionStage[];
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

export interface MemoryTraceStep {
  step: string;
  description: string;
  status: string;
}

export interface BriefingResponse {
  query_mode: 'recall' | 'reflect';
  summary: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  key_signals?: string[];
  observations: Observation[];
  world_facts: string[];
  experience_facts: string[];
  key_concerns: string[];
  open_promises: string[];
  open_commitments?: Array<{ description: string; status: string; owner?: string; due_date?: string }>;
  sentiment_trend: string;
  historical_patterns: string[];
  recommended_action: string;
  recommended_next_steps?: string[];
  uncertainty?: string;
  memory_trace?: MemoryTraceStep[];
  supporting_memories: InteractionMemory[];
  bank_mission: string;
  bank_directives: string[];
}

export interface RenewalBrief {
  account_id: string;
  account_name: string;
  renewal_date: string;
  days_until_renewal: number;
  current_context: string;
  key_risks: string[];
  open_commitments: Array<{ description: string; owner: string; status: string; due_date: string }>;
  customer_priorities: string[];
  what_changed_recently: string[];
  relevant_observations: Observation[];
  recommended_discussion_points: string[];
  supporting_evidence_count: number;
}

export interface MeetingPrep {
  account_id: string;
  account_name: string;
  what_happened_since_last_meeting: string[];
  what_to_ask: string[];
  what_to_follow_up_on: string[];
  unresolved_issues_to_address: string[];
  customer_priorities_now: string[];
  recommended_meeting_strategy: string;
}

export interface AuditEvent {
  id: string;
  event_type: string;
  title: string;
  description: string;
  account_id?: string;
  created_at: string;
}

