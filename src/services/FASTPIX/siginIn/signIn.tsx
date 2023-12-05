/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useValidateFastPix } from "./validate";
import secureLocalStorage from "react-secure-storage";
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import axios from "axios";

interface TokenInterface {
  token: string;
}

export function useFastPixToken(
  user?: { username: string; password: string },
  auth?: string,
  rememberMe?: boolean
) {
  const token = useMutation<TokenInterface | null | undefined>(
    "FastPixToken",
    async () => {
      const response = await axios.post(
        "https://sandbox-v4.paybrokers.io/v4/mock/bank/fastpix/token",
        {},
        {
          auth: user,
          headers: { Authorization: auth ?? undefined },
        }
      );
      secureLocalStorage.removeItem("FastPixToken");
      sessionStorage.removeItem("FastPixToken");

      if (rememberMe) {
        secureLocalStorage.setItem("FastPixToken", response.data.token);
      }
      sessionStorage.setItem("FastPixToken", response.data.token);

      return response.data;
    }
  );

  const {
    isValidateFetching,
    responseValidate,
    validateError,
    isSuccess,
    refetchValidate,
  } = useValidateFastPix(rememberMe, token?.data?.token);

  useEffect(() => {
    if (token?.isSuccess) {
      refetchValidate();
      queryClient.refetchQueries(["FastPixToken"]);
      api.defaults.headers.Authorization = `Bearer ${token?.data?.token}`;
    }
  }, [token?.data?.token]);

  const LoginError: any = token.error;
  const Login = token.mutate;
  const tokenSuccess = token?.isSuccess;
  const tokenLoading = token?.isLoading;
  return {
    responseValidate,
    isValidateFetching,
    validateError,
    isSuccess,
    LoginError,
    tokenLoading,
    tokenSuccess,
    Login,
  };
}
