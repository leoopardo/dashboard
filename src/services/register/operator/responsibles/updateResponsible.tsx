/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { OperatorResponsiblesBody } from "@src/services/types/register/operators/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useUpdateOperatorResponsible(
  body: OperatorResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OperatorResponsiblesBody | null | undefined
  >("UpdateOperatorResponsible", async () => {
    const response = await api.put("core/operator/responsible/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorResponsibles"] });
    return response.data;
  });

  const UpdateOperatorResponsibleMutate = mutate;
  const UpdateOperatorResponsibleIsLoading = isLoading;
  const UpdateOperatorResponsibleError: any = error;
  const UpdateOperatorResponsibleIsSuccess = isSuccess;
  const UpdateOperatorResponsibleReset = reset;

  return {
    UpdateOperatorResponsibleMutate,
    UpdateOperatorResponsibleIsLoading,
    UpdateOperatorResponsibleError,
    UpdateOperatorResponsibleIsSuccess,
    UpdateOperatorResponsibleReset,
  };
}
