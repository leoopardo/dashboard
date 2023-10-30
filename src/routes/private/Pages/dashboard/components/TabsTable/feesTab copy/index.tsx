import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";
import { DepositFees } from "./deposit";
import { TotalFees } from "./total";
import { WithdrawFees } from "./withdraw";

export const FeeTab = ({ query, chart }: TableProps) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title level={4}>
          <DollarOutlined /> Total:
        </Typography.Title>
        <TotalFees query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title
          level={4}
          style={{ color: defaultTheme.colors.success }}
        >
          <ArrowDownOutlined /> {t("table.deposits")}:
        </Typography.Title>
        <DepositFees query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title
          level={4}
          style={{ color: defaultTheme.colors.error }}
        >
          <ArrowUpOutlined /> {t("table.withdrawals")}:
        </Typography.Title>
        <WithdrawFees query={query} chart={chart} />
      </Col>
    </Row>
  );
};
