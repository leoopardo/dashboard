export interface IOrganizationConfig {
  cpf_api_permission: boolean;
  cash_out_transaction_limit?: number;
  cash_in_receive_by_pj?: boolean;
  cash_in_receive_by_different_payer?: boolean;
  cash_in_max_value_receive_by_pj?: number;
  cash_in_max_value_receive_by_different_payer?: number;
  cash_out_max_value?: number;
}

export interface IOrganizationUpdateConfig {
  merchant_id?: number;
  cpf_api_permission?: boolean;
  status?: boolean;
  cash_out_transaction_limit?: number;
  cash_in_receive_by_pj?: boolean;
  cash_in_receive_by_different_payer?: boolean;
  cash_in_max_value_receive_by_pj?: number;
  cash_in_max_value_receive_by_different_payer?: number;
  cash_out_max_value?: number;
  operation_type?: string;
  btg_merchant_customer_id?: string;
  under_age_verify?: boolean
}

export interface IOrganizationConfigResponse {
  id?: number;
  merchantConfig?: IOrganizationConfig;
  cpf_api_permission?: boolean;
  status?: boolean;
}
