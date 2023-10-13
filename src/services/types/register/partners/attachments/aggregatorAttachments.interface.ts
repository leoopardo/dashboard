export interface PartnerAttachmentsQuery {
  partner_id: number;
}
export interface PartnerAttachmentsItem {
  _id: string;
  file_url: string;
  file_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface PartnerAttachmentsResponse {
  total: number;
  limit: number;
  page: number;
  items: PartnerAttachmentsItem[];
}
