/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankBalanceInterface } from "@src/services/types/consult/organization/bankBalance/bankBalance.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

interface bankBalanceInterface {
  bank?: string;
}
export function useGetBankBalance({ bank }: bankBalanceInterface) {
  const { data, isFetching, error, refetch } = useQuery<
  BankBalanceInterface | null | undefined
  >(bank ?? "bankBalance", async () => {
    const response = await api.get(`bank/balance/values${bank ? `/${bank}`: ""}`, {});

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
