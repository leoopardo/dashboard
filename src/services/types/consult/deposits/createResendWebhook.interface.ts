export interface ResendWebhookBody {
  partner_id?: number;
  merchant_id?: number;
  webhook_url_type?: "primary" | "secondary" | "both";
  start_date?: string;
  end_date?: string;
}
