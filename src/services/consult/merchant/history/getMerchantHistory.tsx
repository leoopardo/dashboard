import {
  MerchantHistoryData,
  MerchantHistoryQuery,
} from "@src/services/types/consult/merchant/history";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { queryClient } from "@src/services/queryClient";

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
