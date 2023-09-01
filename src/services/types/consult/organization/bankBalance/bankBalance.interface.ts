export interface BankBalanceItemInterface {
  cc: string;
  cnpj: string;
  date_checked: string;
  name: string;
  value: number;
  value_blocked: number;
}

export interface BankBalanceDataInterface {
  banks: BankBalanceItemInterface[];
  total: number;
}
