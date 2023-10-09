/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useDeletePixManualRefund(id?: string | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("DeletePixManualRefund", async () => {
    const response = await api.delete(`refund/pix-manual${id}`, {});
    await queryClient.refetchQueries({
      queryKey: ["RefundManualDepositsManual"],
    });
    return response.data;
  });
  const isDeleteLoading = isLoading;
  const DeleteError = error;
  const mutateDelete = mutate;
  const isDeleteSuccess = isSuccess;
  return {
    isDeleteLoading,
    DeleteError,
    mutateDelete,
    isDeleteSuccess,
  };
}
