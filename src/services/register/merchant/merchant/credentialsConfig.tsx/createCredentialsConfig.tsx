import { queryClient } from "@services/queryClient";
import { api } from "@src/config/api";
import { useMutation } from "react-query";
import { IBodyCredentialItem } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";

export function useCreateCredentialsConfig(body: IBodyCredentialItem) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    IBodyCredentialItem | null | undefined
  >("CreateCredentialsConfig", async () => {
    const response = await api.post("core/api-credentials/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["CreateCredentialsConfig"] });
    return response.data;
  });

  const CreateCredentialsMutate = mutate;
  const CreateCredentialsIsLoading = isLoading;
  const CreateCredentialsError = error;
  const CreateCredentialsIsSuccess = isSuccess;

  return {
    CreateCredentialsMutate,
    CreateCredentialsIsLoading,
    CreateCredentialsError,
    CreateCredentialsIsSuccess,
  };
}
