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
  total?: number;
  items: MerchantBalanceItem[];
}
export interface MerchantBalanceTotalsData {
  [key: string]: any;
  _id: string;
  balance_reserved: number;
  balance_to_payment: number;
  balance_to_transactions: number;
  total: number;
  balance_total: number;
  usd_balance_reserved: number;
  usd_balance_to_payment: number;
  usd_balance_to_transactions: number;
  usd_balance_total: number;
  eur_balance_reserved: number;
  eur_balance_to_payment: number;
  eur_balance_to_transactions: number;
  eur_balance_total: number;
  gbp_balance_reserved: number;
  gbp_balance_to_payment: number;
  gbp_balance_to_transactions: number;
  gbp_balance_total: number;
  btc_balance_reserved: number;
  btc_balance_to_payment: number;
  btc_balance_to_transactions: number;
  btc_balance_total: number;
}
