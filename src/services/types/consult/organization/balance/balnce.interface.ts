export interface OrganizationBalance {
  _id?: string;
  organization_id?: number;
  balance_reserved?: number;
  balance_to_payment?: number;
  balance_to_transactions?: number;
  createdAt?: string;
  in?: number;
  out?: number;
  pix_amount_fee?: number;
  pix_transactions_total?: number;
  refund_amount_fee?: number;
  refund_transactions_total?: number;
  updatedAt?: string;
  withdraw_amount_fee?: number;
  withdraw_transactions_total?: number;
  balance_total?: number;
}
