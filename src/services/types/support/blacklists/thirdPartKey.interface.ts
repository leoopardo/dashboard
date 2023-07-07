export interface ThirdPartQuery {
  limit: number;
  page: number;
  receiver_document?: string;
  pix_key?: string;
  pix_key_type?: string;
  start_date?: string;
  end_date?: string;
  sort_field?: string;
  sort_order?: string;
}

export interface ThirdPartItem {
  _id: string;
  pix_key: string;
  receiver_name: string;
  receiver_document: string;
  pix_key_type: string;
  bank_name: string;
  createdAt: string;
}
export interface ThirdPartData {
  page: number;
  limit: number;
  total: number;
  items: ThirdPartItem[];
}
