/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import {
  MerchantHistoryData,
  MerchantHistoryQuery,
} from "@src/services/types/consult/merchant/history";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetMerchantHistory(params: MerchantHistoryQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantHistoryData | null | undefined
  >(
    "MerchantHistory",
    async () => {
      const response = await api.get("account/merchant-account/history", {
        params,
      });
      return response.data;
    },
    {
      keepPreviousData: false,
      onError: () => queryClient.setQueriesData("MerchantHistory", []),
    }
  );

  const MerchantHistory = data;
  const isMerchantHistoryFetching = isFetching;
  const MerchantHistoryError: any = error;
  const refetchMerchantHistory = refetch;
  return {
    MerchantHistory,
    isMerchantHistoryFetching,
    MerchantHistoryError,
    refetchMerchantHistory,
  };
}
