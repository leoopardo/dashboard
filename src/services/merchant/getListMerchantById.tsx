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
  });

  const merchant = data;
  const isMerchantFetching = isFetching;
  const merchantError: any = error;
  const refetcMerchant = refetch;

  return {
    merchant,
    isMerchantFetching,
    merchantError,
    refetcMerchant,
  };
}
