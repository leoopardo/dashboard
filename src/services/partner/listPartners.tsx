import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useQuery } from "react-query";
import moment from "moment";
import { PartnerQuery, PartnersResponse } from "../types/partnerTypes";

export function useListPartners(params: PartnerQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    PartnersResponse | null | undefined
  >(
    "partners",
    async () => {
      const response = await api.get("core/partner", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

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
