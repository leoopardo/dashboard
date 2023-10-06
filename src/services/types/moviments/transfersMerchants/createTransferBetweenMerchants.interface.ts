export interface CreateTransferBetweenMerchants {
  debit_merchant_id?: number;
  credit_merchant_id?: number;
  debit_balance_type?: [
    "BALANCE_RESERVED",
    "BALANCE_TO_PAYMENT",
    "BALANCE_TO_TRANSACTIONS"
  ];
  credit_balance_type?: [
    "BALANCE_RESERVED",
    "BALANCE_TO_PAYMENT",
    "BALANCE_TO_TRANSACTIONS"
  ];
  value?: number;
  description?: string;
  validation_token: string;
}
