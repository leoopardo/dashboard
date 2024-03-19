export interface LegalPersonsQuery {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_order?: "ASC" | "DESC";
  cnpj?: string;
  business_name?: string;
  business_type?: string;
  registration_status_code?: string;
  registration_status_description?: string;
  main_cnae_code?: string;
  addres_city?: string;
  addres_state?: string;
  addres_country?: string;
  jurisdiction_city?: string;
  phone?: string[];
  email?: string;
  flag_alert?: number;
  black_list?: boolean;
  black_list_reason?: string;
  black_list_description?: string;
  flag_pep?: boolean;
  initial_date?: string;
  final_date?: string;
}
export interface LegalPersonsItem {
  _id?: string;
  cnpj?: string;
  business_type?: string;
  business_name?: string;
  trade_name?: string;
  registration_status_code?: string;
  registration_status_date?: string;
  registration_status_reason?: string;
  registration_status_description?: string;
  legal_nature_code?: string;
  legal_nature_description?: string;
  opening_date?: string;
  main_cnae_code?: string;
  address_street?:string;
  address_number?: string;
  address_complement?: string;
  address_postal_code?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?:string;
  address_country?: string;
  jurisdiction_city?: string;
  phone?: string;
  email?: string;
  capital?: number;
  size?:string;
  special_situation?: string;
  special_situation_date?: string;
  black_list?: boolean;
  flag_pep?: boolean;
  flag_alert?: number;
  cash_in_max_value?: number;
  cash_out_max_value?: number;
  cash_out_transaction_limit?: number;
  last_check?:string;
  createdAt?:string;
  updatedAt?: string;
  black_list_description?: string;
  black_list_reason?: string;
}

export interface LegalPersonsResponse {
  total?: number;
  limit?: number;
  page?: number;
  items?: LegalPersonsItem[];
}

export interface PersonFilesItem {
  _id?: string;
  cpf?: string;
  file_url?: string;
  file_name?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface PersonFilesResponse {
  total?: number;
  limit?: number;
  page?: number;
  items?: PersonFilesItem[];
}

export interface PersonBlacklistReason {
  total?: number;
  page?: number;
  limit?: number;
  items?: {
    id?: string;
    reason?: string;
    status?: boolean;
    createdAt?: string;
  }[];
}

export interface PersonHistory {
  _id?: string;
  cpf?: string;
  step?: string;
  user_id?: number;
  user_name?: string;
  ip?: string;
  data_before?: {
    _id?: string;
    cpf?: string;
    file_url?: string;
    file_name?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  } | null;
  data_later?: {
    _id?: string;
    cpf?: string;
    file_url?: string;
    file_name?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  } | null;
  payload?: {
    cpf?: string;
    file_id?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonHistoryResponse {
  total?: number;
  limit?: number;
  page?: number;
  items?: PersonHistory[];
}
