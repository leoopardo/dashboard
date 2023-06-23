import { api } from "../../../../config/api";

import { useQuery } from "react-query";
import { MerchantUsersResponse, MerchantUsersQuery } from "../../../types/merchantUsers.interface";

export function useGetRowsMerchantRegister(params: MerchantUsersQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  MerchantUsersResponse | null | undefined
  >(
    "MerchantsRegister",
    async () => {
      const response = await api.get("core/merchant", {
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

  const MerchantData = data;
  const isMerchantDataFetching = isFetching;
  const MerchantDataError: any = error;
  const refetchMerchantData = refetch;
  return {
    MerchantData,
    isMerchantDataFetching,
    MerchantDataError,
    refetchMerchantData,
  };
}
