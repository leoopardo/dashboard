export interface PersonBlacklistUploadsQuery {
  createdat_start?: string;
  createdat_end?: string;
  limit: number;
  page: number;
}
export interface PersonBlacklistUploadsItem {
  _id: string;
  status: string;
  created_by: 112;
  created_by_name: string;
  created_by_ip: string;
  progress: string;
  failed_cpf: string[];
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

export interface PersonBlacklistUploadsData {
  items: PersonBlacklistUploadsItem[];
  limit: number;
  page: number;
  total: number;
}
