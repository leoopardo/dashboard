/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { api } from "../../config/api";
import {
  MerchantQuery,
  MerchantResponse,
} from "../types/register/merchants/merchants.interface";

export function useListMerchants(params: MerchantQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantResponse | null | undefined
  >("MerchantList", async () => {
    const response = await api.get("core/merchant/list", {
      params,
    });
    return response.data;
  }, {enabled: false});

  const merchantsData = error
    ? ({ items: [], limit: 200, page: 1, total: 0 } as MerchantResponse)
    : data;
  const isMerchantFetching = isFetching;
  const merchantError: any = error;
  const refetcMerchant = refetch;

  return {
    merchantsData,
    isMerchantFetching,
    merchantError,
    refetcMerchant,
  };
}
