/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { Card, Col, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChartInInterface {
  query: any;
}

export const ChartOut = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const [formatedQuery] = useState<generatedWithdrawalsRowsQuery>({
    ...query,
    start_date: undefined,
    end_date: undefined,
    initial_date: query?.start_date,
    final_date: query?.end_date,
  });

  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(formatedQuery);
  useEffect(() => {
    refetchWithdrawalsTotal();
  }, [query]);

  return (
    <Col xs={{ span: 24 }} md={{ span: 12 }}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography.Title level={5}>
              {t("table.withdraw_conversion")}:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(WithdrawalsTotal?.transaction_value) || 0)}
            </Typography.Title>
          </div>
        }
      >
        <ReactECharts
          option={{
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
              textStyle: {
                color: "#a0a0a0",
              },
            },
            series: [
              {
                name: t("table.withdraw_conversion"),
                type: "pie",
                radius: ["40%", "70%"],
                top: "8%",
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: 40,
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: [
                  {
                    value: WithdrawalsTotal?.paid_value,
                    name: t("table.paid"),
                  },
                  {
                    value: WithdrawalsTotal?.withdraw_refunded_value,
                    name: t("table.refunded"),
                  },
                  {
                    value: WithdrawalsTotal?.canceled_value,
                    name: t("table.canceled"),
                  },
                  {
                    value: WithdrawalsTotal?.processing_value,
                    name: t("table.processing"),
                  },
                  {
                    value: WithdrawalsTotal?.pending_value,
                    name: t("table.waiting"),
                  },
                  {
                    value: WithdrawalsTotal?.in_analysis_value,
                    name: t("table.in_analysis"),
                  },
                  {
                    value: WithdrawalsTotal?.created_value,
                    name: t("table.created"),
                  },
                ],
              },
            ],
          }}
          opts={{ renderer: "svg" }}
          lazyUpdate
          showLoading={isWithdrawalsTotalFetching}
        />
      </Card>
    </Col>
  );
};
