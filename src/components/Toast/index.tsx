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
}

export const Toast = ({
  actionSuccess,
  actionError,
  errorMessage,
  error,
  success,
}: ToastInterface) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (error) {
      toast.error(
        (ErrorList as any)[error?.response?.data?.message].length >= 1
          ? t(`error.${(ErrorList as any)[error?.response?.data?.message[0]]}`)
          : errorMessage ?? (ErrorList as any)[error?.response?.data?.message]
          ? t(`error.${(ErrorList as any)[error?.response?.data?.message]}`)
          : t("messages.action_error", {
              action: actionError,
              id: "toast-error",
            })
      );
    }
    if (success) {
      toast.success(
        t("messages.action_success", {
          action: actionSuccess,
          id: "toast-success",
        })
      );
    }
  }, [error, success]);

  return <></>;
};
