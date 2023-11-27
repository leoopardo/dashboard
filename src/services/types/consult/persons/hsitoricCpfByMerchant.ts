export interface HistoricCpfByMerchantQuery {
  merchant_id?: string
  start_date: string
  end_date: string
  limit?: number
  page?: number
}

export interface IHistoricCpfByMerchant {
  merchant_id?: string
  merchant_name?: string
  total?: number
}

export interface CheckCpfDetails {
  items: { reason: string; merchant_name: string };
  limit: number;
  page: number;
  total: number;
}
