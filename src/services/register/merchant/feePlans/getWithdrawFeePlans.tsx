/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { MerchantsQuery } from "@services/types/register/merchants/merchantsRegister.interface";
import { IDepositFeeResponse } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useQuery } from "react-query";

export function useGetWithdrawFeePlansRegister(params?: MerchantsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    IDepositFeeResponse | null | undefined
  >(
    "MerchantsWithdrawFeePlans",
    async () => {
      const response = await api.get("core/merchant_fee_plans", {
        params: { transaction_type: "CASHOUT", ...params },
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const withdrawFeePlansData = data;
  const isWithdrawFeePlansDataFetching = isFetching;
  const withdrawPlansDataError: any = error;
  const refetchWithdrawFeePlansData = refetch;
  return {
    withdrawFeePlansData,
    isWithdrawFeePlansDataFetching,
    withdrawPlansDataError,
    refetchWithdrawFeePlansData,
  };
}
