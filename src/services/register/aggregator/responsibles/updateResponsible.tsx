/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { AggregatorResponsiblesBody } from "@src/services/types/register/aggregators/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useUpdateAggregatorResponsible(
  body: AggregatorResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorResponsiblesBody | null | undefined
  >("UpdateAggregatorResponsible", async () => {
    const response = await api.put("core/aggregator/responsible/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorResponsibles"] });
    return response.data;
  });

  const UpdateAggregatorResponsibleMutate = mutate;
  const UpdateAggregatorResponsibleIsLoading = isLoading;
  const UpdateAggregatorResponsibleError: any = error;
  const UpdateAggregatorResponsibleIsSuccess = isSuccess;
  const UpdateAggregatorResponsibleReset = reset;

  return {
    UpdateAggregatorResponsibleMutate,
    UpdateAggregatorResponsibleIsLoading,
    UpdateAggregatorResponsibleError,
    UpdateAggregatorResponsibleIsSuccess,
    UpdateAggregatorResponsibleReset,
  };
}
