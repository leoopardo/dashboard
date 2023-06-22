export interface PartnerQuery {
  partner_id?: number;
  start_date?: string;
  end_date?: string;
  name?: string;
  status?: string;
  country?: string;
  responsible_name?: string;
  page: number;
  limit: number;
}

export interface PartnerItem {
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
}
export interface PartnersResponse {
  total: number;
  limit: number;
  page: number;
  items: PartnerItem[];
}
