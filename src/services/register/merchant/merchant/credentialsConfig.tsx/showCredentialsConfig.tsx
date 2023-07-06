import { api } from "@config/api";
import { useQuery } from "react-query";
import { IShowCredentialItem, IShowCredentialQuery } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";

export function useShowCredentialsConfig(params: IShowCredentialQuery) {
  const { data, isFetching, error, refetch,  } = useQuery<
  IShowCredentialItem | null
  >(
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
    }
  );

  const showCredentialConfigData = data;
  const isShowCredentialConfigFetching = isFetching;
  const showCredentialConfigError: any = error;
  const refetchShowCredentialConfigData = refetch;
  return {
    showCredentialConfigData,
    isShowCredentialConfigFetching,
    showCredentialConfigError,
    refetchShowCredentialConfigData,
  };
}