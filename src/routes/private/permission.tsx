/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "antd";
import { useTranslation } from "react-i18next";

interface PermissionInterface {
  permission?: boolean;
  children?: any;
}

export const Permission = ({ permission, children }: PermissionInterface) => {
  const { t } = useTranslation();
  return permission ? (
    <>{children}</>
  ) : (
    <Result status="403" title="403" subTitle={t("error.403")} />
  );
};
