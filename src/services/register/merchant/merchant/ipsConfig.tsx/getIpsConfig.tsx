/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantIpsQuery,
  MerchantIpsResponse,
} from "@src/services/types/register/merchants/merchantIpsConfig";
import { useQuery } from "react-query";

export function useGetIpsConfig(params: MerchantIpsQuery) {
  const { data, isFetching, error, refetch } =
    useQuery<MerchantIpsResponse | null>(
      "IpsConfig",
      async () => {
        const response = await api.get("core/merchant/ip", {
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

  const ipsConfigData = data;
  const isIpsConfigFetching = isFetching;
  const ipsConfigError: any = error;
  const refetchIpsConfigData = refetch;
  return {
    ipsConfigData,
    isIpsConfigFetching,
    ipsConfigError,
    refetchIpsConfigData,
  };
}
