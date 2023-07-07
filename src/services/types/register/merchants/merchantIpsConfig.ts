export interface MerchantIpsQuery {
    merchant_id?: number;
    page: number;
    limit: number;
  }
  
  export interface MerchantIpsItem {
    merchant_id?: number;
    ip?: string;
  }
  export interface MerchantIpsResponse {
    total: number;
    limit: number;
    page: number;
    items: MerchantIpsItem[];
  }
  