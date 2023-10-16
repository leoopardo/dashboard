/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  PartnerQuery,
  PartnersResponse,
} from "@src/services/types/register/partners/partners.interface";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetPartners(params: PartnerQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    PartnersResponse | null | undefined
  >("Partners", async () => {
    const response = await api.get("core/partner", {
      params,
    });
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const PartnersData = data;
  const isSuccessPartnersData = isSuccess;
  const isPartnersDataFetching = isFetching;
  const PartnersDataError: any = error;
  const refetchPartnersData = refetch;
  return {
    PartnersData,
    isPartnersDataFetching,
    isSuccessPartnersData,
    PartnersDataError,
    refetchPartnersData,
  };
}
