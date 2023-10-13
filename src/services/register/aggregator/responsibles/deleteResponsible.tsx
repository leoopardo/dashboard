/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteAggregatorResponsible(body: {
  aggregator_responsible_id?: number;
}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    { aggregator_responsible_id?: number } | null | undefined
  >("DeleteAggregatorResponsible", async () => {
    const response = await api.delete("core/aggregator/responsible/delete", {
      data: body,
    });
    await queryClient.refetchQueries({ queryKey: ["AggregatorResponsibles"] });
    return response.data;
  });

  const DeleteAggregatorResponsibleMutate = mutate;
  const DeleteAggregatorResponsibleIsLoading = isLoading;
  const DeleteAggregatorResponsibleError: any = error;
  const DeleteAggregatorResponsibleIsSuccess = isSuccess;
  const DeleteAggregatorResponsibleReset = reset;

  return {
    DeleteAggregatorResponsibleMutate,
    DeleteAggregatorResponsibleIsLoading,
    DeleteAggregatorResponsibleError,
    DeleteAggregatorResponsibleIsSuccess,
    DeleteAggregatorResponsibleReset,
  };
}
