import { api } from "../../../../config/api";

import { useQuery } from "react-query";
import { MerchantBlacklistQuery, MerchantBlacklistResponse } from "@src/services/types/register/merchants/merchantBlacklist.interface";

export function useGetRowsMerchantBlacklist(params: MerchantBlacklistQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  MerchantBlacklistResponse | null | undefined
  >(
    "MerchantBlacklist",
    async () => {
      const response = await api.get("blacklist/merchant-black-list", {
        params,
      });
      return response.data;
    }
  );

  const merchantBlacklistData = data;
  const isMerchantBlacklistDataFetching = isFetching;
  const merchantBlacklistDataError: any = error;
  const refetchMerchantBlacklistData = refetch;
  return {
    merchantBlacklistData,
    isMerchantBlacklistDataFetching,
    merchantBlacklistDataError,
    refetchMerchantBlacklistData,
  };
}
