export interface SelfInterface {
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
  permission_group: {
    id: number;
    organization_id: number;
    admin_can_use: true;
    all_partners_can_use: boolean;
    all_merchants_can_use: boolean;
    name: string;
    created_at: string;
    permissions: [];
  };
  merchant: number;
  partner: number;
  organization: {
    id: number;
    name: string;
    status: boolean;
    cnpj: string;
    cellphone: string;
    email: string;
    created_at: string;
  };
}
