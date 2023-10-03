export interface MerchantBankResponse {
  id: number;
  merchantConfig: { cash_in_bank: string; cash_out_bank: string };
}

export interface IMerchantBankUpdate {
  merchants_ids?: (number | undefined)[];
  cash_in_bank?: string;
  cash_out_bank?: string;
  partner_id?: string;
}
