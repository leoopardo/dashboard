/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { MerchantsQuery } from "@services/types/register/merchants/merchantsRegister.interface";
import { IDepositFeeResponse } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useQuery } from "react-query";

export function useGetFeePlansRegister(params?: MerchantsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    IDepositFeeResponse | null | undefined
  >(
    "MerchantsFeePlans",
    async () => {
      const response = await api.get("core/fee_plans", {
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

  const feePlansData = data;
  const isFeePlansDataFetching = isFetching;
  const feePlansDataError: any = error;
  const refetchFeePlansData = refetch;
  return {
    feePlansData,
    isFeePlansDataFetching,
    feePlansDataError,
    refetchFeePlansData,
  };
}
