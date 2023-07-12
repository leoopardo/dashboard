export type IDepositFeePlansDetails = {
    id: number;
    merchant_fee_plans_id: number;
    range_fee: number;
    range_value: number;
    range_limit: number;
}

export interface IDepositFeeItem  {
    id?: string;
    name?: string | null;
    plan_type?: string | null;
    status?: boolean;
    transaction_type?: string | null;
    range_type?: string | null;
    created_at?: string;
    merchant_fee_plans_details?: IDepositFeePlansDetails[] | null
}
  
  export interface IDepositFeeResponse {
    total: number;
    limit: number;
    page: number;
    merchant_fee_plans: IDepositFeeItem[]
  }