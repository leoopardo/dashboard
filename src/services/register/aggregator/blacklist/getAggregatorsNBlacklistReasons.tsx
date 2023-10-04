/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorBlacklistData,
  AggregatorBlacklistQuery,
} from "@src/services/types/register/aggregators/aggregatorBlacklist.interface";
import { useQuery } from "react-query";

export function useGetAggregatorsBlacklistReasons(params: AggregatorBlacklistQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    AggregatorBlacklistData | null | undefined
  >("AggregatorBlacklistReasons", async () => {
    const response = await api.get("blacklist/aggregator-black-list/reasons", {
      params,
    });
    return response.data;
  });

  const AggregatorsBlacklistReasonsData = data;
  const isAggregatorsBlacklistReasonsDataFetching = isFetching;
  const AggregatorsBlacklistReasonsDataError: any = error;
  const refetchAggregatorsBlacklistReasonsData = refetch;
  return {
    AggregatorsBlacklistReasonsData,
    isAggregatorsBlacklistReasonsDataFetching,
    AggregatorsBlacklistReasonsDataError,
    refetchAggregatorsBlacklistReasonsData,
  };
}
