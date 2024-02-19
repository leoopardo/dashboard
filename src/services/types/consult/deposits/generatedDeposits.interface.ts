/* eslint-disable @typescript-eslint/no-explicit-any */
export interface generatedDepositTotalQuery {
  page?: number;
  limit?: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: string;
  initial_date?: string;
  final_date?: string;
  status?:
    | "PAID"
    | "CANCELED"
    | "EXPIRED"
    | "WAITING"
    | "AWAITING_REFUND"
    | "REFUNDED";
  pix_id?: string;
  endToEndId?: string;
  txid?: string;
  reference_id?: string;
  buyer_document?: string;
  payer_document?: string;
  delivered_at?: "ttue" | "false";
  buyer_name?: string;
  payer_name?: string;
  fields?: any;
  comma_separate_value?: boolean;
  description?: string;
  delivered_at_secondary?: "true" | "false";
}

export interface generatedDepositRowsQuery {
  page: number;
  limit: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: string;
  initial_date: string;
  final_date: string;
  status?:
    | "PAID"
    | "CANCELED"
    | "EXPIRED"
    | "WAITING"
    | "AWAITING_REFUND"
    | "REFUNDED";
  endToEndId?: string;
  txid?: string;
  reference_id?: string;
  pix_id?: string;
  merchant_id?: number;
  bank?: string;
  partner_id?: number;
  buyer_document?: number;
  payer_document?: number;
  payer_bank?: number;
  age_start?: number;
  age_end?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  state?: string;
  city?: string;
  delivered_at?: boolean;
  value_start?: number;
  value_end?: number;
  buyer_name?: string;
  payer_name?: string;
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
export interface generatedDepositRowsResponse {
  limit: number;
  page: number;
  total: number;
  items: generatedDepositRowsItems[];
}
export interface generatedDepositRowsItems {
  _id: string;
  bank: string;
  merchant_name: string;
  value: number;
  createdAt: string;
  delivered_at: string;
  buyer_name: string;
  buyer_document: number;
  status: string;
}

export interface getDeposit {
  _id: string;
  merchant_id: number;
  merchant_name: string;
  partner_name: string;
  partner_id: number;
  reference_id: string;
  endToEndId: string;
  value: number;
  buyer_name: string;
  buyer_document: number;
  payer_name: string;
  payer_document: number;
  bank: string;
  txid: string;
  payer_account: string;
  payer_bank: string;
  payer_agency: string;
  buyer_email: string;
  description: string;
  webhook_url: string;
  cash_in_fee: number;
  cash_in_fee_percent: number;
  status: string;
  paid_value: number;
  webhook_url_optional: string;
  buyer_birth_date: string;
  buyer_gender: string;
  buyer_street: string;
  buyer_number: number;
  buyer_neighborhood: string;
  buyer_city: string;
  buyer_state: string;
  buyer_zip_code: string;
  error: string;
  ip: string;
  createdAt: string;
  qr_code: string;
  paid_at: string;
  delivered_at: string;
}
export interface WebhooksQuery {
  page: number;
  limit: number;
}

export interface WebhooksResponse {
  items: [];
  limit: number;
  page: number;
  total: number;
  total_errors: number;
  total_success: number;
}
export interface WebhooksItem {
  date: string;
  id: string;
  response: { status_code: number; status_text: string; response: string };
  status: string;
  url: string;
  url_type: string;
  webhook_sent: { data: string };
}
