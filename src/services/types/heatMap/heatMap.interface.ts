export interface getTotalByCityQuery {
  createdat_start: string;
  createdat_end: string;
}

export interface getTotalByCity {
  state: string;
  city: string;
  totalValue: number;
  quantity: number;
  medianTicket: number;
}

export interface getTotalByState {
  state: string;
  totalValue: number;
  quantity: number;
  medianTicket: number;
}

export interface lastHalfHour {
  total: number;
  items: {
    date: string;
    count: number;
  }[];
}
