/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useDeleteCustomDepositWebhook(id?: number) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("deleteCustomWebhookDeposit", async () => {
    const response = await api.delete(
      `core/partner/custom-webhook/deposit/${id}`,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["partnerCustomWebhookDeposit"],
    });
    return response.data;
  });
  const isDeleteCustomDepositWebhookLoading = isLoading;
  const DeleteCustomDepositWebhookError = error;
  const mutateDeleteCustomDepositWebhook = mutate;
  const isDeleteSCustomDepositWebhookuccess = isSuccess;
  return {
    isDeleteCustomDepositWebhookLoading,
    DeleteCustomDepositWebhookError,
    mutateDeleteCustomDepositWebhook,
    isDeleteSCustomDepositWebhookuccess,
  };
}
