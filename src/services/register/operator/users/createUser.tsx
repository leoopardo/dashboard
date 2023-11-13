import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateOperatorUser(body: OperatorItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OperatorItem | null | undefined
  >("createOperatorUser", async () => {
    const response = await api.post("core/user/create/operator", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
     reset
  };
}
