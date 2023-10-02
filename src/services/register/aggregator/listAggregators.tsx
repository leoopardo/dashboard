/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AggregatorQuery,
  AggregatorsResponse,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useListAggregators(params: AggregatorQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  AggregatorsResponse | null | undefined
>("listAggregator", async () => {
  const response = await api.get("core/aggregator", {
    params,
  });
  return response.data;
});

  const aggregatorsData = data;
  const isAggregatorsFetching = isFetching;
  const aggregatorsError: any = error;
  const refetcAggregators = refetch;

  return {
    aggregatorsData,
    isAggregatorsFetching,
    aggregatorsError,
    refetcAggregators,
  };
}
