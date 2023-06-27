export interface PersonsQuery {
  page: number;
  limit: number;
  sort_field: string;
  sort_order: "ASC" | "DESC";
  cpf?: string;
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
  initial_date: string;
  
}
