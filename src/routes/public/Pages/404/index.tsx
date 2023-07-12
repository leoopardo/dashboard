import { Result } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export const NotFount: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        height: "89vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle={t("messages.page_not_found")}
      />
    </div>
  );
};
