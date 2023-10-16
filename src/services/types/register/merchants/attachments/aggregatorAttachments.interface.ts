export interface MerchantAttachmentsQuery {
  merchant_id: number;
}
export interface MerchantAttachmentsItem {
  _id: string;
  file_url: string;
  file_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface MerchantAttachmentsResponse {
  total: number;
  limit: number;
  page: number;
  items: MerchantAttachmentsItem[];
}
