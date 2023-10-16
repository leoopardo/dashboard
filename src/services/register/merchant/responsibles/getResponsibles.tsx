/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantResponsiblesData,
  MerchantResponsiblesQuery,
} from "@src/services/types/register/merchants/responsibles/responsibles.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetMerchantResponsibles(
  params: MerchantResponsiblesQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantResponsiblesData | null | undefined
  >("MerchantResponsibles", async () => {
    const response = await api.get("core/merchant/responsible", {
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
