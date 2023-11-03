export interface IMerchantFeesProps {
  merchant_withdraw_fee_type?: string;
  merchant_withdraw_fee_percent?: number;
  merchant_withdraw_fee_value?: number;
  merchant_withdraw_fee_min?: number;
  customer_withdraw_fee_type?: string;
  customer_withdraw_fee_percent?: number;
  customer_withdraw_fee_value?: number;
  customer_withdraw_fee_min?: number;
  cashin_pix_fee_type?: string;
  cashin_pix_fee_percent?: number;
  cashin_pix_fee_value?: number;
  cashin_pix_fee_min?: number;
  pix_refund_fee_type?: string;
  pix_refund_fee_percent?: number;
  pix_refund_fee_value?: number;
  pix_refund_fee_min?: number;
  fastpix_in_fee_type?: string;
  fastpix_in_fee_value?: number;
  fastpix_in_fee_percent?: number;
  fastpix_in_fee_min?: number;
  fastpix_refund_fee_type?: string;
  fastpix_refund_fee_value?: number;
  fastpix_refund_fee_percent?: number;
  fastpix_refund_fee_min?: number;
  customer_withdraw_fee_plan_id?: number;
  cashin_pix_fee_plan_id?: number;
}

export interface MerchantFeesResponse {
  id: number;
  fees: IMerchantFeesProps;
}

export interface IMerchantFeesUpdate extends IMerchantFeesProps {
  merchant_id?: number;
  partner_id?: string;
}
