import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { MerchantQuery, MerchantResponse } from "../types/merchantsTypes";

export function useListMerchants(params: MerchantQuery) {
  const [data, setData] = useState<MerchantResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchMerchants = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("core/merchant/list", {
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
    fetchMerchants();
  }, [params]);

  const merchantsData = data;
  const isMerchantFetching = isFetching;
  const merchantError: any = error;
  const refetcMerchant = fetchMerchants;

  return {
    merchantsData,
    isMerchantFetching,
    merchantError,
    refetcMerchant,
  };
}
