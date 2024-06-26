/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorList } from "@src/utils/errors";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ToastInterface {
  actionSuccess: string;
  actionError: string;
  errorMessage?: string;
  error: any;
  success: boolean;
  timeout?: number;
}

export const Toast = ({
  actionSuccess,
  actionError,
  errorMessage,
  error,
  success,
  timeout,
}: ToastInterface) => {
  const { t } = useTranslation();
  console.log((ErrorList as any)[error?.response?.data?.message]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error(
          (ErrorList as any)[error?.response?.data?.message] &&
            Array.isArray((ErrorList as any)[error?.response?.data?.message])
            ? t(
                `error.${(ErrorList as any)[error?.response?.data?.message[0]]}`
              )
            : errorMessage ?? (ErrorList as any)[error?.response?.data?.message]
            ? t(`error.${(ErrorList as any)[error?.response?.data?.message]}`)
            : t("messages.action_error", {
                action: actionError,
                id: "toast-error",
              })
        );
      }, timeout || 0);
    }
    if (success) {
      setTimeout(() => {
        toast.success(
          t("messages.action_success", {
            action: actionSuccess,
            id: "toast-success",
          })
        );
      }, timeout || 0);
    }
  }, [error, success]);

  return <></>;
};
