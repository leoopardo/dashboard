import { Row, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { TabWithdrawWebhook } from "./tabs/customWithdrawWebhook";
import { TabDepositWebhook } from "./tabs/customDepositWebhook";

export const CustomWebhookPartners = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPartner = location?.state?.id;

  const TabComponents: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.deposit_webhook"),
      children: <TabDepositWebhook currentPartner={currentPartner} />,
    },
    {
      key: "2",
      label: t("table.withdraw_webhook"),
      children: <TabWithdrawWebhook currentPartner={currentPartner} />,
    },
  ];

  return (
    <Row style={{ padding: 25 }}>
      <Tabs
        defaultActiveKey="1"
        items={TabComponents}
        style={{ width: "100%" }}
      />
    </Row>
  );
};
