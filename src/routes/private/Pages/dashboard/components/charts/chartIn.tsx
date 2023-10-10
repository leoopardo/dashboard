/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChartOutlined, SmallDashOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getTotal";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { Button, Card, Col, Empty, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface ChartInInterface {
  query: any;
}

export const ChartIn = ({ query }: ChartInInterface) => {
  const { t } = useTranslation();
  const [oneByOne, setOneByOne] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [formatedQuery, setFormatedQuery] =
    useState<generatedDepositTotalQuery>({
      ...query,
      start_date: undefined,
      end_date: undefined,
      initial_date: query?.start_date,
      final_date: query?.end_date,
    });

  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(formatedQuery);
  const { theme } = useTheme();

  const data = {
    labels: [
      `${t("table.paid")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.paid_value || 0)}`,
      `${t("table.canceled")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.canceled_value || 0)}`,
      `${t("table.pending")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.waiting_value || 0)}`,
      `${t("table.waiting_refund")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.awaiting_refund_value || 0)}`,
    ],
    datasets: [
      {
        label: "",
        data: [
          depositsTotal?.paid_value,
          depositsTotal?.canceled_value,
          depositsTotal?.waiting_value,
          depositsTotal?.awaiting_refund_value,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 226, 99, 0.2)",
          "rgba(255, 169, 99, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 226, 99, 0.966)",
          "rgb(255, 169, 99)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const paid = {
    labels: [
      `${t("table.paid")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.paid_value || 0)}`,
    ],
    datasets: [
      {
        label: "",
        data: [
          depositsTotal?.paid_value || 0,
          `${
            (depositsTotal?.canceled_value || 0) +
            (depositsTotal?.waiting_value || 0) +
            (depositsTotal?.awaiting_refund_value || 0)
          }`,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(182, 182, 182, 0.2)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgb(182, 182, 182)"],
        borderWidth: 1,
      },
    ],
  };

  const canceled = {
    labels: [
      `${t("table.canceled")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.canceled_value || 0)}`,
    ],
    datasets: [
      {
        label: "",
        data: [
          depositsTotal?.canceled_value || 0,
          `${
            (depositsTotal?.paid_value || 0) +
            (depositsTotal?.waiting_value || 0) +
            (depositsTotal?.awaiting_refund_value || 0)
          }`,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(182, 182, 182, 0.2)",
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgb(182, 182, 182)"],
        borderWidth: 1,
      },
    ],
  };

  const waiting = {
    labels: [
      `${t("table.waiting")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.waiting_value || 0)}`,
    ],
    datasets: [
      {
        label: "",
        data: [
          depositsTotal?.waiting_value || 0,
          `${
            (depositsTotal?.paid_value || 0) +
            (depositsTotal?.canceled_value || 0) +
            (depositsTotal?.awaiting_refund_value || 0)
          }`,
        ],
        backgroundColor: [
          "rgba(255, 226, 99, 0.2)",
          "rgba(182, 182, 182, 0.2)",
        ],
        borderColor: ["rgba(255, 226, 99, 0.966)", "rgb(182, 182, 182)"],
        borderWidth: 1,
      },
    ],
  };
  const notPaid = {
    labels: [
      `${t("table.waiting_ref")}: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(depositsTotal?.awaiting_refund_value || 0)}`,
    ],
    datasets: [
      {
        label: "",
        data: [
          depositsTotal?.awaiting_refund_value || 0,
          `${
            (depositsTotal?.paid_value || 0) +
            (depositsTotal?.canceled_value || 0) +
            (depositsTotal?.waiting_value || 0)
          }`,
        ],
        backgroundColor: [
          "rgba(255, 169, 99, 0.2)",
          "rgba(182, 182, 182, 0.2)",
        ],
        borderColor: ["rgb(255, 169, 99)", "rgb(182, 182, 182)"],
        borderWidth: 1,
      },
    ],
  };

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
              {t("table.deposit_conversion")}
            </Typography.Title>

            <Button
              shape="circle"
              onClick={() => setOneByOne((state) => !state)}
            >
              {oneByOne ? <PieChartOutlined /> : <SmallDashOutlined />}
            </Button>
          </div>
        }
        bodyStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isDepositsTotalFetching ? (
          <Spin />
        ) : (
          <>
            {Number(depositsTotal?.paid_value || 0) > 0 ||
            Number(depositsTotal?.canceled_value || 0) > 0 ||
            Number(depositsTotal?.waiting_value || 0) > 0 ||
            Number(depositsTotal?.awaiting_refund_value || 0) > 0 ? (
              <Row>
                {!oneByOne ? (
                  <Col
                    span={24}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Doughnut
                      data={data}
                      style={{
                        maxWidth: "300px",
                        maxHeight: "300px",
                        minHeight: !isMobile ? "300px" : undefined,
                        minWidth: !isMobile ? "300px" : undefined,
                      }}
                      options={{
                        plugins: {
                          legend: {
                            align: "center",
                            position: "top",
                            labels: {
                              textAlign: "center",
                              usePointStyle: true,
                              color: theme === "dark" ? "#fff" : "#000",
                            },
                          },
                        },
                        cutout: "80%"
                      }}
                    />
                    <Typography.Title
                      level={5}
                      style={{
                        position: "absolute",
                        top: 173,
                        maxWidth: "150px",
                        textAlign: "center",
                      }}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(depositsTotal?.transaction_value || 0)}
                    </Typography.Title>
                  </Col>
                ) : (
                  <>
                    <Col
                      xs={{ span: 24 }}
                      md={{ span: 6 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Doughnut
                        data={paid}
                        style={{ maxWidth: "350px", maxHeight: "350px" }}
                        options={{
                          plugins: {
                            legend: {
                              align: "center",
                              position: "top",
                              labels: {
                                textAlign: "center",
                                usePointStyle: true,
                                font: { size: 10 },
                                color: theme === "dark" ? "#fff" : "#000",
                              },
                            },
                          },
                          cutout: "80%"
                        }}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      md={{ span: 6 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Doughnut
                        data={canceled}
                        style={{ maxWidth: "350px", maxHeight: "350px" }}
                        options={{
                          plugins: {
                            legend: {
                              align: "center",
                              position: "top",
                              labels: {
                                textAlign: "center",
                                usePointStyle: true,
                                font: { size: 10 },
                                color: theme === "dark" ? "#fff" : "#000",
                              },
                            },
                          }, cutout: "80%"
                        }}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      md={{ span: 6 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Doughnut
                        data={waiting}
                        style={{ maxWidth: "350px", maxHeight: "350px" }}
                        options={{
                          plugins: {
                            legend: {
                              align: "center",
                              position: "top",
                              labels: {
                                textAlign: "center",
                                usePointStyle: true,
                                font: { size: 10 },
                                color: theme === "dark" ? "#fff" : "#000",
                              },
                            },
                          }, cutout: "80%"
                        }}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      md={{ span: 6 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Doughnut
                        data={notPaid}
                        style={{ maxWidth: "350px", maxHeight: "350px" }}
                        options={{
                          plugins: {
                            legend: {
                              align: "center",
                              position: "top",
                              labels: {
                                textAlign: "center",
                                usePointStyle: true,
                                font: { size: 9 },
                                color: theme === "dark" ? "#fff" : "#000",
                              },
                            },
                          }, cutout: "80%"
                        }}
                      />
                    </Col>
                  </>
                )}
              </Row>
            ) : (
              <Empty description={t("table.empty_conversion")} />
            )}
          </>
        )}
      </Card>
    </Col>
  );
};
