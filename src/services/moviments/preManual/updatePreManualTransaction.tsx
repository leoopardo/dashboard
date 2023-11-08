import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";

export function useUpdatePreManualTransaction(
  body: CreateMerchantManualTransaction | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateMerchantManualTransaction | null | undefined
  >("updatePreManualTransaction", async () => {
    const response = await api.put("core/pre-entry-account/", body, {});
    await queryClient.refetchQueries({ queryKey: ["PreManualEntry"] });
    return response.data;
  });

  const updatePreManualTransactionMutate = mutate;
  const updatePreManualTransactionIsLoading = isLoading;
  const updatePreManualTransactionError = error;
  const updatePreManualTransactionIsSuccess = isSuccess;
  return {
    updatePreManualTransactionMutate,
    updatePreManualTransactionIsLoading,
    updatePreManualTransactionError,
    updatePreManualTransactionIsSuccess,
  };
}
