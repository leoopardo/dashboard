/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        errorMessage ??
          t("messages.action_error", {
            action: actionError,
          })
      );
    }
    if (success) {
      toast.success(
        t("messages.action_success", {
          action: actionSuccess,
        })
      );
    }
  }, [error, success]);

  return <></>;
};
