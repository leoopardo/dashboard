import { api } from "../../config/api";
import { getDeposit } from "../types/generatedDeposits.interface";
import { useMutation, useQuery } from "react-query";
import { useValidate } from "./validate";
import { useEffect } from "react";
import { queryClient } from "../queryClient";

interface TokenInterface {
  token: string;
}

export function useToken(
  user: { username: string; password: string },
  rememberMe: boolean
) {
  const { data, isLoading, error, mutate } = useMutation<
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

  const {
    refetchValidate,
    isValidateFetching,
    responseValidate,
    validateError,
    isSuccess,
  } = useValidate(rememberMe, data?.token);

  const responseLogin = data;
  const isLoginFetching = isLoading;
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
