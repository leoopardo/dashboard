/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { AccountQuery, OrganizationCurrentAccountsResponse } from "@src/services/types/register/organization/accounts.interface";

export function useGetOrganizationCurrentAccounts(params: AccountQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  OrganizationCurrentAccountsResponse | null | undefined
  >("OrganizationCurrentAccounts", async () => {
    const response = await api.get("core/account/", {
      params,
    });
    return response.data;
  });

  const CurrentAccountData = data;
  const isCurrentAccountDataFetching = isFetching;
  const CurrentAccountDataError: any = error;
  const refetchCurrentAccountData = refetch;
  return {
    CurrentAccountData,
    isCurrentAccountDataFetching,
    CurrentAccountDataError,
    refetchCurrentAccountData,
  };
}
