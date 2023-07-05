export interface IMerchantConfig {
    cash_in_permission?: boolean;
    cash_out_permission?: boolean;
    cash_out_transaction_limit?: number;
    cash_in_receive_by_pj?: boolean;
    cash_in_receive_by_different_payer?: boolean;
    cash_in_max_value_receive_by_pj?: number;
    cash_in_max_value_receive_by_different_payer?: number;
    cash_out_max_value?: number;
    webhook_url_optional?: string;
}

export interface IMerchantUpdateConfig extends IMerchantConfig {
    merchant_id: number;
}

export interface IMerchantConfigResponse {
    id: number;
    merchantConfig?: IMerchantConfig;
}