/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useQuery } from "react-query";
import { api } from "../../config/api";
import { ValidateInterface } from "../types/validate.interface";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { queryClient } from "../queryClient";
let disabledNotification = false;

export function useValidate(rememberMe?: boolean, token?: string) {
  const { t } = useTranslation();
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    ValidateInterface | null | undefined
  >(
    "validate",
    async () => {
      const response = await api.get("/core/token/validate", {
        headers: {
          Authorization: `Bearer ${
            token ??
            secureLocalStorage.getItem("token") ??
            sessionStorage.getItem("token")
          }`,
        },
      });

      return response.data;
    },
    {
      refetchOnWindowFocus: rememberMe ? "always" : false,
      onError(err) {
        console.log(err);
        secureLocalStorage.removeItem("token");
        sessionStorage.removeItem("token");
      },
    }
  );
  useEffect(() => {
    if (isSuccess)
      api.defaults.headers.Authorization = `Bearer ${
        token ??
        secureLocalStorage.getItem("token") ??
        sessionStorage.getItem("token")
      }`;
  }, [isSuccess]);

  if (
    [
      "AGGREGATOR DISABLED",
      "OPERATOR DISABLED",
      "MERCHANT DISABLED",
      "PARTNER DISABLED",
    ].includes((error as any)?.response?.data?.message) &&
    !disabledNotification
  ) {
    toast.error(t("error.disabled_entity"));

    disabledNotification = true;

    secureLocalStorage.removeItem("token");
    sessionStorage.removeItem("token");
    queryClient.cancelMutations();
  }
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
