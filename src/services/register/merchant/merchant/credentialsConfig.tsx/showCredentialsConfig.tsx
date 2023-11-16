/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { useQuery } from "react-query";
import { useState } from "react";
import {
  IShowCredentialItem,
  IShowCredentialQuery,
} from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";

export function useShowCredentialsConfig(params: IShowCredentialQuery) {
  const [errorState, setErrorState] = useState(false);
  const showCredentialsConfigQueryKey = ["ShowCredentialsConfig", params];
  const { data, isFetching, error, refetch, isSuccess } =
    useQuery<IShowCredentialItem | null>(
      showCredentialsConfigQueryKey,
      async () => {
        const response = await api.get("core/api-credentials", {
          params,
        });
        if (response.data !== null) {
          setErrorState(false);
        } else {
          setErrorState(true);
        }
        return response.data;
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const showCredentialConfigData = data;
  const isShowCredentialConfigFetching = isFetching;
  const showCredentialConfigError: any = errorState ?  error : null;
  const showCredentialConfigisSuccess = isSuccess;
  const refetchShowCredentialConfigData = refetch;
  return {
    showCredentialConfigData,
    isShowCredentialConfigFetching,
    showCredentialConfigError,
    showCredentialConfigisSuccess,
    refetchShowCredentialConfigData,
  };
}
