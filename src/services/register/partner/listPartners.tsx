import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import {
  PartnerQuery,
  PartnersResponse,
} from "../../types/register/partners/partners.interface";

export function useListPartners(params: PartnerQuery) {
  const [data, setData] = useState<PartnersResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchPartners = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("core/partner", {
        params,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [params]);

  const partnersData = data;
  const isPartnersFetching = isFetching;
  const partnersError: any = error;
  const refetcPartners = fetchPartners;

  return {
    partnersData,
    isPartnersFetching,
    partnersError,
    refetcPartners,
  };
}
