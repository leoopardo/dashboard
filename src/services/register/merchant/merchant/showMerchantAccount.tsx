/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsQuery,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { AccountShowItem } from "@src/services/types/register/organization/accounts.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useShowMerchantAccount(id: number, params: MerchantsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  AccountShowItem | null | undefined
  >(
    "MerchantsShowRegister",
    async () => {
      const response = await api.get(`core/merchant/config/account/${id}`, {
        params,
      });
      return response.data;
    },
    {
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
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
