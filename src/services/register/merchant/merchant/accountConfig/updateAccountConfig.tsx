import { api } from "@config/api";
import { queryClient } from "@src/services/queryClient";
import { IMerchantAccountUpdate } from "@src/services/types/register/merchants/merchantConfig.interface";
import { useMutation } from "react-query";

export function useUpdateAccountConfig(body?: IMerchantAccountUpdate | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    IMerchantAccountUpdate | null | undefined
  >("UpdateMerchantBankConfig", async () => {
    const response = await api.put(
      "core/merchant/config/account/update",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantsShowRegister"] });
    await queryClient.refetchQueries({ queryKey: ["MerchantsAccountTotals"] });

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
    reset,
  };
}
