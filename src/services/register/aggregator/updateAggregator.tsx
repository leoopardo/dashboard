import { queryClient } from "@src/services/queryClient";
import { AggregatorItem } from "@src/services/types/register/aggregators/aggregators.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useUpdateAggregator(body: AggregatorItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    AggregatorItem | null | undefined
  >("UpdateAggregator", async () => {
    const response = await api.put("core/aggregator/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["Aggregators"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;
  const UpdateReset = reset;
  return {
    UpdateMutate,
    UpdateReset,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
  };
}
