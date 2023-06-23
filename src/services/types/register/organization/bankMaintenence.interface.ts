export interface BankMaintenenceQuery {
  limit: number;
  page: number;
  sort_field: string;
  sort_order: "ASC" | "DESC";
  cash_in?: boolean;
  cash_out?: boolean;
}

export interface BankMaintenenceItem {
  id?: number;
  label_name?: string;
  icon_url?: string;
  account?: number;
  agency?: number;
  priority?: number;
  bank_fee?: number;
  internal_account_number?: number;
  cash_in?: boolean;
  cash_out?: boolean;
  status?: boolean;
  account_name?: string;
  account_document?: string;
  created_at?: string;
}
export interface BankMaintenenceResponse {
  page: number;
  limit: number;
  total: number;
  itens: BankMaintenenceItem[];
}
