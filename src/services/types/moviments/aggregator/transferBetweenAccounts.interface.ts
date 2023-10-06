export interface AggregatorTransferBetweenAccountsbody {
  from?: string;
  to?: string;
  value?: number;
  validation_token?: string;
  aggregator_id?: number;
}

export interface AggregatorTransferBetweenAccountsQuery {
  from?: string;
  to?: string;
  start_date?: string;
  end_date?: string;
  limit: number;
  page: number;
  aggregator_id?: string
}

export interface AggregatorTransferBetweenAccountsItem {
  _id: string;
  merchant_id: number;
  merchant_name: string;
  partner_id: number;
  partner_name: string;
  user_id: number;
  user_name: string;
  value: number;
  from: string;
  to: string;
  status: string;
  fee: number;
  fee_percent: number;
  organization_id: number;
  organization_name: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AggregatorTransferBetweenAccountsData {
  limit: number;
  page: number;
  total_canceled: number;
  total_processing: number;
  total_success: number;
  items: AggregatorTransferBetweenAccountsItem[];
}
