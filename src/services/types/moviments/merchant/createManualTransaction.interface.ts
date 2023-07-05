export interface CreateMerchantManualTransaction {
  category_id?: number;
  value?: number;
  type?: "in" | "out";
  description?: string;
  validation_token?: string;
}
