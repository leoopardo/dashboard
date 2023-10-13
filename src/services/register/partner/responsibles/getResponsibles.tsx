/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  PartnerResponsiblesData,
  PartnerResponsiblesQuery,
} from "@src/services/types/register/partners/responsibles/responsibles.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetPartnerResponsibles(
  params: PartnerResponsiblesQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    PartnerResponsiblesData | null | undefined
  >("PartnerResponsibles", async () => {
    const response = await api.get("core/partner/responsible", {
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
