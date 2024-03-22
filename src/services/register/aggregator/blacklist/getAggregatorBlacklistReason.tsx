/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  MerchantBlacklistReasonData,
  MerchantBlacklistReasonQuery,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

export function useGetRowsAggregatorBlacklistReasons(
  params?: MerchantBlacklistReasonQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBlacklistReasonData | null | undefined
  >("AggregatorBlacklistReason", async () => {
    const response = await api.get("blacklist/aggregator-black-list/reasons", {
      params,
    });
    return response.data;
  });

  const AggregatorBlacklistData = data;
  const isAggregatorBlacklistDataFetching = isFetching;
  const AggregatorBlacklistDataError: any = error;
  const refetchAggregatorBlacklistData = refetch;
  return {
    AggregatorBlacklistData,
    isAggregatorBlacklistDataFetching,
    AggregatorBlacklistDataError,
    refetchAggregatorBlacklistData,
  };
}
