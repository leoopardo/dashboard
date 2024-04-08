/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDownOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Spin, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ChartInInterface {
  query: any;
}

export const ChartOut = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals({
    ...query,
    start_date: undefined,
    end_date: undefined,
    initial_date: query?.start_date,
    final_date: query?.end_date,
  });

  useEffect(() => {
    refetchWithdrawalsTotal();
  }, [query]);

  return (
    <Card style={{ height: 260 }}>
      <Card.Meta
        title={
          <>
            <ArrowDownOutlined /> {t("table.withdraw_conversion")}
          </>
        }
      />
      {isWithdrawalsTotalFetching && !WithdrawalsTotal ? (
        <div
          style={{
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <ReactECharts
            style={{ marginTop: -50, marginLeft: "-20%", width: "120%" }}
            option={{
              darkMode: theme === "dark",
              tooltip: {
                trigger: "item",
              },
              legend: {
                orient: "vertical",
                left: "right",
                top: "middle",
                show: true,
                textStyle: { color: "#989898" },
              },
              color: ["#91cc75", "#5470c6", "#ee6666", "#fac858"],
              series: [
                {
                  tooltip: {
                    valueFormatter: function (value: number) {
                      return moneyFormatter(Number(value) || 0);
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  label: { show: false },
                  avoidLabelOverlap: false,
                  name: t("table.withdraw_conversion"),
                  type: "pie",
                  radius: ["45%", "60%"],
                  right: 100,
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
                      value: WithdrawalsTotal?.pending_value ?? 0,
                      name: `${t("table.pending")}: ${
                        WithdrawalsTotal?.pending_total ?? 0
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
          />
          <Typography.Title
            level={
              `${moneyFormatter(WithdrawalsTotal?.paid_value || 0)}`.length >=
              11
                ? 5
                : 4
            }
            style={{
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "calc(43% - 60px)",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
          >
            {moneyFormatter(Number(WithdrawalsTotal?.paid_value) || 0)}
          </Typography.Title>
        </div>
      )}
    </Card>
  );
};
