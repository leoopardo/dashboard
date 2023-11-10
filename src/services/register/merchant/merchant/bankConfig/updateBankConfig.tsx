import { api } from "@config/api";
import { queryClient } from "@src/services/queryClient";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import { useMutation } from "react-query";

export function useUpdateBankConfig(body?: IMerchantBankUpdate | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    IMerchantBankUpdate | null | undefined
  >("UpdateMerchantBankConfig", async () => {
    const response = await api.put(
      "core/merchant/config/banks/update",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantsRegister"] });
    await queryClient.refetchQueries({ queryKey: ["MerchantsPerBankTotals"] });

    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateIsLoading = isLoading;
  const UpdateBankError = error;
  const UpdateBankIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateBankError,
    UpdateBankIsSuccess,reset
  };
}
