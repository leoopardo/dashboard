export interface SelfExclusionQuery {
  start_date?: string;
  end_date?: string;
  merchant_id?: string;
  limit: number;
  page: number;
}
export interface SelfExclusionItem {
  aggregator_id: number;
  createdAt: string;
  document: string;
  end_date: string;
  operator_id: number;
  organization_id: number;
  organization_name: string;
  start_date: string;
  status: boolean;
  _id: string;
}
export interface SelfExclusionData {
  limit: number;
  page: number;
  total: number;
  items: SelfExclusionItem[];
}

export interface CreateSelfExclusion {
  document: string;
  start_date: string;
  end_date: string;
}
