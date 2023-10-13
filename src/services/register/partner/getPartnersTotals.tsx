/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { PartnerTotalResponse, PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { useQuery } from "react-query";

export function useGetPartnersTotals(params: PartnerQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  PartnerTotalResponse | null | undefined
  >("PartnersTotals", async () => {
    const response = await api.get("core/partner/totals", {
      params,
    });
    return response.data;
  });

  const PartnersTotalsData = data;
  const isPartnersTotalsDataFetching = isFetching;
  const PartnersTotalsDataError: any = error;
  const isSuccessPartnersTotalsData = isSuccess;
  const refetchPartnersTotalsData = refetch;
  return {
    PartnersTotalsData,
    isPartnersTotalsDataFetching,
    PartnersTotalsDataError,
    isSuccessPartnersTotalsData,
    refetchPartnersTotalsData,
  };
}
