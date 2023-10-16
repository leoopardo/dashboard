export interface PartnerResponsiblesQuery {
  partner_id: string;
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: string;
}

export interface PartnerResponsiblesItem {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  position: string;
  created_at: string;
}

export interface PartnerResponsiblesData {
  total: number;
  limit: number;
  page: number;
  items: PartnerResponsiblesItem[];
}

export interface PartnerResponsiblesBody {
  partner_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
export interface PartnerResponsiblesUpdateBody {
  partner_responsible_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
