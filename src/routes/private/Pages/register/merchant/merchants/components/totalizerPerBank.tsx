/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetMerchantsPerBank } from "@src/services/register/merchant/merchant/getMerchantPerBankTotals";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { t } from "i18next";

interface TotalizerPerBanksInterface {
  query: MerchantsQuery;
}

export const TotalizerPerBanks = ({ query }: TotalizerPerBanksInterface) => {
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
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Card
          loading={isMerchantsPerBankDataFetching}
          title={
            <Typography.Title
              level={4}
              style={{ color: defaultTheme.colors.paid }}
            >
              {t("titles.deposits_bank")} <ArrowDownOutlined />
            </Typography.Title>
          }
          bodyStyle={{ padding: 0 }}
          style={{ height: "100%" }}
        >
          <Descriptions
            bordered
            style={{ width: "100%" }}
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
          >
            {MerchantsPerBankData?.valuesIn &&
              Object.keys(MerchantsPerBankData?.valuesIn)
                .sort((a, b) =>
                  MerchantsPerBankData?.valuesIn[a] >
                  MerchantsPerBankData?.valuesIn[b]
                    ? -1
                    : 1
                )
                .map((bank) => (
                  <Descriptions.Item
                    labelStyle={{
                      padding: 0,
                      margin: 0,
                      maxHeight: "50px",
                      maxWidth: "40px",
                    }}
                    label={
                      <Tooltip
                        title={
                          bankListData?.itens.find((b) => b.bank === bank)
                            ?.label_name
                        }
                      >
                        {bank !== "null" ? (
                          <Avatar
                            shape="square"
                            style={{ width: "100%", height: "50px" }}
                            src={
                              bankListData?.itens.find((b) => b.bank === bank)
                                ?.icon_url
                            }
                          />
                        ) : (
                          <Typography.Text strong>
                            {t("table.unassigned")}
                          </Typography.Text>
                        )}
                      </Tooltip>
                    }
                  >
                    <Typography.Text strong>
                      {MerchantsPerBankData?.valuesIn[bank]}
                    </Typography.Text>
                  </Descriptions.Item>
                ))}
          </Descriptions>
        </Card>
      </Col>

      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Card
          loading={isMerchantsPerBankDataFetching}
          title={
            <Typography.Title
              level={4}
              style={{ color: defaultTheme.colors.error }}
            >
              {t("titles.withdraw_bank")} <ArrowUpOutlined />
            </Typography.Title>
          }
          bodyStyle={{ padding: 0 }}
          style={{ height: "100%" }}
        >
          <Descriptions
            bordered
            style={{ width: "100%" }}
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
          >
            {MerchantsPerBankData?.valuesOut &&
              Object.keys(MerchantsPerBankData?.valuesOut)
                .sort((a, b) =>
                  MerchantsPerBankData?.valuesOut[a] >
                  MerchantsPerBankData?.valuesOut[b]
                    ? -1
                    : 1
                )
                .map((bank) => (
                  <Descriptions.Item
                    labelStyle={{
                      padding: 0,
                      margin: 0,
                      maxHeight: "50px",
                      maxWidth: "40px",
                    }}
                    label={
                      <Tooltip
                        title={
                          bankListData?.itens.find((b) => b.bank === bank)
                            ?.label_name
                        }
                      >
                        {bank !== "null" ? (
                          <Avatar
                            shape="square"
                            style={{ width: "100%", height: "50px" }}
                            src={
                              bankListData?.itens.find((b) => b.bank === bank)
                                ?.icon_url
                            }
                          />
                        ) : (
                          <Typography.Text strong>
                            {t("table.unassigned")}
                          </Typography.Text>
                        )}
                      </Tooltip>
                    }
                  >
                    <Typography.Text strong>
                      {MerchantsPerBankData?.valuesOut[bank]}
                    </Typography.Text>
                  </Descriptions.Item>
                ))}
          </Descriptions>
        </Card>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Card
          loading={isMerchantsPerBankDataFetching}
          title={
            <Typography.Title
              level={4}
              style={{ color: defaultTheme.colors.info }}
            >
              {t("titles.fastpix_bank")}
            </Typography.Title>
          }
          bodyStyle={{ padding: 0 }}
          style={{ height: "100%" }}
        >
          <Descriptions
            bordered
            style={{ width: "100%" }}
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
          >
            {MerchantsPerBankData?.valuesFastpix &&
              Object.keys(MerchantsPerBankData?.valuesFastpix)
                .sort((a, b) =>
                  MerchantsPerBankData?.valuesFastpix[a] >
                  MerchantsPerBankData?.valuesFastpix[b]
                    ? -1
                    : 1
                )
                .map((bank) => (
                  <Descriptions.Item
                    labelStyle={{
                      padding: 0,
                      margin: 0,
                      maxHeight: "50px",
                      maxWidth: "40px",
                      textAlign: "center",
                    }}
                    label={
                      <Tooltip
                        title={
                          bankListData?.itens.find((b) => b.bank === bank)
                            ?.label_name
                        }
                      >
                        {bank !== "null" ? (
                          <Avatar
                            shape="square"
                            style={{ width: "100%", height: "50px" }}
                            src={
                              bankListData?.itens.find((b) => b.bank === bank)
                                ?.icon_url
                            }
                          />
                        ) : (
                          <Typography.Text strong>
                            {t("table.unassigned")}
                          </Typography.Text>
                        )}
                      </Tooltip>
                    }
                  >
                    <Typography.Text strong>
                      {MerchantsPerBankData?.valuesFastpix[bank]}
                    </Typography.Text>
                  </Descriptions.Item>
                ))}
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};
