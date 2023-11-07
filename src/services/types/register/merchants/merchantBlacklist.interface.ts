export interface MerchantBlacklistQuery {
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
  cpf?: string;
  reason?: string;
  limit?: number;
  page?: number;
  sort_field?: string;
  sort_order?: string;
}

export interface MerchantBlacklistItem {
  _id?: string;
  cpf?: string;
  create_user_id?: number;
  create_user_name?: string;
  createdAt?: string;
  description?: string;
  merchant_id?: number;
  merchant_name?: string;
  can_be_deleted_only_by_organization?: boolean | string;
  reason?: string;
}
export interface MerchantBlacklistResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantBlacklistItem[];
}
