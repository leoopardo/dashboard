/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

import {
  MerchantBalanceData,
  MerchantBalanceQuery,
} from "@src/services/types/consult/merchant/balance";

export function useGetMerchantBalance(params: MerchantBalanceQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBalanceData | null | undefined
  >("MerchantBalance", async () => {
    const response = params?.merchant_id ? await api.get("merchant/account/totals", {
      params,
    }) :  null
    return response?.data;
  });

  const MerchantBalance = data;
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
