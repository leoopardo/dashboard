/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getTotal";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { Card, Col, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChartInInterface {
  query: any;
}

export const ChartIn = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const [formatedQuery] = useState<generatedDepositTotalQuery>({
    ...query,
    start_date: undefined,
    end_date: undefined,
    initial_date: query?.start_date,
    final_date: query?.end_date,
  });

  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(formatedQuery);
  useEffect(() => {
    refetchDepositsTotal();
  }, [query]);
  const {theme} = useTheme()

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
              {t("table.deposit_conversion")}:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(depositsTotal?.transaction_value) || 0)}
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
                name: t("table.deposit_conversion"),
                type: "pie",
                radius: "50%",
               
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
                    name: `${t("table.canceled")} ${
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
    </Col>
  );
};
