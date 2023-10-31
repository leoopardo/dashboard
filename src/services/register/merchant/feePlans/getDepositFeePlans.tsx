/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { MerchantsQuery } from "@services/types/register/merchants/merchantsRegister.interface";
import { IDepositFeeResponse } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useQuery } from "react-query";

export function useGetDepositFeePlansRegister(params?: MerchantsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    IDepositFeeResponse | null | undefined
  >(
    "MerchantsDepositFeePlans",
    async () => {
      const response = await api.get("core/fee_plans", {
        params: { transaction_type: "CASHIN", ...params },
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const depositFeePlansData = data;
  const isDepositFeePlansDataFetching = isFetching;
  const depositFeePlansDataError: any = error;
  const refetchDepositFeePlansData = refetch;
  return {
    depositFeePlansData,
    isDepositFeePlansDataFetching,
    depositFeePlansDataError,
    refetchDepositFeePlansData,
  };
}
