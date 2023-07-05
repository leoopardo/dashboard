import { api } from "@config/api";

import { useQuery } from "react-query";
import { IMerchantConfigResponse } from "@src/services/types/register/merchants/merchantConfig.interface";

export function useMerchantConfig(id?: string) {
  const { data, isFetching, error, refetch } = useQuery<
  IMerchantConfigResponse | null
  >(
    "MerchantConfig",
    async () => {
      const response = await api.get("core/merchant/config/merchant", {
        params: {merchant_id: id},
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const merchantConfigData = data;
  const isMerchantConfigFetching = isFetching;
  const merchantConfigError: any = error;
  const refetchMerchantConfigData = refetch;
  return {
    merchantConfigData,
    isMerchantConfigFetching,
    merchantConfigError,
    refetchMerchantConfigData,
  };
}