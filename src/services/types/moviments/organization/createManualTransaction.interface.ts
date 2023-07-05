export interface CreateManualTransaction {
  category_id?: number;
  value?: number;
  type?: "in" | "out";
  description?: string;
  validation_token?: string;
}
