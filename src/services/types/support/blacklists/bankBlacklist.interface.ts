export interface BankBlacklistQuery {
  limit: number;
  page: number;
  ispb?: string;
  bank_name?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  sort_field?: string;
  sort_order?: string;
}

export interface BankBlacklistItem {
  _id: string;
  bank_name: string;
  ispb: string;
  user_id: number;
  user_name: string;
  createdAt: string;
}
export interface BankBlacklistData {
  page: number;
  limit: number;
  total: number;
  items: BankBlacklistItem[];
}

