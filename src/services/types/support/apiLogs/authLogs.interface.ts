export interface AuthLogsQuery {
  start_date: string;
  end_date: string;
  limit: number;
  page: number;
  partner_id?: number;
  merchant_id?: number;
  aggregator_id?: number;
  operator_id?: number;
  success?: boolean;
}

export interface AuthLogsItem {
  createdAt: string;
  error_message: string;
  ip: string;
  merchant_id: number;
  merchant_name: string;
  partner_id: number;
  partner_name: string;
  success: boolean;
  _id: string;
}

export interface AuthLogsData {
  items: AuthLogsItem[];
  limit: number;
  page: number;
  total: number;
}
