export interface OperatorAttachmentsQuery {
  operator_id: number;
}
export interface OperatorAttachmentsItem {
  _id: string;
  file_url: string;
  file_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface OperatorAttachmentsResponse {
  total: number;
  limit: number;
  page: number;
  items: OperatorAttachmentsItem[];
}
