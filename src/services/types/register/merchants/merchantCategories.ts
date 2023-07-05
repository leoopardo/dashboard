export interface GetMerchantCategoryQuery {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  sort_field?: string;
  sort_order?: string;
  page: number;
  limit?: number;
}
export interface GetMerchantCategoryItem {
  id: number;
  organization_id: number;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
}

export interface GetMerchantCategoriesData {
  total: number;
  limit: number;
  page: number;
  items: GetMerchantCategoryItem[];
}
