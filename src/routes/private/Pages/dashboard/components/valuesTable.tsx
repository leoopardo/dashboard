/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Icon } from "@mui/material";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Col, Divider, List, Row, Statistic, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface ValuesTableInterface {
  query: {
    start_date: string;
    end_date: string;
    page?: number;
    limit?: number;
    sort_field?: string;
    sort_order?: string;
  };
}

export const ValuesTable = ({ query }: ValuesTableInterface) => {
  const { t } = useTranslation();
  const XS = useMediaQuery({ maxWidth: "500px" });
  const SM = useMediaQuery({ maxWidth: "750px" });
  const LG = useMediaQuery({ maxWidth: "1300px" });
  const {
    MerchantBankStatementTotals,
    isMerchantBankStatementTotalsFetching,
    refetchMerchantBankStatementTotalsTotal,
  } = useGetMerchantBankStatementTotals(query);

  useEffect(() => {
    refetchMerchantBankStatementTotalsTotal();
  }, [query]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col
          style={{
            minWidth: 220,
          }}
          xs={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 7 }}
        >
          <Card
            style={{
              height: 250,
              opacity: 0.85,
              background: defaultTheme.colors.primary,
            }}
            bordered={false}
          >
            <Statistic
              style={{ marginTop: 6 }}
              loading={isMerchantBankStatementTotalsFetching}
              title=""
              value={moneyFormatter(
                MerchantBankStatementTotals?.result_total || 0
              )}
              precision={2}
              valueStyle={{
                color: "#fff",
                fontWeight: 600,
                fontSize:
                  `${moneyFormatter(
                    MerchantBankStatementTotals?.result_total || 0
                  )}`.length <= 10
                    ? "32px"
                    : "28px",
              }}
            />
            <Typography
              style={{
                color: "#fff",
              }}
            >
              {t("titles.period_results")}
            </Typography>
            <DollarCircleOutlined
              style={{
                color: "#fff",
                fontSize: 64,
                position: "absolute",
                right: 16,
                bottom: 16,
              }}
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 17 }}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Card style={{ height: !LG ? 120 : undefined }} bordered={false}>
                <Row gutter={[8, 8]}>
                  <Col
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: 60,
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography.Title level={4}>
                      {t("table.deposits")}
                    </Typography.Title>
                    <div style={{ display: "flex" }}>
                      <ArrowUpOutlined style={{ marginRight: "-5px" }} />
                      <Icon component={() => <AttachMoneyIcon />} />
                    </div>
                  </Col>
                  <Col xs={{ span: 24 }} lg={20}>
                    <List
                      loading={isMerchantBankStatementTotalsFetching}
                      grid={{
                        gutter: 8,
                        column: XS ? 2 : SM ? 2 : 4,
                      }}
                      itemLayout="vertical"
                      dataSource={[
                        {
                          name: "number_in",
                          value: MerchantBankStatementTotals?.number_in,
                        },
                        {
                          name: "value_in",
                          value: MerchantBankStatementTotals?.value_in,
                        },

                        {
                          name: "fee_in",
                          value: MerchantBankStatementTotals?.fee_in,
                        },
                        {
                          name: "average_ticket_in",
                          value: MerchantBankStatementTotals?.average_ticket_in,
                        },
                      ]}
                      renderItem={(item, _index) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <Divider type="vertical" style={{ height: "50px" }} />

                          <Statistic
                            title={t(`table.${item.name}`)}
                            valueStyle={{
                              fontSize:
                                `${moneyFormatter(item.value || 0)}`?.length <=
                                9
                                  ? "18px"
                                  : "16px",
                            }}
                            value={
                              item.name === "number_in"
                                ? item.value
                                : moneyFormatter(Number(item.value) || 0)
                            }
                            prefix={<ArrowUpOutlined />}
                          />
                        </div>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card style={{ height: !LG ? 120 : undefined }} bordered={false}>
                <Row gutter={[8, 8]} style={{ width: "100%" }}>
                  <Col
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: 60,
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <ArrowDownOutlined style={{ marginRight: "-5px" }} />
                      <Icon component={() => <AttachMoneyIcon />} />
                    </div>
                    <Typography.Title level={4}>
                      {t("table.withdrawals")}
                    </Typography.Title>{" "}
                  </Col>
                  <Col span={20}>
                    <List
                      loading={isMerchantBankStatementTotalsFetching}
                      grid={{
                        gutter: 8,
                        column: XS ? 2 : SM ? 2 : 4,
                      }}
                      itemLayout="vertical"
                      dataSource={[
                        {
                          name: "number_out",
                          value: MerchantBankStatementTotals?.number_out,
                        },
                        {
                          name: "value_out",
                          value: MerchantBankStatementTotals?.value_out,
                        },

                        {
                          name: "fee_out",
                          value: MerchantBankStatementTotals?.fee_out,
                        },
                        {
                          name: "average_ticket_out",
                          value:
                            MerchantBankStatementTotals?.average_ticket_out,
                        },
                      ]}
                      renderItem={(item, _index) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-around",
                          }}
                        >
                          <Divider type="vertical" style={{ height: "50px" }} />

                          <Statistic
                            title={`${`${t(`table.${item.name}`)}`.substring(0, 12)}`}
                            valueStyle={{
                              color: defaultTheme.colors.error,
                              fontSize:
                                `${moneyFormatter(item.value || 0)}`?.length <=
                                9
                                  ? "18px"
                                  : "16px",
                            }}
                            value={
                              item.name === "number_out"
                                ? item.value
                                : moneyFormatter(Number(item.value) || 0)
                            }
                            prefix={<ArrowDownOutlined />}
                          />
                        </div>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
