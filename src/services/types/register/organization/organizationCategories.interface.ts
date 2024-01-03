export interface OrganizationCategoriesQuery {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: boolean;
  sort_field?: string;
  sort_order?: string;
  enabled: boolean;
  page: number;
  limit: number;
}

export interface OrganizationCategoriesItem {
  id: number;
  organization_id: number;
  name: string;
  description: string;
  status: boolean | undefined;
  created_at: string;
}

export interface OrganizationCategoriesResponse {
  page: number;
  total: number;
  limit: number;
  items: OrganizationCategoriesItem[];
}
