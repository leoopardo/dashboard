type IDepositFeePlansDetails = {
    id: number;
    merchant_fee_plans_id: number;
    range_fee: number;
    range_value: number;
    range_limit: number;
}

export interface IDepositFeeItem  {
    id: string;
    name: string;
    plan_type: string;
    status: boolean;
    transaction_type: string;
    range_type: string;
    created_at: string;
    merchant_fee_plans_details: IDepositFeePlansDetails[]
}
  
  export interface IDepositFeeResponse {
    total: number;
    limit: number;
    page: number;
    merchant_fee_plans: IDepositFeeItem[]
  }