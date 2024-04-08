/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getTotal";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Spin, Typography } from "antd";
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
    <Card style={{ height: 260 }}>
      <Card.Meta
        title={
          <>
            {" "}
            <ArrowUpOutlined /> {t("table.deposit_conversion")}
          </>
        }
      />

      {isDepositsTotalFetching && !depositsTotal ? (
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
          {" "}
          {/* Container para posicionamento relativo */}
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
                  name: t("table.deposit_conversion"),
                  type: "pie",
                  labelLine: {
                    show: false,
                  },
                  right: 100,
                  label: { show: false },
                  radius: ["45%", "60%"], // Define o raio interno e externo para criar o efeito donut
                  tooltip: {
                    valueFormatter: function (value: number) {
                      return moneyFormatter(Number(value) || 0);
                    },
                  },
                  data: [
                    {
                      value: depositsTotal?.paid_value ?? 0,
                      name: `${t("table.paid")}: ${
                        depositsTotal?.paid_total ?? 0
                      }`,
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
                      value: depositsTotal?.waiting_value ?? 0,
                      name: `${t("table.waiting")}: ${
                        depositsTotal?.waiting_total ?? 0
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
              `${moneyFormatter(depositsTotal?.paid_value || 0)}`.length >= 11
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
            {moneyFormatter(Number(depositsTotal?.transaction_value) || 0)}
          </Typography.Title>
        </div>
      )}
    </Card>
  );
};
