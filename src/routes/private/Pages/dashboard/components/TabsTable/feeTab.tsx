import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

export const FeeTab = () => {
  const { t } = useTranslation();

  const Fee = {
    total: 5,
    items: [
      {
        merchant: "Empresa 1",
        value: 998,
      },
      {
        merchant: "Empresa 2",
        value: 700,
      },
      {
        merchant: "Empresa 3",
        value: 500,
      },
      {
        merchant: "Empresa 4",
        value: 495.5,
      },
      {
        merchant: "Empresa 5",
        value: 377.89,
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
          data={Fee}
          items={Fee.items}
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
          data={Fee}
          items={Fee.items}
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
          data={Fee}
          items={Fee.items}
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
