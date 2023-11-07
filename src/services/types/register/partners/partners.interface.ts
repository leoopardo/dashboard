/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PartnerQuery {
  partner_id?: number;
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

export interface PartnerItem {
  id?: number;
  partner_id?: number;
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
export interface PartnersResponse {
  total: number;
  limit: number;
  page: number;
  items: PartnerItem[];
}

export interface PartnerTotalResponse {
  registered_partners_totals: number;
  active_partners_totals: number;
  inactive_partners_totals: number;
  linked_merchants_total: number;
}
