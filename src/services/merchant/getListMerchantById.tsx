/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";

export function useListMerchantById(params: any) {
  const { data, isFetching, error, refetch } = useQuery<
    { name: string; id: number } | null | undefined
  >("MerchantByIdList", async () => {
    const response = await api.get("core/merchant/list", {
      params,
    });
    return response.data;
  }, {enabled: false, keepPreviousData: false});

  const merchant = data;
  const isMerchantByIdFetching = isFetching;
  const merchantError: any = error;
  const refetchMerchantById = refetch;

  return {
    merchant,
    isMerchantByIdFetching,
    merchantError,
    refetchMerchantById,
  };
}
