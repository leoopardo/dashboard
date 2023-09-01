/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  MerchantBlacklistReasonData,
  MerchantBlacklistReasonQuery,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

export function useGetRowsMerchantBlacklistReasons(
  params?: MerchantBlacklistReasonQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBlacklistReasonData | null | undefined
  >("MerchantBlacklistReason", async () => {
    const response = await api.get("blacklist/merchant-black-list/reasons", {
      params,
    });
    return response.data;
  });

  const merchantBlacklistData = data;
  const isMerchantBlacklistDataFetching = isFetching;
  const merchantBlacklistDataError: any = error;
  const refetchMerchantBlacklistData = refetch;
  return {
    merchantBlacklistData,
    isMerchantBlacklistDataFetching,
    merchantBlacklistDataError,
    refetchMerchantBlacklistData,
  };
}
