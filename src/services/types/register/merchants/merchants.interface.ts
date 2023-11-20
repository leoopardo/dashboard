export interface MerchantQuery {
  partner_id?: number;
  start_date?: string;
  end_date?: string;
  name?: string;
  status?: string;
  country?: string;
  responsible_name?: string;
  page: number;
  limit: number;
  sort_order?: "ASC" | "DESC";
  sort_field?: string;
}

export interface MerchantItem {
  id: number;
  name: string;
}
export interface MerchantResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantItem[];
}
