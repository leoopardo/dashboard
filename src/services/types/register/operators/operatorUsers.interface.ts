export interface OperatorUsersQuery {
  operator_id?: number;
  aggregator_id?: number;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  name?: string;
  status?: string;
  sort_order?: string;
  sort_field?: string;
  page?: number;
  limit?: number;
}

export interface OperatorUsersItem {
  id: number;
  organization_id: number;
  operator_id: number;
  merchant_id: number;
  status: boolean;
  type: number;
  name: string;
  username: string;
  email: string;
  cellphone: string;
  group_id: number;
  last_signin_ip: string;
  last_signin_date: string;
  phone_validated: boolean;
  created_at: string;
  partner: {
    id: number;
    name: string;
    status: boolean;
    organization_id: number;
    aggregator_id: number;
    cnpj: string;
    cellphone: string;
    email: string;
    country: string;
    responsible_name: string;
    created_at: string;
  };
  merchant: number;
}
export interface OperatorsUsersResponse {
  total: number;
  limit: number;
  page: number;
  items: OperatorUsersItem[];
}
