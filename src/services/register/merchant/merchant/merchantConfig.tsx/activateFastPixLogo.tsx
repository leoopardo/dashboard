import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";

export interface CreateDeleteFileInterface {
  file_name: string;
  base64_file: string;
}

export function useActivateFasPixLogo(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateDeleteFileInterface | null | undefined
  >("ActivateFastPixLogo", async () => {
    const response = await api.post(
      `core/merchant/logos/active/${id}`
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantLogos"] });
    return response.data;
  });

  const ActivatePixLogoMutate = mutate;
  const ActivatePixLogoIsLoading = isLoading;
  const ActivatePixLogoError = error;
  const ActivatePixLogoIsSuccess = isSuccess;

  return {
    ActivatePixLogoMutate,
    ActivatePixLogoIsLoading,
    ActivatePixLogoError,
    ActivatePixLogoIsSuccess,
  };
}
