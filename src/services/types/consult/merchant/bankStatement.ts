export interface MerchantBankStatementTotalsQuery {
  start_date: string;
  end_date: string;
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_order?: string;
}

export interface MerchantBankStatementTotalsData {
  average_ticket_in: number;
  average_ticket_out: number;
  average_ticket_total: number;
  fee_in: number;
  fee_out: number;
  fee_total: number;
  number_in: number;
  number_out: number;
  number_total: number;
  result_total: number;
  value_in: number;
  value_out: number;
  value_total: number;
}

export interface MerchantHourlyItem {
  value_in: number;
  number_in: number;
  value_out: number;
  number_out: number;
  date: string;
}

export interface MerchantTransactionsItem {
  id: string;
  fee: number;
  fee_percent: number;
  fee_type: string;
  transaction_type: string;
  value: number;
  bank_fee: number;
  bank_account_number: number;
  bank_name: string;
  paid_at: string;
}
export interface MerchantTransactionsData {
  total: number;
  limit: number;
  page: number;
  items: MerchantTransactionsItem[];
}
