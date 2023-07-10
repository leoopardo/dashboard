import { queryClient } from "@services/queryClient";
import { api } from "@config/api";
import { useMutation } from "react-query";
import { MerchantUserBodyItem } from "@src/services/types/register/merchants/merchantUsers.interface";

export function useUpdateMerchant(body: MerchantUserBodyItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  MerchantUserBodyItem | null | undefined
  >("UpdateMerchantUserr", async () => {
    const response = await api.put("core/user/update/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantUser"] });
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
