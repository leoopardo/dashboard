export interface OrganizationUserQuery {
  user_id?: string;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
  partner_id?: number;
  name?: string;
  status?: boolean;
  sort_field: string;
  sort_order: string;
  page: number;
  limit: number;
  merchant?: boolean;
  partner?: boolean;
}

export interface OrganizationUserItem {
  id: number;
  organization_id: number;
  partner_id: number;
  merchant_id: number;
  status: boolean;
  type: number;
  name: string;
  username: string;
  email: string;
  cellphone: string;
  group_id: number;
  last_signin_ip: string;
  last_signin_date: string;
  phone_validated: boolean;
  created_at: string;
  partner: boolean;
  merchant: boolean;
}

export interface OrganizationUserResponse {
  total: number;
  limit: number;
  page: number;
  items: OrganizationUserItem;
}

export interface GroupQuery {
  name?: string;
  page: number;
  limit: number;
}
export interface GroupItem {
  id: number;
  name: string;
  created_at: string;
}
export interface GroupResponse {
  total: number;
  limit: number;
  page: number;
  items: GroupItem[];
}
