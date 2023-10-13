/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorQuery,
  AggregatorsResponse,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { useQuery } from "react-query";

export function useGetAggregators(params: AggregatorQuery) {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
    AggregatorsResponse | null | undefined
  >("Aggregator", async () => {
    const response = await api.get("core/aggregator", {
      params,
    });
    return response.data;
  });

  const AggregatorsData = data;
  const isAggregatorsDataFetching = isFetching;
  const AggregatorsDataError: any = error;
  const isSuccessAggregatorsData = isSuccess;
  const refetchAggregatorsData = refetch;
  return {
    AggregatorsData,
    isAggregatorsDataFetching,
    AggregatorsDataError,
    isSuccessAggregatorsData,
    refetchAggregatorsData,
  };
}
