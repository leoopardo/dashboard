import { queryClient } from "@services/queryClient";
import { api } from "@src/config/api";
import { useMutation } from "react-query";
import { MerchantIpsItem } from "@src/services/types/register/merchants/merchantIpsConfig";

export function useCreateIpConfig(body: MerchantIpsItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    MerchantIpsItem | null | undefined
  >("CreateIpsConfig", async () => {
    const response = await api.post("core/merchant/create/ip", body, {});
    await queryClient.refetchQueries({ queryKey: ["IpsConfig"] });
    return response.data;
  });

  const createIpsMutate = mutate;
  const createIpsIsLoading = isLoading;
  const createIpsError = error;
  const createIpsIsSuccess = isSuccess;

  return {
    createIpsMutate,
    createIpsIsLoading,
    createIpsError,
    createIpsIsSuccess,
  };
}
