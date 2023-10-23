/* eslint-disable @typescript-eslint/no-explicit-any */
export interface generatedWithdrawalsTotalQuery {
  page: number;
  limit: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: "string";
  initial_date: string;
  final_date: string;
  status?:
    | "PAID"
    | "REFUNDED_WITHDRAW"
    | "CANCELED"
    | "PROCESSING"
    | "PENDING"
    | "IN_ANALYSIS"
    | "CREATED";
  pix_id?: string;
  endToEndId?: string;
  txid?: string;
  reference_id?: string;
  buyer_document?: string;
  receiver_document?: string;
  delivered_at?: boolean;
  buyer_name?: string;
  payer_name?: string;
}

export interface generatedWithdrawalsRowsQuery {
  page: number;
  limit: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: string;
  initial_date?: string;
  final_date?: string;
  status?:
    | "PAID"
    | "REFUNDED_WITHDRAW"
    | "CANCELED"
    | "PROCESSING"
    | "PENDING"
    | "IN_ANALYSIS"
    | "CREATED";
  endToEndId?: string;
  txid?: string;
  reference_id?: string;
  pix_id?: string;
  merchant_id?: number;
  bank?: string;
  partner_id?: number;
  buyer_document?: string;
  receiver_document?: string;
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
  created_at?: boolean;
  fields?: any;
  comma_separate_value?: boolean;
  organization_id?: string;
  payment_id?: string;
  receiver_name?: string;
  description?: string;
}

export interface generatedWithdrawalsTotal {
  transactions_total: number;
  transaction_value: number;
  canceled_total: number;
  canceled_value: number;
  created_total: number;
  created_value: number;
  paid_total: number;
  paid_value: number;
  pending_total: number;
  pending_value: number;
  processing_total: number;
  processing_value: number;
  withdraw_refunded_total: number;
  withdraw_refunded_value: number;
  in_analysis_total: number;
  in_analysis_value: number;
}
export interface generatedWithdrawalsRowsResponse {
  limit: number;
  page: number;
  total: number;
  items: generatedWithdrawalsRowsItems[];
}
export interface generatedWithdrawalsRowsItems {
  _id: string;
  merchant_id: number;
  merchant_name: string;
  partner_name: string;
  partner_id: number;
  value: number;
  receiver_name: string;
  receiver_document: string;
  pix_key_type: string;
  pix_key: string;
  bank: string;
  status: string;
  createdAt: string;
  delivered_at: string;
}

export interface getWithdraw {
  _id: string;
  merchant_id: number;
  merchant_name: string;
  description: string;
  partner_name: string;
  partner_id: number;
  reference_id: string;
  webhook_url: string;
  value: number;
  receiver_name: string;
  receiver_document: string;
  pix_key_type: string;
  pix_key: string;
  bank: string;
  status: string;
  receiver_email: string;
  cash_out_fee: number;
  cash_out_fee_percent: number;
  webhook_url_optional: string;
  receiver_birth_date: string;
  receiver_gender: string;
  receiver_street: string;
  receiver_number: string;
  receiver_neighborhood: string;
  receiver_city: string;
  receiver_state: string;
  receiver_zip_code: string;
  ip: string;
  createdAt: string;
  endToEndId: string;
  payment_id: string;
  receiver_bank_account: number;
  receiver_bank_agency: number;
  receiver_bank_client_document: string;
  receiver_bank_client_name: string;
  receiver_bank_name: string;
  paid_at: string;
  delivered_at: string;
}
