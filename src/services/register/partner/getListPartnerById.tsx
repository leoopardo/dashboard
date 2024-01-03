/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useListPartnerById(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    { name: string; id: number } | null | undefined
  >("partnerByIdList", async () => {
    const response = await api.get("core/partner", {
      params,
    });
    return response.data;
  }, {enabled: params.enabled === true});

  const Partner = data;
  const isPartnerFetching = isFetching;
  const PartnerError: any = error;
  const refetcPartner = refetch;

  return {
    Partner,
    isPartnerFetching,
    PartnerError,
    refetcPartner,
  };
}
