import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";

export function useCreateOperator(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OperatorItem | null | undefined
  >("CreateOperator", async () => {
    const response = await api.post("core/aggregator/create", body, {});
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
