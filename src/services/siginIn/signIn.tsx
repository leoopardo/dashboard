/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useMutation } from "react-query";
import { api } from "../../config/api";
import { queryClient } from "../queryClient";
import { useValidate } from "./validate";
import secureLocalStorage from "react-secure-storage";

interface TokenInterface {
  token: string;
}

export function useToken(
  user: { username: string; password: string },
  rememberMe: boolean
) {
  const { data, error, mutate, isLoading } = useMutation<
    TokenInterface | null | undefined
  >("token", async () => {
    const response = await api.post(
      "core/token",
      {},
      {
        auth: user,
      }
    );
    secureLocalStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (rememberMe) {
      secureLocalStorage.setItem("token", response.data.token);
    }
    sessionStorage.setItem("token", response.data.token);
    return response.data;
  });

  useEffect(() => {
    if (data?.token) {
      queryClient.refetchQueries(["validate"]);
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
    }
  }, [data]);

  const { isValidateFetching, responseValidate, validateError, isSuccess } =
    useValidate(rememberMe, data?.token);

  const LoginError: any = error;
  const Login = mutate;
  return {
    responseValidate,
    isValidateFetching,
    validateError,
    isSuccess,
    LoginError,
    isLoading,
    Login,
  };
}
