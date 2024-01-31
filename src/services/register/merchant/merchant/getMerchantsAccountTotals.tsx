/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsQuery,
  MerchantsTotalAccountResponse,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useQuery } from "react-query";

export function useGetMerchantsAccountTotals(params: MerchantsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    MerchantsTotalAccountResponse | null | undefined
  >(
    "MerchantsAccountTotals",
    async () => {
      const response = await api.get("core/account/totals", {
        params,
      });
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );


  const MerchantAccountTotalsData = data;
  const isSuccessMerchantAccountTotalsData = isSuccess;
  const isMerchantAccountTotalsDataFetching = isFetching;
  const MerchantDataTotalsError: any = error;
  const refetchMerchantAccountTotalsData = refetch;

  return {
    MerchantAccountTotalsData,
    isSuccessMerchantAccountTotalsData,
    isMerchantAccountTotalsDataFetching,
    MerchantDataTotalsError,
    refetchMerchantAccountTotalsData
  };
}
