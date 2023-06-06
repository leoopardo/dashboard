export interface generatedDepositTotalQuery {
  page: number;
  limit: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: "string";
  initial_date: string;
  final_date: string;
}

export interface generatedDepositTotal {
  transactions_total: number;
  transaction_value: number;
  awaiting_refund_total: number;
  awaiting_refund_value: number;
  canceled_total: number;
  canceled_value: number;
  paid_total: number;
  paid_value: number;
  refund_total: number;
  refund_value: number;
  waiting_total: number;
  waiting_value: number;
  expired_total: number;
  expired_value: number;
}
