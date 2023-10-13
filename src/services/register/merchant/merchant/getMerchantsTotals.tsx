/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsQuery,
  MerchantsTotalResponse,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useQuery } from "react-query";

export function useGetMerchantsTotals(params: MerchantsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    MerchantsTotalResponse | null | undefined
  >(
    "MerchantsRegisterTotals",
    async () => {
      const response = await api.get("core/merchant/totals", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const MerchantTotalsData = data;
  const isSuccessMerchantTotalsData = isSuccess;
  const isMerchantTotalsDataFetching = isFetching;
  const MerchantDataTotalsError: any = error;
  const refetchMerchantTotalsData = refetch;
  return {
    MerchantTotalsData,
    isSuccessMerchantTotalsData,
    isMerchantTotalsDataFetching,
    MerchantDataTotalsError,
    refetchMerchantTotalsData
  };
}
