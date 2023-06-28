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
}
export interface PersonsItem {
  _id?: string;
  cpf?: string;
  situation_text?: string;
  situation_code?: string;
  name?: string;
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
  cash_in_max_value?: number;
  cash_out_max_value?: number;
  cash_out_transaction_limit?: number;
  last_check?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PersonsResponse {
  total: number;
  limit: number;
  page: number;
  items: PersonsItem[];
}
