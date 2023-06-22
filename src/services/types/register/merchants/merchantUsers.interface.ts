interface IMerchant {
  aggregator_id: string;
  cellphone: string;
  cnpj: string;
  created_at: string;
  domain: string;
  email: string;
  id: number;
  name: string;
  operator_id: number;
  organization_id: number;
  partner_id: number;
  status: boolean
}

interface IPartner {
  aggregator_id: string;
  cellphone: string;
  cnpj: string;
  country: string;
  created_at: string;
  email: string;
  id: number;
  name: string;
  organization_id: number;
  responsible_name: string;
  status: boolean
}

export interface MerchantUsersQuery {
  user_id?: string;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
  partner_id?: number;
  name?: string;
  status?: boolean;
  sort_field: string;
  sort_order: string;
  page: number;
  limit: number;
  merchant?: boolean;
  partner?: boolean;
}

export interface MerchantUsersItem {
  cellphone: string;
  created_at: string;
  email: string;
  group_id: number;
  id: number;
  last_signin_date: string;
  last_signin_ip: string ;
  merchant:  IMerchant;
  merchant_id: number;
  name: string;
  organization_id: number;
  partner: IPartner;
  partner_id: number;
  phone_validated: boolean;
  status: boolean;
  type: number;
  username: string;
}

export interface MerchantUsersResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantUsersItem[];
}
