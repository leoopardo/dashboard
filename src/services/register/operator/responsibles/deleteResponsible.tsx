/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteOperatorResponsible(body: {
  operator_responsible_id?: number;
}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    { operator_responsible_id?: number } | null | undefined
  >("DeleteOperatorResponsible", async () => {
    const response = await api.delete("core/operator/responsible/delete", {
      data: body,
    });
    await queryClient.refetchQueries({ queryKey: ["OperatorResponsibles"] });
    return response.data;
  });

  const DeleteOperatorResponsibleMutate = mutate;
  const DeleteOperatorResponsibleIsLoading = isLoading;
  const DeleteOperatorResponsibleError: any = error;
  const DeleteOperatorResponsibleIsSuccess = isSuccess;
  const DeleteOperatorResponsibleReset = reset;

  return {
    DeleteOperatorResponsibleMutate,
    DeleteOperatorResponsibleIsLoading,
    DeleteOperatorResponsibleError,
    DeleteOperatorResponsibleIsSuccess,
    DeleteOperatorResponsibleReset,
  };
}
