import { api } from "../../config/api";
import { useQuery } from "react-query";
import { ValidateInterface } from "../types/validate.interface";
import { useEffect } from "react";

export function useValidate(rememberMe?: boolean, token?: string) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    ValidateInterface | null | undefined
  >(
    "validate",
    async () => {
      const response = await api.get("/core/token/validate", {
        headers: {
          Authorization: `Bearer ${
            token ??
            localStorage.getItem("token") ??
            sessionStorage.getItem("token")
          }`,
        },
      });

      return response.data;
    },
    {
      refetchOnWindowFocus: rememberMe ? "always" : false,
    
    }
  );
  useEffect(() => {
    if (isSuccess)
      api.defaults.headers.Authorization = `Bearer ${
        token ??
        localStorage.getItem("token") ??
        sessionStorage.getItem("token")
      }`;
  }, [isSuccess]);

  const responseValidate = data;
  const isValidateFetching = isFetching;
  const validateError: any = error;
  const refetchValidate = refetch;
  return {
    responseValidate,
    isValidateFetching,
    validateError,
    refetchValidate,
    isSuccess,
  };
}
