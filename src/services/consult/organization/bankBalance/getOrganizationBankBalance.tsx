/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { BankBalanceDataInterface } from "@src/services/types/consult/organization/bankBalance/bankBalance.interface";

export function useGetOrganizationBankBalance() {
  const { data, isFetching, error, refetch } = useQuery<
  BankBalanceDataInterface | null | undefined
  >("OrganizationBankBalance", async () => {
    const response = await api.get("bank/balance/values", {});

    return response.data;
  });

  const OrganizationBankBalance = data;
  const isOrganizationBankBalanceFetching = isFetching;
  const OrganizationBankBalanceError: any = error;
  const refetchOrganizationBankBalance = refetch;
  return {
    OrganizationBankBalance,
    isOrganizationBankBalanceFetching,
    OrganizationBankBalanceError,
    refetchOrganizationBankBalance,
  };
}
