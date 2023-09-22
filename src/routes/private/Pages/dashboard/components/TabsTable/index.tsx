import { Divider, Tabs, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { OperationMovementsTab } from "./operationMovementsTab";
import { FinancialMovementsTab } from "./financialMovementsTab";
import { FeeTab } from "./feeTab";

export const TabsTable = () => {
  const { t } = useTranslation();
  return (
    <>
      <Divider orientation="left">
        <Typography.Title level={4}>Ranking </Typography.Title>
      </Divider>
      <Tabs
        defaultActiveKey="1"
        type="line"
        size="large"
        items={[
          {
            label: t("table.financial_movements"),
            key: "financial_movements",
            children: <FinancialMovementsTab />,
          },
          {
            label: t("table.operation_moviments"),
            key: "operation_moviments",
            children: <OperationMovementsTab />,
          },
          {
            label: t("table.fees"),
            key: "fees",
            children: <FeeTab />,
          },
        ]}
      />
    </>
  );
};
