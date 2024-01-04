/* eslint-disable @typescript-eslint/no-explicit-any */
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
  license_id_list?: number;
  partner_id?: number;
  name?: string;
  status?: boolean;
  sort_field: string;
  sort_order: string;
  page: number;
  limit: number;
  merchant?: boolean;
  partner?: boolean;
  fields?: any;
  comma_separate_value?: boolean
}

export interface MerchantsItem {
  cellphone?: string;
  created_at?: string;
  v3_id?: number;
  cnpj?: string;
  domain?: string;
  email?: string | null;
  id?: number;
  merchantConfig?: IMerchantConfig;
  aggregator?: {id?: number, name?: string};
  operator?: {id?: number, name?: string};
  name?: string;
  organization_id?: number;
  partner?: IPartner;
  status?: boolean;
  update_at?: string;
  merchant_id?: number;
  partner_id?: number;
  aggregator_id?: number;
  operator_id?: number;
  country?: string;
}

export interface MerchantsResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantsItem[];
}

export interface MerchantByIdResponse {
  aggregator: {id: number, name: string};
  cnpj: string;
  country: string;
  cellphone?: string;
  email?: string;
  v3_id?: number;
  created_at: string;
  currency: string;
  domain: string;
  id: number;
  language: string;
  licenses: any[];
  merchant_type: string;
  name: string;
  operator: {id: number, name: string};
  organization_id: number;
  partner: {id: number, name: string};
  situation: string;
  time_zone: string;
  updated_at: string;
}

export interface MerchantsTotalResponse {
  registered_merchant_totals: number;
  active_merchant_totals: number;
  inactive_merchant_totals: number;
  onboarding_merchant_totals: number;
  expired_merchant_totals: number;
}

export interface MerchantsPerBankResponse {
  total: number;
  valuesIn: any;
  valuesOut: any;
  valuesFastpix: any;
}
