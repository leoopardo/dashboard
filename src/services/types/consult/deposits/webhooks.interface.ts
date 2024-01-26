export interface DepositWebhooksQuery {
  merchant_id?: number;
  partner_id?: number;
  webhook_url_type?: "single" | "multiple";
  start_date?: string;
  end_date?: string;
  page: number;
  limit: number;
  sort_order?: string;
  log_type: "single" | "interval";
}

export interface DepositWebhooksItem {
  _id: string;
  user: string;
  merchant_id: number;
  partner_id: number;
  webhook_type: string;
  createdAt: string;
  start_date: string;
  end_date: string;
  success: boolean;
  failed: boolean;
  error: boolean;
  progress: string;
  status: string;
}
export interface DepositWebhooksData {
  limit: number;
  page: number;
  total: number;
  itens: DepositWebhooksItem[];
}
