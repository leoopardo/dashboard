/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantsQuery,
  MerchantsResponse,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useQuery } from "react-query";

export function useGetRowsMerchantRegister(params: MerchantsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
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

  const MerchantData = data;
  const isMerchantDataFetching = isFetching;
  const MerchantDataError: any = error;
  const refetchMerchantData = refetch;
  return {
    MerchantData,
    isMerchantDataFetching,
    MerchantDataError,
    refetchMerchantData,
  };
}
