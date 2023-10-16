/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsQuery,
  MerchantsResponse,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetRowsMerchantRegister(params: MerchantsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    MerchantsResponse | null | undefined
  >(
    "MerchantsRegister",
    async () => {
      const response = await api.get("core/merchant", {
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

  useEffect(() => {
    refetch();
  }, [params]);

  const MerchantData = data;
  const isSuccessMerchantData = isSuccess;
  const isMerchantDataFetching = isFetching;
  const MerchantDataError: any = error;
  const refetchMerchantData = refetch;
  return {
    MerchantData,
    isMerchantDataFetching,
    isSuccessMerchantData,
    MerchantDataError,
    refetchMerchantData,
  };
}
