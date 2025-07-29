export interface PlanLimits {
  number_of_sites: number;
  number_of_documents: number;
  file_size: number;
  number_of_faqs: number;
  number_of_crawlers: number;
  number_token_chat: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  limits: PlanLimits;
  period: string;
  features: string[];
  is_self_sigup_allowed: boolean;
  is_custom: boolean;
  description: string;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: string | null;
  created_at: string;
  updated_at: string;
  plan_name: string;
  plan_price: number;
}
