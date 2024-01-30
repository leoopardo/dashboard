import { queryClient } from "@src/services/queryClient";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useUpdateOperator(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
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
    UpdateIsSuccess,data
  };
}
