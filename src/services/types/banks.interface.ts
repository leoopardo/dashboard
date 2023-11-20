export interface BankQuery {
  cash_in?: boolean;
  cash_out?: boolean;
  page: number;
  limit: number;
  sort_order?: "ASC" | "DESC";
  sort_field?: string;
}

export interface BankItem {
  id: number;
  label_name: string;
  bank: string;
  icon_url: string;
  account: number;
  agency: number;
  priority: number;
  bank_fee: number;
  internal_account_number: number;
  img: string;
  cash_in: boolean;
  cash_out: boolean;
  status: boolean;
  account_name: string;
  account_document: string;
  created_at: string;
  FastPix: boolean
}
export interface BankResponse {
  total: number;
  limit: number;
  page: number;
  itens: BankItem[];
}

export interface ClientBankQuery {
  start_date?: string;
  end_date?: string;
  bank_name?: string;
  bank_code?: number;
  ispb?: number;
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: "ASC" | "DESC";
}

export interface ClientBankItem {
  _id: string;
  bank_code: string;
  bank_name: string;
  ispb: string;
  createdAt: string;
}

export interface ClientBankResponse {
  total: number;
  limit: number;
  page: number;
  items: ClientBankItem[];
}
