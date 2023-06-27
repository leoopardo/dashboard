import { api } from "@config/api";
import { PartnerQuery, PartnersResponse } from "@src/services/types/register/partners/partners.interface";
import { useQuery } from "react-query";

export function useGetPartners(params: PartnerQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  PartnersResponse | null | undefined
  >(
    "Partners",
    async () => {
      const response = await api.get("core/partner", {
        params,
      });
      return response.data;
    }
  );

  const PartnersData = data;
  const isPartnersDataFetching = isFetching;
  const PartnersDataError: any = error;
  const refetchPartnersData = refetch;
  return {
    PartnersData,
    isPartnersDataFetching,
    PartnersDataError,
    refetchPartnersData,
  };
}
