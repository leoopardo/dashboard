export interface MerchantResponsiblesQuery {
  merchant_id: string;
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: string;
}

export interface MerchantResponsiblesItem {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  position: string;
  created_at: string;
}

export interface MerchantResponsiblesData {
  total: number;
  limit: number;
  page: number;
  items: MerchantResponsiblesItem[];
}

export interface MerchantResponsiblesBody {
  merchant_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
export interface MerchantResponsiblesUpdateBody {
  merchant_responsible_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
