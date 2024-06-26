/* eslint-disable @typescript-eslint/no-explicit-any */
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
  page?: number;
  limit?: number;
  fields?: any;
  comma_separate_value?: boolean;
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

export interface OperatorsTotalResponse {
  registered_operators_totals: number;
  active_operators_totals: number;
  inactive_operators_totals: number;
  linked_merchants_total: number;
}
