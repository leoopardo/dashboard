/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useValidateFastPix } from "./validate";
import secureLocalStorage from "react-secure-storage";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";

interface TokenInterface {
  token: string;
}

export function useFastPixToken(
  user?: { username: string; password: string },
  auth?: string,
  rememberMe?: boolean
) {
  const { data, error, mutate, isLoading } = useMutation<
    TokenInterface | null | undefined
  >("FastPixToken", async () => {
    const response = await api.post(
      "mock/bank/fastpix/token",
      { auth },
      {
        auth: user,
      }
    );
    secureLocalStorage.removeItem("FastPixToken");
    sessionStorage.removeItem("FastPixToken");

    if (rememberMe) {
      secureLocalStorage.setItem("FastPixToken", response.data.token);
    }
    sessionStorage.setItem("FastPixToken", response.data.token);

    return response.data;
  });

  useEffect(() => {
    if (data?.token) {
      queryClient.refetchQueries(["FastPixTokenValidate"]);
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
    }
  }, [data]);

  const { isValidateFetching, responseValidate, validateError, isSuccess } =
  useValidateFastPix(rememberMe, data?.token);

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
