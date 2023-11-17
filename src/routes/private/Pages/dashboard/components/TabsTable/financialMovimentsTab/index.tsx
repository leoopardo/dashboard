import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Col, Divider, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";
import { DepositFinancial } from "./deposit";
import { TotalFinancial } from "./total";
import { WithdrawFinancial } from "./withdraw";

export const FinancialMovementsTab = ({ query, chart }: TableProps) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 24 }} md={{ span: 24 }}>
        <Divider>
          <Typography.Title level={4}>
            <DollarOutlined /> Total:
          </Typography.Title>
        </Divider>

        <TotalFinancial query={query} chart={chart} />
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
        <DepositFinancial query={query} chart={chart} />
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
        <WithdrawFinancial query={query} chart={chart} />
      </Col>
    </Row>
  );
};
