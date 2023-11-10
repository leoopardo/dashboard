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
              orient: "vertical",
              left: "right",
              show: false,
            },
            series: [
              {
                name: t("table.deposit_conversion"),
                type: "pie",
                radius: "50%",
                data: [
                  {
                    value: WithdrawalsTotal?.paid_value ?? 0,
                    name: `${t("table.paid")}: ${
                      WithdrawalsTotal?.paid_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.withdraw_refunded_value ?? 0,
                    name: `${t("table.refunded")}: ${
                      WithdrawalsTotal?.withdraw_refunded_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.canceled_value ?? 0,
                    name: `${t("table.canceled")}: ${
                      WithdrawalsTotal?.canceled_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.processing_value ?? 0,
                    name: `${t("table.processing")}: ${
                      WithdrawalsTotal?.processing_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.pending_value ?? 0,
                    name: `${t("table.wainting")}: ${
                      WithdrawalsTotal?.pending_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.in_analysis_value ?? 0,
                    name: `${t("table.in_analysis")}: ${
                      WithdrawalsTotal?.in_analysis_total ?? 0
                    }`,
                  },
                  {
                    value: WithdrawalsTotal?.created_value ?? 0,
                    name: `${t("table.created")}: ${
                      WithdrawalsTotal?.created_total ?? 0
                    }`,
                  },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
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
