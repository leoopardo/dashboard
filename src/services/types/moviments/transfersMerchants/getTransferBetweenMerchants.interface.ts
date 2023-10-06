export interface GetTransferMerchantQuery {
  sort_field?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface GetTransferMerchantItem {
  _id: string;
  organization_id: number;
  organization_name: string;
  debit_merchant_id: number;
  debit_merchant_name: string;
  credit_merchant_id: number;
  credit_merchant_name: string;
  user_id: number;
  user_name: string;
  value: number;
  debit_balance_type: string;
  credit_balance_type: string;
  status: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransferMerchantsData {
  total?: number;
  limit?: number;
  page?: number;
  total_canceled?: number;
  total_processing?: number;
  total_success?: number;
  items?: GetTransferMerchantItem[];
}
