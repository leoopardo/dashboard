/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrganizationBalance } from "@src/services/types/consult/organization/balance/balnce.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetOrganizationBalance() {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationBalance | null | undefined
  >("OrganizationBalance", async () => {
    const response = await api.get("core/organization/account/", {});

    return response.data;
  });

  const OrganizationBalance: OrganizationBalance | null | undefined = {
    in: data?.in,
    pix_transactions_total: data?.pix_transactions_total,
    pix_amount_fee: data?.pix_amount_fee,
    out: data?.out,
    withdraw_transactions_total: data?.withdraw_transactions_total,
    withdraw_amount_fee: data?.withdraw_amount_fee,
    refund_transactions_total: data?.refund_transactions_total,
    refund_amount_fee: data?.refund_amount_fee,
    ...data,
  };
  const isOrganizationBalanceFetching = isFetching;
  const OrganizationBalanceError: any = error;
  const refetchOrganizationBalance = refetch;
  return {
    OrganizationBalance,
    isOrganizationBalanceFetching,
    OrganizationBalanceError,
    refetchOrganizationBalance,
  };
}
