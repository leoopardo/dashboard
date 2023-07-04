import { queryClient } from "@src/services/queryClient";
import { api } from "@config/api";
import { useMutation } from "react-query";
import { IMerchantFeesUpdate} from "@src/services/types/register/merchants/merchantFeesConfig";

export function useUpdateFeesConfig(body?: IMerchantFeesUpdate | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IMerchantFeesUpdate | null | undefined
  >("UpdateMerchantFeesConfig", async () => {
    const response = await api.put("core/merchant/config/fees/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantFeesConfig"] });
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
