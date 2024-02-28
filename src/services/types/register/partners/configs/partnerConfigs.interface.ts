export interface DepositFields {
  merchant_id?: boolean;
  merchant_name?: boolean;
  reference_id?: boolean;
  endToEndId?: boolean;
  value?: boolean;
  buyer_name?: boolean;
  buyer_document?: boolean;
  payer_name?: boolean;
  payer_document?: boolean;
  bank?: boolean;
  txid?: boolean;
  payer_account?: boolean;
  payer_bank?: boolean;
  payer_agency?: boolean;
  buyer_email?: boolean;
  description?: boolean;
  status?: boolean;
  paid_at?: boolean;
  paid_value?: boolean;
  buyer_city?: boolean;
  buyer_state?: boolean;
  createdAt?: boolean;
}

export interface WithdrawFields {
  merchant_id?: boolean;
  merchant_name?: boolean;
  description?: boolean;
  partner_name?: boolean;
  partner_id?: boolean;
  reference_id?: boolean;
  value?: boolean;
  receiver_name?: boolean;
  receiver_document?: boolean;
  pix_key_type?: boolean;
  pix_key?: boolean;
  bank?: boolean;
  status?: boolean;
  receiver_bank_account?: boolean;
  receiver_bank_agency?: boolean;
  receiver_bank_client_document?: boolean;
  receiver_bank_client_name?: boolean;
  receiver_bank_name?: boolean;
  endToEndId?: boolean;
  paid_at?: boolean;
  receiver_city?: boolean;
  receiver_state?: boolean;
  error?: boolean;
  createdAt?: boolean;
}
