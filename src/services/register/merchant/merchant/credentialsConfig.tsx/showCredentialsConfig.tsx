/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  IShowCredentialItem,
  IShowCredentialQuery,
} from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import { useQuery } from "react-query";

export function useShowCredentialsConfig(params: IShowCredentialQuery) {
  const { data, isFetching, error, refetch, isSuccess, remove } =
    useQuery<IShowCredentialItem | null>(
      "ShowCredentialsConfig",
      async () => {
        const response = await api.get("core/api-credentials", {
          params,
        });

        return response.data;
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: false,
      }
    );

  const showCredentialConfigData = data;
  const isShowCredentialConfigFetching = isFetching;
  const showCredentialConfigError: any = error;
  const showCredentialConfigisSuccess = isSuccess;
  const refetchShowCredentialConfigData = refetch;
  return {
    showCredentialConfigData,
    isShowCredentialConfigFetching,
    showCredentialConfigError,
    showCredentialConfigisSuccess,
    refetchShowCredentialConfigData,
    remove
  };
}
