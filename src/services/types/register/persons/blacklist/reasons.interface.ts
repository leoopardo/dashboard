export interface PersonBlacklistReasonsQuery {
  start_date?: string;
  end_date?: string;
  reason?: string;
  limit: number;
  page: number;
}
export interface PersonBlacklistReasonsItem {
  createdAt: string;
  id: string;
  reason: string;
  status: boolean;
}

export interface PersonBlacklistReasonsData {
  items: PersonBlacklistReasonsItem[];
  limit: number;
  page: number;
  total: number;
}
