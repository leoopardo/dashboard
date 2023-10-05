export interface OrganizationTransferBetweenAccountsbody {
  from?: string;
  to?: string;
  value?: number;
  validation_token?: string;
  organization_id?: number | string;
}

export interface OrganizationTransferBetweenAccountsQuery {
  from?: string;
  to?: string;
  start_date?: string;
  end_date?: string;
  limit: number;
  page: number;
  merchant_id?: string
}

export interface OrganizationTransferBetweenAccountsItem {
  _id: string;
  merchant_id: number;
  merchant_name: string;
  partner_id: number;
  partner_name: string;
  user_id: number;
  user_name: string;
  value: number;
  from: string;
  to: string;
  status: string;
  fee: number;
  fee_percent: number;
  organization_id: number;
  organization_name: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrganizationTransferBetweenAccountsData {
  limit: number;
  page: number;
  total_canceled: number;
  total_processing: number;
  total_success: number;
  items: OrganizationTransferBetweenAccountsItem[];
}
