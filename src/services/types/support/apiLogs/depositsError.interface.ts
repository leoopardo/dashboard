export interface DepositsLogsStepsTotalQuery {
  limit: number;
  page: number;
  partner_id?: number;
  merchant_id?: number;
  ducument?: string;
  start_date?: string;
  end_date?: string;
  step?: string;
}

export interface DepositsLogsStepsTotalItem {
  total: number;
  step: string;
}

export interface DepositLogsItem {
  _id: string;
  merchant_id: number;
  partner_id: number;
  document: string;
  step: string;
  error_message: string;
  createdAt: string;
}
export interface DepositLogsData {
  page: number;
  limit: number;
  total: number;
  items: DepositLogsItem[];
}

export interface DepositLogsItemById {
  aggregator_id: number;
  createdAt: string;
  document: string;
  error_message: string;
  ip: string;
  merchant_id: number;
  operator_id: number;
  organization_id: number;
  partner_id: number;
  payload: {
    value: number;
    webhook_url: string;
    buyer: { cpf: string };
  };
  response: string;
  route: string;
  step: string;
  success: false;
  updatedAt: string;
  _id: string;
}

export interface LogsStepsItem {
  step: string;
}
