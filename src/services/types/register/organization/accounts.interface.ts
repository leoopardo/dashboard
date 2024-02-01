export interface AccountQuery {
  start_date?: string;
  end_date?: string;
  limit?: number;
  page?: number;
  locked?: boolean;
}

export interface AccountItem {
    created_at: string;
    id: number;
    locked: number;
    name: string;
    updated_at: string;
  }

export interface AccountShowItem {
  merchant_id: number;
  account: {id: number; name: string, locked: boolean};
}

export interface OrganizationCurrentAccountsResponse {
  page: number;
  total: number;
  limit: number;
  items: AccountItem[];
}
