export interface MerchantBalanceQuery {
  merchant_id?: number;
  page: number;
  limit: number;
}

export interface MerchantBalanceItem {
  _id: string;
  merchant_id: number;
  balance_reserved: number;
  balance_to_payment: number;
  balance_to_transactions: number;
  createdAt: string;
  in: number;
  out: number;
  refund_amount_fee: number;
  refund_transactions_total: number;
  updatedAt: string;
  withdraw_amount_fee: number;
  withdraw_amount_value: number;
  withdraw_transactions_total: number;
  merchant_name: string;
}

export interface MerchantBalanceData {
  limit: number;
  page: number;
  _id: string;
  balance_reserved_total: number;
  balance_to_payment_total: number;
  balance_to_transactions_total: number;
  total: number;
  merchant_id?: number;
  balance_reserved?: number;
  balance_to_payment?: number;
  balance_to_transactions?: number;
  createdAt?: string;
  in?: number;
  out?: number;
  refund_amount_fee?: number;
  refund_transactions_total?: number;
  updatedAt?: string;
  withdraw_amount_fee?: number;
  withdraw_amount_value?: number;
  withdraw_transactions_total?: number;
  merchant_name?: string;
  items: MerchantBalanceItem[];
}
