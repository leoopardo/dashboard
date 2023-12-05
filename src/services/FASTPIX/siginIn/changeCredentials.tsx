/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import axios from "axios";
import { useMutation } from "react-query";

export function useChangeFastPixCredentials({
  body,
}: {
  body: { username?: string; password?: string };
}) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    | {
        token: string;
      }
    | null
    | undefined
  >("ChangeCredentials", async () => {
    const response = await axios.put(
      "https://sandbox-v4.paybrokers.io/v4/mock/bank/fastpix/user/update/credentials",
      { ...body }
    );
    await queryClient.refetchQueries({ queryKey: ["FastPixTokenValidate"] });
    return response.data;
  });

  const FastPixCredentialsMutate = mutate;
  const FastPixCredentialsIsLoading = isLoading;
  const FastPixCredentialsError: any = error;
  const FastPixCredentialsIsSuccess = isSuccess;
  const FastPixCredentialsReset = reset;
  const FastPixCredentialsData = data;

  return {
    FastPixCredentialsMutate,
    FastPixCredentialsReset,
    FastPixCredentialsIsLoading,
    FastPixCredentialsError,
    FastPixCredentialsIsSuccess,
    FastPixCredentialsData,
  };
}
