import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteFeePlanDetail(id?: number) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    null | undefined
  >("deleteMerchantsFeePlansDetail", async () => {
    const response = await api.delete('core/fee_plans_details/delete', {
      data: {
        fee_plans_details_id: Number(id)
      }
    });
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlansDetails"] });
    return response.data;
  });

  const deleteFeePlanDetailMutate = mutate;
  const deleteFeePlanDetailIsLoading = isLoading;
  const deleteFeePlanDetailError = error;
  const deleteFeePlanDetailIsSuccess = isSuccess;

  return {
    deleteFeePlanDetailMutate,
    deleteFeePlanDetailIsLoading,
    deleteFeePlanDetailError,
    deleteFeePlanDetailIsSuccess,
  };
}
