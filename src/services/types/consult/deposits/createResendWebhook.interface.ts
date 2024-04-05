export interface ResendWebhookBody {
  partners_ids?: number[];
  merchants_ids?: number[];
  webhook_url_type?: "primary" | "secondary" | "both";
  start_date?: string;
  end_date?: string;
  delivered_at?: boolean;
  partner_id?: number;
  merchant_id?: number;
}
