/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { OperatorResponsiblesData, OperatorResponsiblesQuery } from "@src/services/types/register/operators/responsibles/responsibles.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetOperatorResponsibles(
  params: OperatorResponsiblesQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    OperatorResponsiblesData | null | undefined
  >("OperatorResponsibles", async () => {
    const response = await api.get("core/operator/responsible", {
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
