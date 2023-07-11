import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { MerchantQuery, MerchantResponse } from "../types/register/merchants/merchants.interface";
import { useQuery } from "react-query";

export function useListMerchants(params: MerchantQuery) {
  const { data, isFetching, error, refetch,  } = useQuery<
  MerchantResponse | null | undefined
  >(
    "MerchantList",
    async () => {
      const response = await api.get("core/merchant/list", {
        params,
      });
      return response.data;
    }
  );

  useEffect(() => {
    refetch();
  }, [params]);

  const merchantsData = data;
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
