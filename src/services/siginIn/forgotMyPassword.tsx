/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { useMutation } from "react-query";

export function useForgotMyPassword(body: { username?: string }) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    any | null | undefined
  >("ForgotMyPassword", async () => {
    const response = await api.post("core/forgot-password", body, {});
    return response.data;
  });

  const ForgotMyPasswordMutate = mutate;
  const ForgotMyPasswordIsLoading = isLoading;
  const ForgotMyPasswordError: any = error;
  const ForgotMyPasswordIsSuccess = isSuccess;
  const ForgotMyPasswordReset = reset;

  return {
    ForgotMyPasswordMutate,
    ForgotMyPasswordReset,
    ForgotMyPasswordIsLoading,
    ForgotMyPasswordError,
    ForgotMyPasswordIsSuccess,
    data
  };
}
