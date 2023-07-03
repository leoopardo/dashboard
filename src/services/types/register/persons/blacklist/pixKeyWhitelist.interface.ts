export interface PixKeyWhitelistQuery {
  page: number;
  limit: number;
  sort_field: string;
  sort_order: "ASC" | "DESC";
  pix_key?: string;
  start_date?: string;
  end_date?: string;
}
export interface PixKeyWhitelistItem {
  _id: string;
  pix_key: string;
  createdAt: string;
}

export interface PixKeyWhitelistResponse {
  total: number;
  limit: number;
  page: number;
  items: PixKeyWhitelistItem[];
}
