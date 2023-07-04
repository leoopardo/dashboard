export interface OrganizationHistoryQuery {
  page: number;
  limit: number;
}

export interface OrganizationHistoryItem {
  _id?: string;
  reference_day?: string;
  organization_id?: number;
  balance_reserved?: number;
  balance_to_payment?: number;
  balance_to_transactions?: number;
  manual_entry_in?: number;
  manual_entry_out?: number;
  bank_cash_in_fee?: number;
  bank_cash_out_fee?: number;
  cash_in_fee?: number;
  cash_in_number?: number;
  cash_in_value?: number;
  cash_out_fee?: number;
  cash_out_value?: number;
  cash_out_number?: number;
  total_transactions?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface OrganizationHistoryResponse {
  total: number;
  limit: number;
  page: number;
  items: OrganizationHistoryItem[];
}
