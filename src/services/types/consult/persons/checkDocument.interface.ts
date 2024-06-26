export interface CheckCpf {
  birth_date: string;
  cpf: string;
  mother_name: string;
  name: string;
  situation_code: string;
  situation_text: string;
  black_list: boolean;
}

export interface CheckCpfDetails {
  items: { reason: string; merchant_name: string };
  limit: number;
  page: number;
  total: number;
}
