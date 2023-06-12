import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useQuery } from "react-query";
import moment from "moment";
import { MerchantQuery, MerchantResponse } from "../types/merchantsTypes";

export function useListMerchants(params: MerchantQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantResponse | null | undefined
  >(
    "merchants",
    async () => {
      const response = await api.get("core/merchant/list", {
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
