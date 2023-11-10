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
  status: boolean;
}

export interface MerchantUsersQuery {
  user_id?: string;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
  partner_id?: number;
  name?: string;
  status?: boolean;
  sort_field?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
  merchant?: boolean;
  partner?: boolean;
  comma_separate_value?: boolean;
  fields?: any;
}

export interface MerchantItem {
  cellphone: string;
  cnpj: string;
  created_at: string;
  domain: string;
  email: string;
  id: number;
  merchantConfig: {
    cash_in_bank: string;
    cash_out_bank: string;
  };
  partner: Pick<IPartner, "id" | "name">;
  name: string;
  operator_id: number;
  organization_id: number;
  partner_id: number;
  status: boolean;
}

export interface MerchantUsersResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantItem[];
}
