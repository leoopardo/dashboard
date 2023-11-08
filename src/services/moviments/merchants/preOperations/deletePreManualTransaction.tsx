/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeletePreManualTransaction(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { operator_responsible_id?: number } | null | undefined
  >("deletePreManualEntry", async () => {
    const response = await api.delete(`core/pre-entry-account/${id}`);
    await queryClient.refetchQueries({ queryKey: ["PreManualEntry"] });
    return response.data;
  });

  const deletePreManualTransactionMutate = mutate;
  const deletePreManualTransactionIsLoading = isLoading;
  const deletePreManualTransactionError: any = error;
  const deletePreManualTransactionIsSuccess = isSuccess;

  return {
    deletePreManualTransactionMutate,
    deletePreManualTransactionIsLoading,
    deletePreManualTransactionError,
    deletePreManualTransactionIsSuccess,
  };
}