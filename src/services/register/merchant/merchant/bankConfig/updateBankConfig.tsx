import { api } from "@config/api";
import { queryClient } from "@src/services/queryClient";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import { useMutation } from "react-query";

export function useUpdateBankConfig(body?: IMerchantBankUpdate | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IMerchantBankUpdate | null | undefined
  >("UpdateMerchantBankConfig", async () => {
    const response = await api.put(
      "core/merchant/config/banks/update",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantBankConfig"] });
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
