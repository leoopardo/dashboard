export interface refundWithdrawalsQuery {
  page: number;
  limit: number;
  sort_order?: "DESC" | "ASC";
  sort_field?: "string";
  start_date: string;
  end_date: string;
  status?: "REFUNDED" | "PAID_TO_MERCHANT" | "ERROR" | "PROCESSING" | "PENDING";
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

export interface refundWithdrawalsTotal {
  transactions_total: number;
  transactions_value: number;
  waiting_total: number;
  waiting_value: number;
  error_total: number;
  error_value: number;
  refunded_total: number;
  refunded_value: number;
  processing_total: number;
  processing_value: number;
  paid_to_merchant_total: number;
  paid_to_merchant_value: number;
}

export interface refundWithdrawalsRowsResponse {
  limit: number;
  page: number;
  total: number;
  items: refundWithdrawalsRowsItems[];
}
export interface refundWithdrawalsRowsItems {
  buyer_document: string;
  buyer_name: string;
  createdAt: string;
  endToEndId: string;
  merchant_id: number;
  merchant_name: string;
  payer_document: string;
  payer_name: string;
  pix_id: string;
  reason: string;
  status: string;
  value: number;
  _id: string;
}
export interface refundWithdrawById {
  bank: string;
  createdAt: string;
  endToEndId: string;
  merchant_id: number;
  merchant_name: string;
  organization_id: number;
  partner_id: number;
  partner_name: string;
  receiver_document: string;
  receiver_name: string;
  refund_date: string;
  status: string;
  value: number;
  _id:string;
}
