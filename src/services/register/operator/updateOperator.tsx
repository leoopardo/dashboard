import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";

export function useUpdateOperator(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OperatorItem | null | undefined
  >("UpdateOperator", async () => {
    const response = await api.put("core/operator/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["Operators"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
  };
}
