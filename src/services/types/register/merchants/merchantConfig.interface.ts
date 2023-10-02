export interface IMerchantConfig {
    cash_in_permission?: boolean;
    cash_out_permission?: boolean;
    cash_out_transaction_limit?: number;
    webhook_url_optional?: string;
}

export interface IMerchantUpdateConfig extends IMerchantConfig {
    merchant_id: number;
}

export interface IMerchantConfigResponse {
    id: number;
    merchantConfig?: IMerchantConfig;
}