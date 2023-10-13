/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorQuery,
  AggregatorsTotalResponse,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { useQuery } from "react-query";

export function useGetAggregatorsTotals(params: AggregatorQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    AggregatorsTotalResponse | null | undefined
  >("AggregatorTotals", async () => {
    const response = await api.get("core/aggregator/totals", {
      params,
    });
    return response.data;
  });

  const AggregatorsTotalsData = data;
  const isAggregatorsTotalsDataFetching = isFetching;
  const AggregatorsTotalsDataError: any = error;
  const isSuccessAggregatorsTotalsData = isSuccess;
  const refetchAggregatorsTotalsData = refetch;
  return {
    AggregatorsTotalsData,
    isAggregatorsTotalsDataFetching,
    AggregatorsTotalsDataError,
    isSuccessAggregatorsTotalsData,
    refetchAggregatorsTotalsData,
  };
}
