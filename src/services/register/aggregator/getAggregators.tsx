/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorQuery,
  AggregatorsResponse,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetAggregators(params: AggregatorQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    AggregatorsResponse | null | undefined
  >("Aggregator", async () => {
    const response = await api.get("core/aggregator", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const AggregatorsData = data;
  const isAggregatorsDataFetching = isFetching;
  const AggregatorsDataError: any = error;
  const refetchAggregatorsData = refetch;
  return {
    AggregatorsData,
    isAggregatorsDataFetching,
    AggregatorsDataError,
    refetchAggregatorsData,
  };
}
