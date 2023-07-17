import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useDeleteMerchantFeePlan(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    null | undefined
  >("deleteMerchantsFeePlans", async () => {
    const response = await api.delete(`core/merchant_fee_plans/${Number(id)}`, {
    
    });
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlans"] });
    return response.data;
  });

  const deleteMerchantFeePlanMutate = mutate;
  const deleteMerchantFeePlanIsLoading = isLoading;
  const deleteMerchantFeePlanError = error;
  const deleteMerchantFeePlanIsSuccess = isSuccess;

  return {
    deleteMerchantFeePlanMutate,
    deleteMerchantFeePlanIsLoading,
    deleteMerchantFeePlanError,
    deleteMerchantFeePlanIsSuccess,
  };
}
