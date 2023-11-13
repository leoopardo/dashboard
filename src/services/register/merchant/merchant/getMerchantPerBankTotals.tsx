/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsPerBankResponse,
  MerchantsQuery
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useQuery } from "react-query";

export function useGetMerchantsPerBank(params: MerchantsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  MerchantsPerBankResponse | null | undefined
  >(
    "MerchantsPerBankTotals",
    async () => {
      const response = await api.get("core/merchant/banks/totals", {
        params,
      });
      return response.data;
    },
  );

  const MerchantsPerBankData = data;
  const isSuccessMerchantsPerBankData = isSuccess;
  const isMerchantsPerBankDataFetching = isFetching;
  const MerchantDataTotalsError: any = error;
  const refetchMerchantsPerBankData = refetch;
  return {
    MerchantsPerBankData,
    isSuccessMerchantsPerBankData,
    isMerchantsPerBankDataFetching,
    MerchantDataTotalsError,
    refetchMerchantsPerBankData
  };
}
