/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useQuery } from "react-query";

export function useCustomWebhookWithdraw(id?: number) {
  const { data, isFetching, error, refetch } = useQuery<
    { default: boolean, fields: string[], default_fields: string[] } | null | undefined
  >("partnerCustomWebhookWithdraw", async () => {
    const response = await api.get(`core/partner/custom-webhook/withdraw/${id}`, {});
    return response.data;
  });

  const customWebhookWithdraw = data;
  const isCustomWebhookWithdrawFetching = isFetching;
  const customWebhookWithdrawError: any = error;
  const refetchCustomWebhookWithdraw = refetch;

  return {
    customWebhookWithdraw,
    isCustomWebhookWithdrawFetching,
    customWebhookWithdrawError,
    refetchCustomWebhookWithdraw,
  };
}
