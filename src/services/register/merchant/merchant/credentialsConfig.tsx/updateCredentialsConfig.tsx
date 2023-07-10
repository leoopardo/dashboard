import { queryClient } from "@src/services/queryClient";
import { api } from "@config/api";
import { useMutation } from "react-query";
import { IBodyCredentialItem } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
export function useUpdateCredentialConfig(body?: IBodyCredentialItem | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  IBodyCredentialItem | null | undefined
  >("UpdateCredentialsConfig", async () => {
    const response = await api.put("core/api-credentials/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["CredentialsConfig"] });
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
