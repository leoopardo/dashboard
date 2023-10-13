/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { AggregatorResponsiblesBody } from "@src/services/types/register/aggregators/responsibles/responsibles.interface";
import { useMutation } from "react-query";

export function useCreateAggregatorResponsible(
  body: AggregatorResponsiblesBody
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorResponsiblesBody | null | undefined
  >("CreateAggregatorResponsible", async () => {
    const response = await api.post("core/aggregator/responsible/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["AggregatorResponsibles"] });
    return response.data;
  });

  const AggregatorResponsibleMutate = mutate;
  const AggregatorResponsibleIsLoading = isLoading;
  const AggregatorResponsibleError: any = error;
  const AggregatorResponsibleIsSuccess = isSuccess;
  const AggregatorResponsibleReset = reset;

  return {
    AggregatorResponsibleMutate,
    AggregatorResponsibleIsLoading,
    AggregatorResponsibleError,
    AggregatorResponsibleIsSuccess,
    AggregatorResponsibleReset,
  };
}
