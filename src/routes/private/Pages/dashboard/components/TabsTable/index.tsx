/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  DashOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { queryClient } from "@src/services/queryClient";
import { Button, Col, Divider, Row, Tabs, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import { FeeTab } from "./feesTab";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { FinancialMovementsTab } from "./financialMovimentsTab";
import { OperationMovementsTab } from "./operationsNumberTab";

export interface TableProps {
  query: { start_date: string; end_date: string };
  chart?: boolean;
}

export const TabsTable = ({ query }: TableProps) => {
  const { t } = useTranslation();
  const { error } = useErrorContext();
  const [isChart, setIsChart] = useState<boolean>(
    secureLocalStorage.getItem("isRankingChart") === "true"
  );

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={22}>
          <Divider orientation="left">
            <Typography.Title level={3}>
              Ranking <Typography.Text>(top 10)</Typography.Text>
            </Typography.Title>
          </Divider>
        </Col>
        <Col span={1}>
          <Button
            style={{ width: "100%" }}
            onClick={() => {
              for (const key of [
                "ranking-value-total",
                "ranking-value-withdraw",
                "ranking-value-deposit",
                "ranking-operations-total",
                "ranking-operations-withdraw",
                "ranking-operations-deposit",
                "ranking-fee-total",
                "ranking-fee-withdraw",
                "ranking-fee-deposit",
              ]) {
                queryClient.refetchQueries(key);
              }
            }}
          >
            <ReloadOutlined />
          </Button>
        </Col>
        <Col span={1}>
          <Button
            shape="circle"
            onClick={() => {
              if (isChart) {
                setIsChart(false);
                secureLocalStorage.setItem("isRankingChart", "false");
              } else {
                setIsChart(true);
                secureLocalStorage.setItem("isRankingChart", "true");
              }
            }}
          >
            {!isChart ? <BarChartOutlined /> : <DashOutlined />}
          </Button>
        </Col>
      </Row>
      <Tabs
        defaultActiveKey="1"
        type="line"
        size="large"
        items={
          [
            !error.rankingValue && {
              label: t("table.operations_value"),
              key: "financial_movements",
              children: <FinancialMovementsTab query={query} chart={isChart} />,
              disabled: error.rankingValue,
              style: { color: "#5470c6" },
            },
            !error.rankingOperations && {
              label: t("table.operation_number"),
              key: "operation_moviments",
              disabled: error.rankingOperations,
              children: <OperationMovementsTab query={query} chart={isChart} />,
            },
            !error.rankingFee && {
              label: t("table.fees"),
              key: "fees",
              children: <FeeTab query={query} chart={isChart} />,
            },
          ].filter(Boolean) as any[]
        }
      />
    </>
  );
};
