import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { AggregatorItem } from "@src/services/types/register/aggregators/aggregators.interface";

export function useCreateAggregator(body: AggregatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    AggregatorItem | null | undefined
  >("CreateAggregator", async () => {
    const response = await api.post("core/aggregator/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["Aggregators"] });
    return response.data;
  });

  const AggregatorMutate = mutate;
  const AggregatorIsLoading = isLoading;
  const AggregatorError = error;
  const AggregatorIsSuccess = isSuccess;

  return {
    AggregatorMutate,
    AggregatorIsLoading,
    AggregatorError,
    AggregatorIsSuccess,
  };
}
