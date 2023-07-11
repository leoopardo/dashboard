import { queryClient } from "@src/services/queryClient";
import { api } from "@config/api";
import { useMutation } from "react-query";
import { MerchantsItem } from "@services/types/register/merchants/merchantsRegister.interface";

export function useUpdateMerchant(body: MerchantsItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantsItem | null | undefined
  >("UpdateMerchant", async () => {
    const response = await api.put("core/merchant/update", body, {});
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
