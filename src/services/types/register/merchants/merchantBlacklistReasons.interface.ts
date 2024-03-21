export interface MerchantBlacklistReasonsItem {
  create_user_id: number;
  create_user_name: string;
  createdAt: string;
  merchant_id: number;
  merchant_name: string;
  reason_name: string;
  reason_type: string;
  updatedAt: string;
  _id: string;
}

export interface MerchantBlacklistReasonData {
  items: MerchantBlacklistReasonsItem[];
  limit: number;
  page: number;
  total: number;
}

export interface MerchantBlacklistReasonQuery {
  limit?: number;
  page?: number;
  merchant_id?: number;
  aggregator_id?: number;
  sort_field?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateMerchantBlacklistReasons {
  reason_name?: string;
  merchant_id?: number;
  general_use?: boolean;
}
