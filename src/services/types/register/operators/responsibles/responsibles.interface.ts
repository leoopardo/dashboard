export interface OperatorResponsiblesQuery {
  operator_id: string;
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: string;
}

export interface OperatorResponsiblesItem {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  position: string;
  created_at: string;
}

export interface OperatorResponsiblesData {
  total: number;
  limit: number;
  page: number;
  items: OperatorResponsiblesItem[];
}

export interface OperatorResponsiblesBody {
  operator_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
export interface OperatorResponsiblesUpdateBody {
  operator_responsible_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
