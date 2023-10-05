/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { MerchantTransferBetweenAccountsData, MerchantTransferBetweenAccountsQuery } from "@src/services/types/moviments/merchant/transferBetweenAccounts.interface";
import { useQuery } from "react-query";

export function useGetTransferBetweenAccounts(params: MerchantTransferBetweenAccountsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  MerchantTransferBetweenAccountsData | null | undefined
  >("getTransferBetweenMerchantAccounts", async () => {
    const response = await api.get("core/merchant/account/balance/transfer", {
      params,
    });
    return response.data;
  });

  const TransferBetweenAccountsData = data;
  const isTransferBetweenAccountsDataFetching = isFetching;
  const TransferBetweenAccountsDataError: any = error;
  const refetchTransferBetweenAccountsData = refetch;
  return {
    TransferBetweenAccountsData,
    isTransferBetweenAccountsDataFetching,
    TransferBetweenAccountsDataError,
    refetchTransferBetweenAccountsData,
  };
}
