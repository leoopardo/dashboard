export interface MerchantHistoryQuery {
  merchant_id?: number;
  page: number;
  limit: number;
}

export interface MerchantHistoryItem {
  _id: string;
  merchant_id: number;
  organization_id: number;
  reference_day: string;
  __v: number;
  balance_reserved: number;
  balance_to_payment: number;
  balance_to_transactions: number;
  createdAt: string;
  customer_withdraw: number;
  in: number;
  merchant_withdraw: number;
  out: number;
  pix: number;
  pix_fee: number;
  pix_refund_fee: number;
  transactions_pix_amount: number;
  transactions_pix_total: number;
  updatedAt: string;
  withdraw_fee: number;
}

export interface MerchantHistoryData {
  total: number;
  limit: number;
  page: number;
  items: MerchantHistoryItem[];
}
