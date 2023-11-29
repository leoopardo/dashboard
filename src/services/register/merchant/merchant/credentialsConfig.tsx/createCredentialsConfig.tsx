import { queryClient } from "@services/queryClient";
import { api } from "@src/config/api";
import { IBodyCredentialItem } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import { useMutation } from "react-query";

export function useCreateCredentialsConfig(body: IBodyCredentialItem) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    IBodyCredentialItem | null | undefined
  >("CreateCredentialsConfig", async () => {
    const response = await api.post("core/api-credentials/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["CredentialsConfig"] });
    return response.data;
  });

  const CreateCredentialsMutate = mutate;
  const CreateCredentialsIsLoading = isLoading;
  const CreateCredentialsError = error;
  const CreateCredentialsIsSuccess = isSuccess;
  const CreateCredentialsIsReset = reset;

  return {
    CreateCredentialsMutate,
    CreateCredentialsIsLoading,
    CreateCredentialsError,
    CreateCredentialsIsSuccess,
    CreateCredentialsIsReset,
    data,
  };
}
