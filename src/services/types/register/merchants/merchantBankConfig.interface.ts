export interface MerchantBankResponse {
  id: number;
  merchantConfig: {
    cash_in_bank: string;
    cash_out_bank: string;
    fastpix_in_bank?: string;
  };
}

export interface IMerchantBankUpdate {
  merchants_ids?: (number | undefined)[] | null;
  cash_in_bank?: string;
  cash_out_bank?: string;
  partners_ids?: (number | undefined)[] | null;
  operators_ids?: (number | undefined)[] | null;
  aggregators_ids?: (number | undefined)[] | null;
}
