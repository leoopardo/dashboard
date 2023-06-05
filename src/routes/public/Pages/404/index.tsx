import React from "react";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";

export const NotFount: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Empty description={t("messages.page_not_found")} />
    </div>
  );
};
