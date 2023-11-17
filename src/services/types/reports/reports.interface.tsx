/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportsQuery {
  start_date?: string;
  end_date?: string;
  limit?: number;
  page?: number;
  fields?: any;
  comma_separate_value?: boolean;
}

export interface ReportsItem {
  _id: string;
  status: string;
  created_by_name: string;
  rows: number;
  progress: string;
  createdAt: string;
  report_url?: string;
}

export interface ReportsData {
  limit: string;
  page: string;
  total: number;
  items: ReportsItem[];
}
