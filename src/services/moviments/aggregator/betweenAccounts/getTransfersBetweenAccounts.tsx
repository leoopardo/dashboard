/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { AggregatorTransferBetweenAccountsData, AggregatorTransferBetweenAccountsQuery } from "@src/services/types/moviments/aggregator/transferBetweenAccounts.interface";
import { useQuery } from "react-query";

export function useGetAggregatorTransferBetweenAccounts(params: AggregatorTransferBetweenAccountsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  AggregatorTransferBetweenAccountsData | null | undefined
  >("getAggregatorTransferBetweenMerchantAccounts", async () => {
    const response = await api.get("core/aggregator/account/balance/transfer", {
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
