import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";

export interface CreateDeleteFileInterface {
  file_name: string;
  base64_file: string;
}

export function useDeleteFasPixLogo(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateDeleteFileInterface | null | undefined
  >("DeleteFastPixLogo", async () => {
    const response = await api.delete(
      `core/merchant/logos/delete/${id}`
    );
    await queryClient.refetchQueries({ queryKey: ["MerchantLogos"] });
    return response.data;
  });

  const DeletePixLogoMutate = mutate;
  const DeletePixLogoIsLoading = isLoading;
  const DeletePixLogoError = error;
  const DeletePixLogoIsSuccess = isSuccess;

  return {
    DeletePixLogoMutate,
    DeletePixLogoIsLoading,
    DeletePixLogoError,
    DeletePixLogoIsSuccess,
  };
}
