export interface CredentialQuery {
  merchant_id?: number;
  page?: number;
  limit?: number;
  sort_order?: string; 
}

export interface ICredentialItem {
  created_at: string;
  id: number;
  merchant_id: number;
  name: string;
  status: boolean;
  type: string;
}
export interface ICredentialResponse {
  total: number;
  limit: number;
  page: number;
  items: ICredentialItem[];
}
