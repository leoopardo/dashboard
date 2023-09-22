import { PieChartOutlined, SmallDashOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Typography } from "antd";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

export const ChartOut = () => {
  const { t } = useTranslation();
  const [oneByOne, setOneByOne] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
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

  const paid = {
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

  const canceled = {
    labels: [t("table.canceled"), t("table.others")],
    datasets: [
      {
        label: "",
        data: [3000, 6500],
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
    labels: [t("table.waiting"), t("table.others")],
    datasets: [
      {
        label: "",
        data: [1000, 8500],
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
    labels: [t("table.not_paid"), t("table.others")],
    datasets: [
      {
        label: "",
        data: [500, 9000],
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
            <Typography.Title level={5}>CONVERSÃO DE SAIDA</Typography.Title>

            <Button
              shape="circle"
              onClick={() => setOneByOne((state) => !state)}
            >
              {oneByOne ? <PieChartOutlined /> : <SmallDashOutlined />}
            </Button>
          </div>
        }
      >
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
                    },
                  },
                }}
              />
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
                      },
                    },
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
                      },
                    },
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
                      },
                    },
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
