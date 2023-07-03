export interface MerchantBankResponse {
    id: number
    merchantConfig: {cash_in_bank: string, cash_out_bank: string}
}

export interface IMerchantBankUpdate {
  merchant_id?: number[];
  cash_in_bank: string;
  cash_out_bank: string;
  partner_id?: string;
}