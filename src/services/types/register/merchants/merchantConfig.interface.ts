export interface IMerchantConfig {
    cash_in_permission?: boolean;
    cash_out_permission?: boolean;
    cash_out_transaction_limit?: number;
    webhook_url_optional?: string;
    fastpix_in_permission?: boolean;
    fastpix_in_type?: string;
    fastpix_in_max_value?: number;
    fastpix_in_fixed_min_value?: number
}
export interface IMerchantUpdateConfig extends IMerchantConfig {
    merchant_id: number;
}

export interface IMerchantConfigResponse {
    id: number;
    merchantConfig?: IMerchantConfig;
}