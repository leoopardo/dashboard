/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

import {
  MerchantBalanceQuery,
  MerchantBalanceTotalsData,
} from "@src/services/types/consult/merchant/balance";
import { useEffect } from "react";

export function useGetMerchantBalanceTotal(params: MerchantBalanceQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBalanceTotalsData | null | undefined
  >(
    "MerchantBalanceTotals",
    async () => {
      const response = await api.get("core/merchant/account/totals", {
        params,
      });
      return response?.data;
    },
    { keepPreviousData: false }
  );

  useEffect(() => {
    refetch();
  }, [params]);

  const MerchantBalance = error ? ({} as any) : data;
  const isMerchantBalanceFetching = isFetching;
  const MerchantBalanceError: any = error;
  const refetchMerchantBalance = refetch;
  return {
    MerchantBalance,
    isMerchantBalanceFetching,
    MerchantBalanceError,
    refetchMerchantBalance,
  };
}
