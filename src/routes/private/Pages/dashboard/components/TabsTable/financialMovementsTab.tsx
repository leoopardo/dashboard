import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

export const FinancialMovementsTab = () => {
  const { t } = useTranslation();

  const FinancialMoviments = {
    total: 5,
    items: [
      {
        merchant: "Empresa 1",
        value: 1000,
      },
      {
        merchant: "Empresa 2",
        value: 1000,
      },
      {
        merchant: "Empresa 3",
        value: 1000,
      },
      {
        merchant: "Empresa 4",
        value: 1000,
      },
      {
        merchant: "Empresa 5",
        value: 1000,
      },
    ],
  };
  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
      <Typography.Title level={4}>
          <DollarOutlined /> Total:
        </Typography.Title>
        <CustomTable
          query={{}}
          setCurrentItem={() => {
            return;
          }}
          setQuery={() => {
            return;
          }}
          actions={[]}
          data={FinancialMoviments}
          items={FinancialMoviments.items}
          error={false}
          columns={[
            { name: "merchant", type: "text" },
            { name: "value", type: "value" },
          ]}
          loading={false}
          label={["merchant", "value"]}
          removePagination
          disableScrollToTop
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
      <Typography.Title level={4} style={{color: defaultTheme.colors.success}}>
        <ArrowDownOutlined /> {t("table.deposits")}:
        </Typography.Title>
        <CustomTable
          query={{}}
          setCurrentItem={() => {
            return;
          }}
          setQuery={() => {
            return;
          }}
          actions={[]}
          data={FinancialMoviments}
          items={FinancialMoviments.items}
          error={false}
          columns={[
            { name: "merchant", type: "text" },
            { name: "value", type: "value" },
          ]}
          loading={false}
          label={["merchant", "value"]}
          removePagination
          disableScrollToTop
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
      <Typography.Title level={4} style={{color: defaultTheme.colors.error}}>
        <ArrowUpOutlined /> {t("table.withdrawals")}:
        </Typography.Title>
        <CustomTable
          query={{}}
          setCurrentItem={() => {
            return;
          }}
          setQuery={() => {
            return;
          }}
          actions={[]}
          data={FinancialMoviments}
          items={FinancialMoviments.items}
          error={false}
          columns={[
            { name: "merchant", type: "text" },
            { name: "value", type: "value" },
          ]}
          loading={false}
          label={["merchant", "value"]}
          removePagination
          disableScrollToTop
        />
      </Col>
    </Row>
  );
};