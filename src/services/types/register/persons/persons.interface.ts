export interface PersonsQuery {
  page: number;
  limit: number;
  sort_field: string;
  sort_order: "ASC" | "DESC";
  cpf?: string;
  name?: string;
  birth_date?: string;
  black_list?: boolean;
  black_list_reason?: string;
  gender?: string;
  city?: string;
  state?: string;
  email?: string;
  cellphone?: string;
  flag_pep?: boolean;
  flag_aux_gov?: boolean;
  flag_alert?: boolean;
  initial_date?: string;
  final_date?: string;
  fields?: string[],
  comma_separate_value?: boolean
}
export interface PersonsItem {
  _id?: string;
  cpf?: string;
  situation_text?: string;
  situation_code?: string;
  name?: string;
  email?: string;
  birth_date?: string;
  mother_name?: string;
  black_list?: boolean;
  gender?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  cellphone?: string;
  flag_pep?: boolean;
  flag_aux_gov?: boolean;
  flag_alert?: number;
  cash_in_max_value?: any;
  cash_out_max_value?: any;
  cash_out_transaction_limit?: any;
  last_check?: string;
  createdAt?: string;
  updatedAt?: string;
  black_list_reason?: string;
  black_list_description?: string;
  __v?: number;
}

export interface PersonsResponse {
  total: number;
  limit: number;
  page: number;
  items: PersonsItem[];
}

export interface PersonFilesItem {
  _id: string;
  cpf: string;
  file_url: string;
  file_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface PersonFilesResponse {
  total: number;
  limit: number;
  page: number;
  items: PersonFilesItem[];
}

export interface PersonBlacklistReason {
  total: number;
  page: number;
  limit: number;
  items: {
    id: string;
    reason: string;
    status: boolean;
    createdAt: string;
  }[];
}

export interface PersonHistory {
  _id: string;
  cpf: string;
  step: string;
  user_id: number;
  user_name: string;
  ip: string;
  data_before?: {
    _id: string;
    cpf: string;
    file_url: string;
    file_name: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  } | null;
  data_later?: {
    _id: string;
    cpf: string;
    file_url: string;
    file_name: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  } | null;
  payload?: {
    cpf: string;
    file_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PersonHistoryResponse {
  total: number;
  limit: number;
  page: number;
  items: PersonHistory[];
}
