/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  AggregatorResponsiblesData,
  AggregatorResponsiblesQuery,
} from "@src/services/types/register/aggregators/responsibles/responsibles.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetAggregatorResponsibles(
  params: AggregatorResponsiblesQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    AggregatorResponsiblesData | null | undefined
  >("AggregatorResponsibles", async () => {
    const response = await api.get("core/aggregator/responsible", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const ResponsiblesData = data;
  const isResponsiblesDataFetching = isFetching;
  const ResponsiblesDataError: any = error;
  const refetchResponsiblesData = refetch;
  return {
    ResponsiblesData,
    isResponsiblesDataFetching,
    ResponsiblesDataError,
    refetchResponsiblesData,
  };
}
