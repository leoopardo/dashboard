export type IDepositFeePlansDetails = {
  id?: number;
  fee_plans_details_id?: number;
  fee_plans_id?: number;
  range_fee?: number;
  range_value?: number;
  range_limit?: number;
};

export interface IDepositFeeItem {
  id?: string;
  fee_plan_id?: string;
  name?: string | null;
  plan_type?: string | null;
  status?: boolean;
  transaction_type?: string | null;
  range_type?: string | null;
  created_at?: string;
}

export interface IDepositFeeResponse {
  total: number;
  limit: number;
  page: number;
  items: IDepositFeeItem[];
}

export interface IFeePlansDetailsResponse {
  total: number;
  limit: number;
  page: number;
  items: IDepositFeeItem[];
}

export interface IMerchantFee {
  fees: {
    cashin_pix_fee_min: number;
    cashin_pix_fee_percent: number;
    cashin_pix_fee_plan_id: number;
    cashin_pix_fee_type: string;
    cashin_pix_fee_value: number;
    customer_withdraw_fee_min: number;
    customer_withdraw_fee_percent: number;
    customer_withdraw_fee_plan_id: number;
    customer_withdraw_fee_type: string;
    customer_withdraw_fee_value: number;
    merchant_withdraw_fee_min: number;
    merchant_withdraw_fee_percent: number;
    merchant_withdraw_fee_type: string;
    merchant_withdraw_fee_value: number;
    pix_refund_fee_min: number;
    pix_refund_fee_percent: number;
    pix_refund_fee_type: string;
    pix_refund_fee_value: number;
  };
  id: number;
}
