import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { MerchantIpsItem } from "@src/services/types/register/merchants/merchantIpsConfig";
import { useMutation } from "react-query";

export function useDeleteIpConfig(params?: MerchantIpsItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantIpsItem | null | undefined
  >("deleteIpsConfig", async () => {
    const response = await api.delete("core/merchant/delete/ip", {
      data: params,
    });
    await queryClient.refetchQueries({ queryKey: ["IpsConfig"] });
    return response.data;
  });

  const deleteIpsConfigMutate = mutate;
  const deleteIpsConfigIsLoading = isLoading;
  const deleteIpsConfigError = error;
  const deleteIpsConfigIsSuccess = isSuccess;

  return {
    deleteIpsConfigMutate,
    deleteIpsConfigIsLoading,
    deleteIpsConfigError,
    deleteIpsConfigIsSuccess,
  };
}
