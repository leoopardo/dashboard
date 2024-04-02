export interface LicenseQuery {
  license_id?: number;
  license_id_list?: number;
  start_date?: string;
  end_date?: string;
  name?: string;
  status?: string;
  sort_order?: string;
  sort_field?: string;
  page?: number;
  limit?: number;
  fields?: any;
  comma_separate_value?: boolean;
}

export interface LicenseItem {
  license_id?: number;
  id?: number;
  name?: string;
  status?: boolean;
  business_name?: string;
  number?: number;
  start_validity_date?: string;
  end_validity_date?: string | null;
  indeterminate_validity?: boolean; 
  created_at?: string;
  country?: string;
  linked_merchants_total?: number;
}

export interface LicenseResponse {
  total: number;
  limit: number;
  page: number;
  items: LicenseItem[];
}

export interface LicenseTotalResponse {
  registered_licenses_totals: number;
  active_licenses_totals: number;
  inactive_licenses_totals: number;
  expired_licenses_totals: number;
  linked_merchants_total: number;
}

export interface LicenseAttachmentItem {
  _id: any;
  file_name: any;
  file_url: any;
}

export interface LicenseAttachmentsResponse {
  total: number;
  limit: number;
  page: number;
  items: LicenseAttachmentItem[];
}
