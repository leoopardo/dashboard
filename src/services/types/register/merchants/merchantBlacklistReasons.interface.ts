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
  limit: number;
  page: number;
}

export interface CreateMerchantBlacklistReasons {
  reason_name : string;
}