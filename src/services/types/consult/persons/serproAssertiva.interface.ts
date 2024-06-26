export interface SerproAssertivaQuery {
  start_date: string;
  end_date: string;
  merchant_id?: number;
}

export interface SerproAssertivaItem {
  _id?: string;
  date?: string;
  assertiva_count?: number;
  created_at?: string;
  updatedAt?: string;
}

export interface SerproAssertivaData {
  items: SerproAssertivaItem[];
  limit: number;
  page: number;
  total: number;
  assertiva_count_total: number;
  serpro_cpf_count_total: number;
  serpro_cnpj_count_total: number;
}
