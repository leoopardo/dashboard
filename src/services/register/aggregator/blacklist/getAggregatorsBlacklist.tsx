/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorBlacklistData,
  AggregatorBlacklistQuery,
} from "@src/services/types/register/aggregators/aggregatorBlacklist.interface";
import { useQuery } from "react-query";

export function useGetAggregatorsBlacklist(params: AggregatorBlacklistQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    AggregatorBlacklistData | null | undefined
  >("AggregatorBlacklist", async () => {
    const response = await api.get("blacklist/aggregator-black-list", {
      params,
    });
    return response.data;
  });

  const AggregatorsBlacklistData = data;
  const isAggregatorsBlacklistDataFetching = isFetching;
  const AggregatorsBlacklistDataError: any = error;
  const refetchAggregatorsBlacklistData = refetch;
  return {
    AggregatorsBlacklistData,
    isAggregatorsBlacklistDataFetching,
    AggregatorsBlacklistDataError,
    refetchAggregatorsBlacklistData,
  };
}
