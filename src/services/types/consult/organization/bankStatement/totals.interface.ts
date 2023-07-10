export interface OrganizationBankStatementTotalsQuery {
  start_date?: string;
  end_date?: string;
  bank?: string;
  payment_type?: string;
  sort_order?: string;
  sort_field?: string;
  page?: number;
  limit?: number;
}

export interface OrganizationBankStatementTotalsResponse {
  number_in: number;
  value_in: number;
  fee_in: number;
  bank_fee_in: number;
  result_in: number;
  total_out: number;
  number_out: number;
  value_out: number;
  fee_out: number;
  bank_fee_out: number;
  result_out: number;
  number_total: number;
  value_total: number;
  fee_total: number;
  bank_fee_total: number;
  result_total: number;
}
