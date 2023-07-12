/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useMutation } from "react-query";
import { api } from "../../config/api";
import { queryClient } from "../queryClient";
import { useValidate } from "./validate";

interface TokenInterface {
  token: string;
}

export function useToken(
  user: { username: string; password: string },
  rememberMe: boolean
) {
  const { data, error, mutate } = useMutation<
    TokenInterface | null | undefined
  >("token", async () => {
    const response = await api.post(
      "core/token",
      {},
      {
        auth: user,
      }
    );
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (rememberMe) {
      localStorage.setItem("token", response.data.token);
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
    Login,
  };
}
