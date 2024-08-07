/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";

import { MerchantFeesResponse } from "@src/services/types/register/merchants/merchantFeesConfig.interface";
import { useQuery } from "react-query";

export function useMerchantFeesConfig(id?: string) {
  const { data, isFetching, error, refetch } =
    useQuery<MerchantFeesResponse | null>(
      "MerchantFeesConfig",
      async () => {
        const response = await api.get("core/merchant/config/fees", {
          params: { merchant_id: id },
        });
        return response.data;
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
      }
    );

  const merchantFeesData = data;
  const isMerchantFeesFetching = isFetching;
  const merchantFeesError: any = error;
  const refetchMerchantFeesData = refetch;
  return {
    merchantFeesData,
    isMerchantFeesFetching,
    merchantFeesError,
    refetchMerchantFeesData,
  };
}
