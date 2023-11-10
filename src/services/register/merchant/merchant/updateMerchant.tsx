import { api } from "@config/api";
import { MerchantsItem } from "@services/types/register/merchants/merchantsRegister.interface";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useUpdateMerchant(body: MerchantsItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantsItem | null | undefined
  >("UpdateMerchant", async () => {
    const response = await api.put("core/merchant/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsRegister"] });
    await queryClient.refetchQueries({ queryKey: ["MerchantsPerBankTotals"] });

    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;
  const UpdateReset = reset;
  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,
    UpdateReset,
  };
}
