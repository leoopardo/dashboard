import { queryClient } from "@src/services/queryClient";
import { api } from "../../../config/api";
import { useMutation } from "react-query";
import { AggregatorItem } from "@src/services/types/register/aggregators/aggregators.interface";

export function useUpdateAggregator(body: AggregatorItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
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

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
  };
}
