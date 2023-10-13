
interface IPartner {
  id: number;
  name: string;
}

interface IMerchantConfig {
  cash_in_bank: string;
  cash_out_bank: string;
}

export interface MerchantsQuery {
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

export interface MerchantsItem {
  cellphone?: string;
  created_at?: string;
  v3_id?: string;
  cnpj?: string;
  domain?: string;
  email?: string | null;
  id?: number;
  merchantConfig?: IMerchantConfig;
  name?: string;
  organization_id?: number;
  partner?: IPartner;
  status?: boolean;
  update_at?: string;
  merchant_id?: number;
  partner_id?: number;
  aggregator_id?: number;
  operator_id?: number;
  country?: string
}

export interface MerchantsResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantsItem[];
}

export interface MerchantsTotalResponse {
  registered_merchant_totals: number;
  active_merchant_totals: number;
  inactive_merchant_totals: number;
  onboarding_merchant_totals: number;
  expired_merchant_totals: number;
}
