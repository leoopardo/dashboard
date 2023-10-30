import { api } from "@config/api";
import { queryClient } from "@services/queryClient";
import { IDepositFeePlansDetails } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useMutation } from "react-query";

export function useUpdateMerchantFeePlanDetails(
  body?: IDepositFeePlansDetails | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IDepositFeePlansDetails | null | undefined
  >("UpdateMerchantsFeePlansDetails", async () => {
    const response = await api.put(`core/fee_plans_details/update`, body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlansDetails"] });
    return response.data;
  });

  const updateMutate = mutate;
  const updateIsLoading = isLoading;
  const updateError = error;
  const updateIsSuccess = isSuccess;

  return {
    updateMutate,
    updateIsLoading,
    updateError,
    updateIsSuccess,
  };
}
