/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  DashOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { queryClient } from "@src/services/queryClient";
import { Button, Col, Divider, Row, Tabs, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import { FeeTab } from "./feesTab";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { FinancialMovementsTab } from "./financialMovimentsTab";
import { OperationMovementsTab } from "./operationsNumberTab";

export interface TableProps {
  query: { start_date: string; end_date: string };
  chart?: boolean;
  operationType?: "total" | "deposit" | "withdraw";
  setOperationType?: Dispatch<SetStateAction<"total" | "deposit" | "withdraw">>;
}

export const TabsTable = ({ query }: TableProps) => {
  const { t } = useTranslation();
  const { type } = queryClient.getQueryData("validate") as ValidateInterface;
  const { error } = useErrorContext();
  const [isChart, setIsChart] = useState<boolean>(
    secureLocalStorage.getItem("isRankingChart") === "true"
  );
  const [operationType, setOperationType] = useState<
    "total" | "deposit" | "withdraw"
  >("total");

  return (
    <>
      <Row
        gutter={[8, 8]}
        justify="space-between"
        style={{ alignItems: "center" }}
      >
        <Col xs={{ span: 14 }} md={{ span: 20 }} lg={{ span: 22 }}>
          <Divider orientation="left" data-test-id="divider-tabs-table-1">
            <Typography.Title level={3} data-test-id="text-tabs-table-1">
              Ranking <Typography.Text>(top 10)</Typography.Text>
            </Typography.Title>
          </Divider>
        </Col>
        <Col xs={{ span: 2 }} md={{ span: 1 }}>
          <Button
            data-test-id="button-tabs-table-1"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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
        <Col xs={{ span: 2 }} md={{ span: 1 }}>
          <Button
            data-test-id="button-tabs-table-2"
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
        data-test-id="tabs-tabs-table-1"
        defaultActiveKey="1"
        type="line"
        size="large"
        items={
          [
            !error.rankingValue && {
              label: t("table.operations_value"),
              key: "financial_movements",
              children: (
                <FinancialMovementsTab
                  data-test-id="financial-movements-tab"
                  query={query}
                  chart={isChart}
                  operationType={operationType}
                  setOperationType={setOperationType}
                />
              ),
              disabled: error.rankingValue,
              style: { color: "#5470c6" },
            },
            !error.rankingOperations && {
              label: t("table.operation_number"),
              key: "operation_moviments",
              disabled: error.rankingOperations,
              children: (
                <OperationMovementsTab
                  data-test-id="operation-movements-tab"
                  query={query}
                  chart={isChart}
                  operationType={operationType}
                  setOperationType={setOperationType}
                />
              ),
            },
            !error.rankingFee &&
              (type === 1 || type === 2) && {
                label: t("table.fees"),
                key: "fees",
                children: (
                  <FeeTab
                    data-test-id="fee-tab"
                    query={query}
                    chart={isChart}
                    operationType={operationType}
                    setOperationType={setOperationType}
                  />
                ),
              },
          ].filter(Boolean) as any[]
        }
        style={{ paddingBottom: 24 }}
      />
    </>
  );
};
