
export interface IMerchantFeesProps {
  cashin_pix_fee_min?: number;
  cashin_pix_fee_percent?: number;
  cashin_pix_fee_plan_id?: number;
  cashin_pix_fee_type?: string;
  cashin_pix_fee_value?: number;
  customer_withdraw_fee_min?: number;
  customer_withdraw_fee_percent?: number;
  customer_withdraw_fee_plan_id?: number;
  customer_withdraw_fee_type?: string;
  customer_withdraw_fee_value?: number;
  merchant_withdraw_fee_min?: number;
  merchant_withdraw_fee_percent?: number;
  merchant_withdraw_fee_type?: string;
  merchant_withdraw_fee_value?: number;
  pix_refund_fee_min?: string;
  pix_refund_fee_percent?: number;
  pix_refund_fee_type?: string;
  pix_refund_fee_value?: number;
}

export interface MerchantFeesResponse {
  id: number;
  fees: IMerchantFeesProps;
}

export interface IMerchantFeesUpdate {
  merchant_id?: number[];
  cash_in_bank: string;
  cash_out_bank: string;
  partner_id?: string;
}