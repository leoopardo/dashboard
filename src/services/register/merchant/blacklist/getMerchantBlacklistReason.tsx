import { api } from "../../../../config/api";
import { useQuery } from "react-query";

export function useGetRowsMerchantBlacklist() {
  const { data, isFetching, error, refetch } = useQuery<
  string[] | null | undefined
  >(
    "MerchantBlacklistReason",
    async () => {
      const response = await api.get("blacklist/merchant-black-list/reasons", {});
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
