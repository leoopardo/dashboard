import { api } from "@config/api";
import { MerchantAccountUpdateBody } from "@services/types/register/merchants/merchantsRegister.interface";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export function useUpdateMerchantAccount(body: MerchantAccountUpdateBody) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantAccountUpdateBody | null | undefined
  >("UpdateMerchant", async () => {
    const response = await api.put("core/merchant/config/account/bulk/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsRegister"] });
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
