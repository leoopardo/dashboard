/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useDeleteCustomWithdrawWebhook(id?: number) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("deleteCustomWebhookWithdraw", async () => {
    const response = await api.delete(
      `core/partner/custom-webhook/withdraw/${id}`,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["partnerCustomWebhookWithdraw"],
    });
    return response.data;
  });
  const isDeleteCustomWithdrawWebhookLoading = isLoading;
  const DeleteCustomWithdrawWebhookError = error;
  const mutateDeleteCustomWithdrawWebhook = mutate;
  const isDeleteSCustomWithdrawWebhookuccess = isSuccess;
  return {
    isDeleteCustomWithdrawWebhookLoading,
    DeleteCustomWithdrawWebhookError,
    mutateDeleteCustomWithdrawWebhook,
    isDeleteSCustomWithdrawWebhookuccess,
  };
}
