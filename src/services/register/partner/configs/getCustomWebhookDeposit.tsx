/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useCustomWebhookDeposit(id?: number) {
  const { data, isFetching, error, refetch } = useQuery<
    { default: boolean; fields: string[], default_fields: string[] } | null | undefined
  >("partnerCustomWebhookDeposit", async () => {
    const response = await api.get(
      `core/partner/custom-webhook/deposit/${id}`,
      {}
    );
    return response.data;
  });

  const customWebhookDeposit = data;
  const isCustomWebhookDepositFetching = isFetching;
  const customWebhookDepositError: any = error;
  const refetchCustomWebhookDeposit = refetch;

  return {
    customWebhookDeposit,
    isCustomWebhookDepositFetching,
    customWebhookDepositError,
    refetchCustomWebhookDeposit,
  };
}
