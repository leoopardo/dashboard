/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { OrganizationTransferBetweenAccountsData, OrganizationTransferBetweenAccountsQuery } from "@src/services/types/moviments/organization/transferBetweenAccounts.interface";
import { useQuery } from "react-query";

export function useGetOrganizationTransferBetweenAccounts(params: OrganizationTransferBetweenAccountsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  OrganizationTransferBetweenAccountsData | null | undefined
  >("getTransferBetweenOrganizationAccounts", async () => {
    const response = await api.get("core/organization/account/balance/transfer", {
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
