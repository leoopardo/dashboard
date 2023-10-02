export interface OperatorQuery {
  operator_id?: number;
  start_date?: string;
  aggregator_id?: string;
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

export interface OperatorItem {
  id?: number;
  operator_id?: number;
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
  group_id?: number;
  username?: string;
}
export interface OperatorsResponse {
  total: number;
  limit: number;
  page: number;
  items: OperatorItem[];
}
