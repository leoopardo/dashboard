import { queryClient } from "@src/services/queryClient";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useCreateOperator(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OperatorItem | null | undefined
  >("CreateOperator", async () => {
    const response = await api.post("core/operator/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["Operators"] });
    return response.data;
  });

  const OperatorMutate = mutate;
  const OperatorIsLoading = isLoading;
  const OperatorError = error;
  const OperatorIsSuccess = isSuccess;

  return {
    OperatorMutate,
    OperatorIsLoading,
    OperatorError,
    OperatorIsSuccess,
  };
}
