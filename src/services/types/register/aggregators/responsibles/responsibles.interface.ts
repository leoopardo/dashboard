export interface AggregatorResponsiblesQuery {
  aggregator_id: string;
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: string;
}

export interface AggregatorResponsiblesItem {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  position: string;
  created_at: string;
}

export interface AggregatorResponsiblesData {
  total: number;
  limit: number;
  page: number;
  items: AggregatorResponsiblesItem[];
}

export interface AggregatorResponsiblesBody {
  aggregator_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
export interface AggregatorResponsiblesUpdateBody {
  aggregator_responsible_id?: number;
  name?: string;
  email?: string;
  cellphone?: string;
  position?: string;
}
