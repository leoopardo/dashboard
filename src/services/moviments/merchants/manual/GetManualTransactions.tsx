/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  GetMerchantMovimentsData,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";

import { useQuery } from "react-query";

export function useGetMerchantMoviments(params: GetMerchantMovimentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GetMerchantMovimentsData | null | undefined
  >("MerchantMoviments", async () => {
    const response = await api.get("core/entry-account", {
      params,
    });
    return response.data;
  });

  const MerchantMovimentsData: GetMerchantMovimentsData | null | undefined = {
    total_in_canceled: data?.total_in_canceled,
    total_in_processing: data?.total_in_processing,
    total_in_success: data?.total_in_success,
    total_out_canceled: data?.total_out_canceled,
    total_out_processing: data?.total_out_processing,
    total_out_success: data?.total_out_success,
    ...data,
  };
  const isMerchantMovimentsDataFetching = isFetching;
  const MerchantMovimentsDataError: any = error;
  const refetchMerchantMovimentsData = refetch;
  return {
    MerchantMovimentsData,
    isMerchantMovimentsDataFetching,
    MerchantMovimentsDataError,
    refetchMerchantMovimentsData,
  };
}
