/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@src/contexts/ThemeContext";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetMerchantsPerBank } from "@src/services/register/merchant/merchant/getMerchantPerBankTotals";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { Avatar, Card, Col, List, Row, Tooltip, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import { t } from "i18next";
import { useMediaQuery } from "react-responsive";

interface TotalizerPerBanksInterface {
  query: MerchantsQuery;
}

export const TotalizerPerBanks = ({ query }: TotalizerPerBanksInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const { theme } = useTheme();
  const { MerchantsPerBankData, isMerchantsPerBankDataFetching } =
    useGetMerchantsPerBank(query);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });

  if (MerchantsPerBankData?.valuesIn) {
    console.log(
      Object.keys(MerchantsPerBankData?.valuesIn).map((bank) => {
        return { value: MerchantsPerBankData?.valuesIn[bank], name: bank };
      })
    );
  }

  return (
    <Row gutter={[8, 8]} style={{ overflow: "hidden", marginBottom: "80px" }}>
      {/* {MerchantsPerBankData?.total &&
        MerchantsPerBankData.total > 0 &&
        MerchantsPerBankData?.valuesIn?.null !== MerchantsPerBankData.total && (
          <Col
            xs={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              marginBottom: isMobile ? "-60px" : "20px",
            }}
          >
            <Typography.Title level={5} style={{ marginBottom: "-50px" }}>
              {t("table.deposit_bank")}
            </Typography.Title>
            <ReactECharts
              option={{
                darkMode: theme === "dark",
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  orient: "vertical",
                  left: "left",
                  top: "50%",
                },
                series: [
                  {
                    name: "Access From",
                    type: "pie",
                    radius: "50%",
                    data: [
                      ...(Object.keys(MerchantsPerBankData?.valuesIn).map(
                        (bank) => {
                          return {
                            value: MerchantsPerBankData?.valuesIn[bank],
                            name: `${
                              bankListData?.itens.find((b) => b.bank === bank)
                                ?.label_name
                            }: ${MerchantsPerBankData?.valuesIn[bank]}`,
                          };
                        }
                      ) as any),
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
          </Col>
        )} */}
      <Col span={8}>
        <List
          loading={isMerchantsPerBankDataFetching}
          grid={{ gutter: 16, column: 4 }}
          dataSource={Object.keys(MerchantsPerBankData?.valuesIn)
            .sort((a, b) =>
              MerchantsPerBankData?.valuesIn[a] >
              MerchantsPerBankData?.valuesIn[b]
                ? -1
                : 1
            )
            .map((bank) => {
              return {
                bank: bankListData?.itens.find((b) => b.bank === bank)
                  ?.label_name,

                value: MerchantsPerBankData?.valuesIn[bank],
              };
            })}
          renderItem={(item) => (
            <List.Item>
              <Card title={<>{item.bank}</>}>Card content</Card>
            </List.Item>
          )}
        />
      </Col>
      {MerchantsPerBankData?.total &&
        MerchantsPerBankData.total > 0 &&
        MerchantsPerBankData?.valuesIn?.null !== MerchantsPerBankData.total && (
          <Col
            xs={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Row
              gutter={[20, 20]}
              style={{ backgroundColor: "#91cc75", height: "100%", padding: 8 }}
            >
              <Col span={24}>
                <Typography.Title level={4}>
                  {t("table.deposit_bank")}
                </Typography.Title>
              </Col>

              {Object.keys(MerchantsPerBankData?.valuesIn)
                .sort((a, b) =>
                  MerchantsPerBankData?.valuesIn[a] >
                  MerchantsPerBankData?.valuesIn[b]
                    ? -1
                    : 1
                )
                .map((bank) => (
                  <Col span={"auto"}>
                    <Tooltip
                      title={
                        bankListData?.itens.find((b) => b.bank === bank)
                          ?.label_name
                      }
                    >
                      <Avatar
                        src={
                          bankListData?.itens.find((b) => b.bank === bank)
                            ?.icon_url
                        }
                        size={45}
                      />
                      : {MerchantsPerBankData?.valuesIn[bank]}
                    </Tooltip>
                  </Col>
                ))}
            </Row>
          </Col>
        )}

      {/* {MerchantsPerBankData?.total &&
        MerchantsPerBankData.total > 0 &&
        MerchantsPerBankData?.valuesOut?.null !==
          MerchantsPerBankData.total && (
          <Col
            xs={{ span: 24 }}
            md={{ span: 5 }}
            style={{
              marginBottom: isMobile ? "-60px" : "20px",
            }}
          >
            {" "}
            <Typography.Title level={5} style={{ marginBottom: "-50px" }}>
              {t("table.deposit_bank")}
            </Typography.Title>
            <ReactECharts
              option={{
                darkMode: theme === "dark",
                title: {
                  text: "Saques",
                  left: "left",
                },
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  orient: "vertical",
                  left: "left",
                  show: false,
                },
                series: [
                  {
                    name: "Access From",
                    type: "pie",
                    radius: "50%",
                    data: [
                      ...(Object.keys(MerchantsPerBankData?.valuesOut).map(
                        (bank) => {
                          return {
                            value: MerchantsPerBankData?.valuesOut[bank],
                            name: bank,
                          };
                        }
                      ) as any),
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
          </Col>
        )} */}

      {MerchantsPerBankData?.total &&
        MerchantsPerBankData.total > 0 &&
        MerchantsPerBankData?.valuesFastpix?.null !==
          MerchantsPerBankData.total && (
          <Col
            xs={{ span: 24 }}
            md={{ span: 5 }}
            style={{
              marginBottom: isMobile ? "-60px" : "20px",
            }}
          >
            <Typography.Title level={5} style={{ marginBottom: "-50px" }}>
              {t("table.bank")} FastPix
            </Typography.Title>
            <ReactECharts
              option={{
                darkMode: theme === "dark",
                title: {
                  text: "FastPix",
                  left: "left",
                },
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  orient: "vertical",
                  left: "left",
                  show: false,
                },
                series: [
                  {
                    name: "Access From",
                    type: "pie",
                    radius: "50%",
                    data: [
                      ...(Object.keys(MerchantsPerBankData?.valuesFastpix).map(
                        (bank) => {
                          return {
                            value: MerchantsPerBankData?.valuesFastpix[bank],
                            name: bank,
                          };
                        }
                      ) as any),
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
          </Col>
        )}

      <Col></Col>
    </Row>
  );
};
