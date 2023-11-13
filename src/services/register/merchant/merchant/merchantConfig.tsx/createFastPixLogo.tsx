import { IMerchantLogoBody } from "@src/services/types/register/merchants/merchantConfig.interface";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";
import { queryClient } from "../../../../queryClient";

export function useCreateFastPixLogo(body: IMerchantLogoBody) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    IMerchantLogoBody | null | undefined
  >("createFastPixLogo", async () => {
    const response = await api.post("core/merchant/logos/upload", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantLogos"] });

    return response.data;
  });

  const CreateLogoMutate = mutate;
  const CreateLogoIsLoading = isLoading;
  const CreateLogoError = error;
  const CreateLogoIsSuccess = isSuccess;
  const ClearCreateLogo = reset;

  return {
    CreateLogoIsLoading,
    CreateLogoError,
    CreateLogoMutate,
    CreateLogoIsSuccess,
    ClearCreateLogo,
  };
}
