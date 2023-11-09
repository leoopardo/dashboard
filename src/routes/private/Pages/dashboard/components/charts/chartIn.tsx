/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
                name: t("table.deposit_conversion"),
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
                  { value: depositsTotal?.paid_value, name: t("table.paid") },
                  {
                    value: depositsTotal?.refund_value,
                    name: t("table.refunded"),
                  },
                  {
                    value: depositsTotal?.canceled_value,
                    name: t("table.canceled"),
                  },
                  {
                    value: depositsTotal?.expired_value,
                    name: t("table.expired"),
                  },
                  {
                    value: depositsTotal?.waiting_value,
                    name: t("table.waiting"),
                  },
                  {
                    value: depositsTotal?.awaiting_refund_value,
                    name: t("table.waiting_refund"),
                  },
                ],
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
