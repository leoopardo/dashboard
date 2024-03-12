export interface AggregatorBlacklistQuery {
  limit: number;
  page: number;
  document?: string;
  reason?: string;
  start_date?: string;
  end_date?: string;
  sort_field?: string;
  sort_order?: string;
  merchant_id?: string;
}

export interface AggregatorBlacklistItem {
  document: string;
  merchant: string;
  reason: string;
  description: string;
  createdAt: string;
}

export interface AggregatorBlacklistData {
  items: AggregatorBlacklistItem[];
  page: number;
  total: number;
  limit: number;
}


export interface AggregatorBlacklistReasonItem {
  reason: string;
}
export interface AggregatorBlacklistReasonData {
  items: AggregatorBlacklistReasonItem[];
  page: number;
  total: number;
  limit: number;
}
