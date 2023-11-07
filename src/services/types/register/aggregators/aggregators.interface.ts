/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AggregatorQuery {
  Aggregator_id?: number;
  start_date?: string;
  end_date?: string;
  name?: string;
  status?: string;
  country?: string;
  responsible_name?: string;
  sort_order?: string;
  sort_field?: string;
  page?: number;
  limit?: number;
  fields?: any;
  comma_separate_value?: boolean;
}

export interface AggregatorItem {
  id?: number;
  Aggregator_id?: number;
  name?: string;
  status?: boolean;
  organization_id?: number;
  aggregator_id?: number;
  cnpj?: string;
  cellphone?: string;
  email?: string;
  country?: string;
  responsible_name?: string;
  created_at?: string;
}
export interface AggregatorsResponse {
  total: number;
  limit: number;
  page: number;
  items: AggregatorItem[];
}

export interface AggregatorsTotalResponse {
  registered_aggregators_totals: number;
  active_aggregators_totals: number;
  inactive_aggregators_totals: number;
  linked_operators_total: number;
  linked_merchants_total: number;
}
