/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { GetTransferMerchantsData, GetTransferMerchantQuery } from "@src/services/types/moviments/transfersMerchants/getTransferBetweenMerchants.interface";
import { useQuery } from "react-query";

export function useGetTransferBetweenMerchants(params: GetTransferMerchantQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GetTransferMerchantsData | null | undefined
  >("BetweenMerchantsMoviments", async () => {
    const response = await api.get("core/merchant/balance/transfer/between-merchants", {
      params,
    });
    return response.data;
  });


  const transferMerchantsData: GetTransferMerchantsData | null | undefined = data;
  const isTransferMerchantsDataFetching = isFetching;
  const transferMerchantsDataError: any = error;
  const refetchTransferMerchantsData = refetch;
  return {
    transferMerchantsData,
    isTransferMerchantsDataFetching,
    transferMerchantsDataError,
    refetchTransferMerchantsData,
  };
}
