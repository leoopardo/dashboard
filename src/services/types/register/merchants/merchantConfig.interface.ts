export interface IMerchantConfig {
  cash_in_permission?: boolean;
  cash_out_permission?: boolean;
  cash_out_transaction_limit?: number;
  webhook_url_optional?: string;
  fastpix_in_permission?: boolean;
  fastpix_in_type?: string;
  fastpix_in_max_value?: number;
  fastpix_in_min_value?: number;
  fastpix_webhook_url?: string;
  fastpix_redirect_url?: string;
  fastpix_token_time?: number;
  merchant_hash?: string;
}
export interface IMerchantUpdateConfig extends IMerchantConfig {
  merchant_id: number;
}

export interface IMerchantConfigResponse {
  id: number;
  merchantConfig?: IMerchantConfig;
}

export interface IMerchantLogosItem {
  _id?: string;
  file_url?: string;
  file_name?: string;
  active?: boolean;
  createdAt?: string;
}

export interface IMerchantLogosResponse {
  total: boolean;
  limit: boolean;
  page: boolean;
  items: IMerchantLogosItem[];
}

export interface IMerchantLogoBody {
  logo_name?: string;
  merchant_id?: number;
  base64_file?: string;
}

export interface IMerchantAccountUpdate {
  merchant_id?: number;
  account_id?: number;
}

export interface IMerchantAccount {
  merchants_ids?: (number | undefined)[] | null;
  account_id?: number;
  name?: string;
  partners_ids?: (number | undefined)[] | null;
  operators_ids?: (number | undefined)[] | null;
  aggregators_ids?: (number | undefined)[] | null;
}
