import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { ApprovePreManualTransaction } from "@src/services/types/moviments/preOperations/approvePreManual";

export function useApprovePreManualTransaction(
  body: ApprovePreManualTransaction | null
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  ApprovePreManualTransaction | null | undefined
  >("approvePreManualTransaction", async () => {
    const response = await api.post("core/pre-entry-account/approve", body, {});
    await queryClient.refetchQueries({ queryKey: ["PreManualEntry"] });
    return response.data;
  });

  const approvePreManualSuccess = isSuccess
  const approvePreManualLoading = isLoading
  const approvePreManualError = error
  const approvePreManualReset = reset
  const approvePreManualMutate = mutate


  return {
    approvePreManualLoading,
    approvePreManualError,
    approvePreManualMutate,
    approvePreManualSuccess,
    approvePreManualReset
  };
}