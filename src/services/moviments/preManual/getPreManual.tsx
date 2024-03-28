/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  GetMerchantMovimentsData,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";

import { useQuery } from "react-query";

export function useGetPreManualEntry(params: GetMerchantMovimentsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GetMerchantMovimentsData | null | undefined
  >("PreManualEntry", async () => {
    const response = await api.get("core/pre-entry-account", {
      params: { ...params, category_id: params.merchant_category_id },
    });
    return response.data;
  });

  const preManualData: GetMerchantMovimentsData | null | undefined = {
    total_in_canceled: data?.total_in_canceled,
    total_in_processing: data?.total_in_processing,
    total_in_success: data?.total_in_success,
    total_out_canceled: data?.total_out_canceled,
    total_out_processing: data?.total_out_processing,
    total_out_success: data?.total_out_success,
    ...data,
  };
  const isPreManualDataFetching = isFetching;
  const preManualDataError: any = error;
  const refetchPreManualData = refetch;
  return {
    preManualData,
    isPreManualDataFetching,
    preManualDataError,
    refetchPreManualData,
  };
}
