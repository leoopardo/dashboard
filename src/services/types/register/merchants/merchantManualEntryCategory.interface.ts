export interface MerchantManualEntryCategoryQuery {
  start_date?: string;
  end_date?: string;
  sort_field?: string;
  sort_order?: string;
  status?: boolean;
  page: number;
  limit: number;
}

export interface MerchantManualEntryCategoryItem {
  id?: number;
  created_at?: string;
  description?: string;
  name?: string;
  entry_account_category_id?: number;
  organization_id?: number;
  status?: true;
}
export interface MerchantManualEntryCategoryResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantManualEntryCategoryItem[];
}
