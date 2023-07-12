import { api } from "@config/api";
import { queryClient } from "@services/queryClient";
import { IDepositFeeItem } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useMutation } from "react-query";

export function useUpdateMerchantFeePlan(
  id?: number | string,
  body?: IDepositFeeItem | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IDepositFeeItem | null | undefined
  >("UpdateMerchantsFeePlans", async () => {
    const response = await api.put(`core/merchant_fee_plans/${id}`, body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsFeePlans"] });
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
