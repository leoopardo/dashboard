/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getTotal";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ChartInInterface {
  query: any;
}

export const ChartIn = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits({
      ...query,
      start_date: undefined,
      end_date: undefined,
      initial_date: query?.start_date,
      final_date: query?.end_date,
    });

  useEffect(() => {
    refetchDepositsTotal();
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
          <Typography.Text strong>
            {t("table.deposit_conversion")}:{" "}
            {moneyFormatter(Number(depositsTotal?.paid_value) || 0)}
          </Typography.Text>
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
              name: t("table.deposit_conversion"),
              type: "pie",
              radius: "50%",
              tooltip: {
                valueFormatter: function (value: number) {
                  return moneyFormatter(Number(value) || 0);
                },
              },
              data: [
                {
                  value: depositsTotal?.paid_value ?? 0,
                  name: `${t("table.paid")}: ${depositsTotal?.paid_total ?? 0}`,
                },
                {
                  value: depositsTotal?.refund_value ?? 0,
                  name: `${t("table.refunded")}: ${
                    depositsTotal?.refund_total ?? 0
                  }`,
                },
                {
                  value: depositsTotal?.canceled_value ?? 0,
                  name: `${t("table.canceled")}: ${
                    depositsTotal?.canceled_total ?? 0
                  }`,
                },
                {
                  value: depositsTotal?.expired_value ?? 0,
                  name: `${t("table.expired")}: ${
                    depositsTotal?.expired_total ?? 0
                  }`,
                },
                {
                  value: depositsTotal?.waiting_value ?? 0,
                  name: `${t("table.waiting")}: ${
                    depositsTotal?.waiting_total ?? 0
                  }`,
                },
                {
                  value: depositsTotal?.awaiting_refund_value ?? 0,
                  name: `${t("table.waiting_refund")}: ${
                    depositsTotal?.awaiting_refund_total ?? 0
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
        showLoading={isDepositsTotalFetching}
      />
    </Card>
  );
};
