/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { Card, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChartInInterface {
  query: any;
}

export const ChartOut = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const [formatedQuery, setFormatedQuery] =
    useState<generatedWithdrawalsRowsQuery>({
      ...query,
      start_date: undefined,
      end_date: undefined,
      initial_date: query?.start_date,
      final_date: query?.end_date,
    });
  const { theme } = useTheme();
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(formatedQuery);
  useEffect(() => {
    setFormatedQuery({
      ...query,
      start_date: undefined,
      end_date: undefined,
      initial_date: query?.start_date,
      final_date: query?.end_date,
    });
    refetchWithdrawalsTotal();
  }, [query]);

  return (
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
            }).format(Number(WithdrawalsTotal?.paid_value) || 0)}
          </Typography.Title>
        </div>
      }
    >
      <ReactECharts
        option={{
          darkMode: theme === "dark",
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
              tooltip: {
                valueFormatter: function (value: number) {
                  return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value) || 0);
                },
              },
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
                  name: `${t("table.waiting")}: ${
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
  );
};
