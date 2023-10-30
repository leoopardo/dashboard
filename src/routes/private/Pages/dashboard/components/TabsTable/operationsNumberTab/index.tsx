import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";
import { TotalOperations } from "./total";
import { DepositOperations } from "./deposit";
import { WithdrawOperations } from "./withdraw";

export const OperationMovementsTab = ({ query, chart }: TableProps) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title level={4}>
          <DollarOutlined /> Total:
        </Typography.Title>
        <TotalOperations query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title
          level={4}
          style={{ color: defaultTheme.colors.success }}
        >
          <ArrowDownOutlined /> {t("table.deposits")}:
        </Typography.Title>
        <DepositOperations query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Typography.Title
          level={4}
          style={{ color: defaultTheme.colors.error }}
        >
          <ArrowUpOutlined /> {t("table.withdrawals")}:
        </Typography.Title>
        <WithdrawOperations query={query} chart={chart} />
      </Col>
    </Row>
  );
};
