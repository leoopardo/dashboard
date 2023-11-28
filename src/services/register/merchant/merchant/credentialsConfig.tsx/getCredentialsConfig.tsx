/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  CredentialQuery,
  ICredentialResponse,
} from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import { useQuery } from "react-query";

export function useGetCredentialsConfig(params: CredentialQuery) {
  const { data, isFetching, error, refetch } =
    useQuery<ICredentialResponse | null>(
      "CredentialsConfig",
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
      }
    );
  const credentialConfigData = data;
  const isCredentialConfigFetching = isFetching;
  const credentialConfigError: any = error;
  const refetchCredentialConfigData = refetch;
  return {
    credentialConfigData,
    isCredentialConfigFetching,
    credentialConfigError,
    refetchCredentialConfigData,
  };
}
