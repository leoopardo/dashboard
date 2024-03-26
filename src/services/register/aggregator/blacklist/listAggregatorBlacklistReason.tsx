/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  MerchantBlacklistReasonData,
  MerchantBlacklistReasonQuery,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

export function useListRowsAggregatorBlacklistReasons(
  params?: MerchantBlacklistReasonQuery,
  isNotFetch?: boolean
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBlacklistReasonData | null | undefined
  >("ListAggregatorBlacklistReason", async () => {
    const response = !isNotFetch && await api.get("blacklist/aggregator-black-list/reasons", {
      params,
    });
    return response ? response.data : { data: { items: [] } };
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
