import { api } from "@config/api";
import { useQuery } from "react-query";
import { ICredentialResponse, CredentialQuery } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";

export function useCredentialsConfig(params: CredentialQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  ICredentialResponse | null
  >(
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