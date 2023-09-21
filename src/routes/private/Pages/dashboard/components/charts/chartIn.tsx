import { Card, Col, Row } from "antd";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

export const ChartIn = () => {
  const { t } = useTranslation();
  const [oneByOne, setOneByOne] = useState<boolean>(true);
  const data = {
    labels: [
      t("table.paid"),
      t("table.canceled"),
      t("table.pending"),
      t("table.not_paid"),
    ],
    datasets: [
      {
        label: "",
        data: [5000, 3000, 1000, 500],
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

  const data2 = {
    labels: [t("table.paid"), t("table.others")],
    datasets: [
      {
        label: "",
        data: [5000, 4500],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(182, 182, 182, 0.2)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgb(182, 182, 182)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Col xs={{ span: 24 }} md={{ span: 12 }}>
      <Card title="ÍNDICES DE CONVERSÃO DE ENTRADA">
        <Row>
          {!oneByOne ? (
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Doughnut
                data={data}
                style={{ maxWidth: "350px", maxHeight: "350px" }}
                options={{
                  plugins: {
                    legend: {
                      align: "center",
                    },
                  },
                }}
              />
            </Col>
          ) : (
            <>
              {" "}
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Doughnut
                  data={data2}
                  style={{ maxWidth: "350px", maxHeight: "350px" }}
                  options={{
                    plugins: {
                      legend: {
                        align: "center",
                      },
                    },
                  }}
                />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Doughnut
                  data={data}
                  style={{ maxWidth: "350px", maxHeight: "350px" }}
                  options={{
                    plugins: {
                      legend: {
                        align: "center",
                      },
                    },
                  }}
                />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Doughnut
                  data={data}
                  style={{ maxWidth: "350px", maxHeight: "350px" }}
                  options={{
                    plugins: {
                      legend: {
                        align: "center",
                      },
                    },
                  }}
                />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Doughnut
                  data={data}
                  style={{ maxWidth: "350px", maxHeight: "350px" }}
                  options={{
                    plugins: {
                      legend: {
                        align: "center",
                      },
                    },
                  }}
                />
              </Col>
            </>
          )}
        </Row>
      </Card>
    </Col>
  );
};
