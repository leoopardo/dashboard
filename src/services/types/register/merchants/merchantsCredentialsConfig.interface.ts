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

export interface IShowCredentialQuery {
  api_credential_id?: number;
  validation_token?: string;
}

export interface IShowCredentialItem {
  id: number;
  access_key: string;
  access_secret: string;
  created_at: string;
  merchantConfig: { cryptograp: string; decrypt_k: string };
  cryptography: string;
  decrypt_key: string;
  merchant_id: number;
  name: string;
  status: true;
  type: string;
}

export interface IBodyCredentialItem {
  api_credential_id?: number;
  merchant_id?: number;
  name?: string;
  status?: boolean;
  type?: string;
  validation_token?: string;
}
