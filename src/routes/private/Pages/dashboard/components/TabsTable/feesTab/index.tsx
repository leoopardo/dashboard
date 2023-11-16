import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Divider, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";
import { DepositFees } from "./deposit";
import { TotalFees } from "./total";
import { WithdrawFees } from "./withdraw";

export const FeeTab = ({ query, chart }: TableProps) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 24 }} md={{ span: 24 }}>
        <Typography.Title level={4}>
          <Divider>
            <DollarOutlined /> Total:
          </Divider>
        </Typography.Title>
        <TotalFees query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 24 }}>
        <Divider>
          <Typography.Title
            level={4}
            style={{ color: defaultTheme.colors.success }}
          >
            <ArrowDownOutlined /> {t("table.deposits")}:
          </Typography.Title>
        </Divider>

        <DepositFees query={query} chart={chart} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 24 }}>
        <Divider>
          <Typography.Title
            level={4}
            style={{ color: defaultTheme.colors.error }}
          >
            <ArrowUpOutlined /> {t("table.withdrawals")}:
          </Typography.Title>
        </Divider>

        <WithdrawFees query={query} chart={chart} />
      </Col>
    </Row>
  );
};
