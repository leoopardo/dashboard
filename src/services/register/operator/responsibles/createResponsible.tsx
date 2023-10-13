/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { OperatorResponsiblesBody } from "@src/services/types/register/operators/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useCreateOperatorResponsible(
  body: OperatorResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    OperatorResponsiblesBody | null | undefined
  >("CreateOperatorResponsible", async () => {
    const response = await api.post("core/operator/responsible/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorResponsibles"] });
    return response.data;
  });

  const OperatorResponsibleMutate = mutate;
  const OperatorResponsibleIsLoading = isLoading;
  const OperatorResponsibleError: any = error;
  const OperatorResponsibleIsSuccess = isSuccess;
  const OperatorResponsibleReset = reset;

  return {
    OperatorResponsibleMutate,
    OperatorResponsibleIsLoading,
    OperatorResponsibleError,
    OperatorResponsibleIsSuccess,
    OperatorResponsibleReset,
  };
}
