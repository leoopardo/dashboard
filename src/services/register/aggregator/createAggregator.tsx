/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { AggregatorItem } from "@src/services/types/register/aggregators/aggregators.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useCreateAggregator(body: AggregatorItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorItem | null | undefined
  >("CreateAggregator", async () => {
    const response = await api.post("core/aggregator/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["Aggregators"] });
    return response.data;
  });

  const AggregatorMutate = mutate;
  const AggregatorIsLoading = isLoading;
  const AggregatorError: any = error;
  const AggregatorIsSuccess = isSuccess;
  const AggregatorReset = reset;

  return {
    AggregatorMutate,
    AggregatorReset,
    AggregatorIsLoading,
    AggregatorError,
    AggregatorIsSuccess,
  };
}
