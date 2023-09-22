import { CustomTable } from "@src/components/CustomTable";
import { Col, Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";

export const MerchantsBalance = () => {
  const { t } = useTranslation();
  const OperationMoviments = {
    total: 5,
    items: [
      {
        merchant: "Empresa 1",
        transaction: 1000,
        payment: 1000,
        security: 1000,
        total: 1000,
      },
      {
        merchant: "Empresa 2",
        transaction: 1000,
        payment: 1000,
        security: 1000,
        total: 1000,
      },
      {
        merchant: "Empresa 3",
        transaction: 1000,
        payment: 1000,
        security: 1000,
        total: 1000,
      },
      {
        merchant: "Empresa 4",
        transaction: 1000,
        payment: 1000,
        security: 1000,
        total: 1000,
      },
      {
        merchant: "Empresa 5",
        transaction: 1000,
        payment: 1000,
        security: 1000,
        total: 1000,
      },
    ],
  };
  return (
    <Col span={24}>
      <Divider orientation="left">
        <Typography.Title level={4}>
          {t("table.merchants_balance")}
        </Typography.Title>
      </Divider>
      <CustomTable
        query={{}}
        setCurrentItem={() => {
          return;
        }}
        setQuery={() => {
          return;
        }}
        actions={[]}
        data={OperationMoviments}
        items={OperationMoviments.items}
        error={false}
        columns={[
          { name: "merchant", type: "text" },
          { name: "transaction", type: "value" },
          { name: "payment", type: "value" },
          { name: "security", type: "value" },
          { name: "total", type: "value" },
        ]}
        loading={false}
        label={["merchant", "value"]}
        disableScrollToTop
      />
    </Col>
  );
};
