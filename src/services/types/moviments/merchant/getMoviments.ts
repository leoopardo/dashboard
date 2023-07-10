export interface GetMerchantMovimentsQuery {
  user_id?: number;
  category_id?: number;
  start_date: string;
  end_date: string;
  status?: string;
  type?: string;
  min_value?: number;
  max_value?: number;
  sort_field?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface GetMerchantMovimentsItem {
  _id: string;
  category_id: number;
  category_name: string;
  user_id: number;
  user_name: string;
  status: string;
  value: number;
  type: string;
  description:string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMerchantMovimentsData {
  total?: number;
  limit?: number;
  page?: number;
  total_in_processing?: number;
  total_out_processing?: number;
  total_in_success?: number;
  total_out_success?: number;
  total_in_canceled?: number;
  total_out_canceled?: number;
  items?: GetMerchantMovimentsItem[];
}
