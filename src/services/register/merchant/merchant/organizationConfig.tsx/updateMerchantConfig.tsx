import { api } from "@config/api";
import { queryClient } from "@src/services/queryClient";
import { IMerchantUpdateConfig } from "@src/services/types/register/merchants/merchantConfig.interface";
import { useMutation } from "react-query";

export function useUpdateOrganizationConfig(
  body?: IMerchantUpdateConfig | null
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IMerchantUpdateConfig | null | undefined
  >("UpdateOrganizationConfig", async () => {
    const response = await api.put(
      "core/merchant/config/paybrokers/update",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["OrganizationConfig"] });
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
