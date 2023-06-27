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
  page: number;
  limit: number;
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
