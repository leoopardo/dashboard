/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import {
  PartnerQuery,
  PartnersResponse,
} from "../../types/register/partners/partners.interface";
import { useQuery } from "react-query";

export function useListPartners(params: PartnerQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  PartnersResponse | null | undefined
>("listPartners", async () => {
  const response = await api.get("core/partner", {
    params,
  });
  return response.data;
});

  const partnersData = data;
  const isPartnersFetching = isFetching;
  const partnersError: any = error;
  const refetcPartners = refetch;

  return {
    partnersData,
    isPartnersFetching,
    partnersError,
    refetcPartners,
  };
}
