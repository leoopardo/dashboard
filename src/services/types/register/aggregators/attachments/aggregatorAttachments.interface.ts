export interface AggregatorAttachmentsQuery {
  aggregator_id: number;
}
export interface AggregatorAttachmentsItem {
  _id: string;
  file_url: string;
  file_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface AggregatorAttachmentsResponse {
  total: number;
  limit: number;
  page: number;
  items: AggregatorAttachmentsItem[];
}
