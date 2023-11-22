/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import secureLocalStorage from "react-secure-storage";
let disabledNotification = false;

export function useValidateFastPix(rememberMe?: boolean, token?: string) {
  const { t } = useTranslation();
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    | {
        id: string;
        document: string;
        name: string;
        username: string;
        pending_password_change: boolean;
        balance: number;
      }
    | null
    | undefined
  >(
    "FastPixTokenValidate",
    async () => {
      const response = await api.get("mock/bank/fastpix/token/validate", {
        headers: {
          Authorization: `Bearer ${
            token ??
            secureLocalStorage.getItem("FastPixToken") ??
            sessionStorage.getItem("FastPixToken")
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
        secureLocalStorage.getItem("FastPixToken") ??
        sessionStorage.getItem("FastPixToken")
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

    secureLocalStorage.removeItem("FastPixToken");
    sessionStorage.removeItem("FastPixToken");
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
