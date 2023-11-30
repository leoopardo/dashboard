/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useListAggregatorById(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    { name: string; id: number } | null | undefined
  >("AggregatorByIdList", async () => {
    const response = await api.get("core/aggregator", {
      params,
    });
    return response.data;
  });

  const Aggregator = data;
  const isAggregatorFetching = isFetching;
  const AggregatorError: any = error;
  const refetcAggregator = refetch;

  return {
    Aggregator,
    isAggregatorFetching,
    AggregatorError,
    refetcAggregator,
  };
}
