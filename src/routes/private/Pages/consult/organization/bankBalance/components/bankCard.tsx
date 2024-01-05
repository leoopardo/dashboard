/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfoCircleFilled, ReloadOutlined } from "@ant-design/icons";
import { useGetBankBalance } from "@src/services/consult/organization/bankBalance/getBankBalance";
import { defaultTheme } from "@src/styles/defaultTheme";
import BanksBanners from "@src/utils/BankBanners";
import {
  Card,
  Col,
  Divider,
  Row,
  Spin,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface BankcardInterface {
  bank?: any;
}

export const BankCard = ({ bank }: BankcardInterface) => {
  const {
    OrganizationBankBalance,
    isOrganizationBankBalanceFetching,
    OrganizationBankBalanceError,
    refetchOrganizationBankBalance,
  } = useGetBankBalance({ bank: bank?.bank?.toLocaleLowerCase() });
  const isTablet = useMediaQuery({ maxWidth: "1199px" });
  const { t } = useTranslation();

  return (
    <>
      {OrganizationBankBalance && !OrganizationBankBalanceError && (
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: isTablet ? 8 : 5 }}>
          <Card
            loading={isOrganizationBankBalanceFetching}
            headStyle={{ padding: 0 }}
            bordered={false}
            title={
              <Tooltip title={bank?.label_name} placement="right">
                <motion.div
                  animate={{
                    backgroundImage: [
                      `url(${
                        (BanksBanners as any)[bank?.label_name || ""] ||
                        bank?.icon_url
                      })`,
                    ],
                    transition: {
                      duration: 4,
                      delay: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      type: "keyframes",
                    },
                  }}
                  style={{
                    width: "100%",
                    height: "95px",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  {isOrganizationBankBalanceFetching ? (
                    <Spin
                      size="small"
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <ReloadOutlined
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                      onClick={() => refetchOrganizationBankBalance()}
                    />
                  )}
                </motion.div>
              </Tooltip>
            }
          >
            <Row gutter={8} align="middle" style={{marginTop: -20}}>
              <Col span={24} style={{marginBottom: 8}}>
                <Statistic
                  title="Total:"
                  value={OrganizationBankBalance?.value}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    fontSize: "20px",
                  }}
                />
              </Col>
              <Col span={24} style={{marginBottom: 8}}>
                <Statistic
                  title={`${t("table.blocked_value")}:`}
                  value={OrganizationBankBalance?.value_blocked}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    fontSize: "16px",
                    color: defaultTheme.colors.error,
                  }}
                />
              </Col>
              <Typography.Text
                mark={
                  moment(new Date()).format("YYYY-MM-DDTHH:mm:00.000") >
                  moment(new Date(OrganizationBankBalance?.date_checked))
                    .add(20, "minutes")
                    .format("YYYY-MM-DDTHH:mm:00.000")
                }
                style={{ color: "#d6d6d6", fontSize: "12px" }}
              >
                {moment(new Date(OrganizationBankBalance?.date_checked)).format(
                  navigator.language === "pt-BR"
                    ? "DD/MM/YYYY HH:mm"
                    : "YYYY/MM/DD HH:mm"
                )}
                {moment(new Date()).format("YYYY-MM-DDTHH:mm:00.000") >
                  moment(new Date(OrganizationBankBalance?.date_checked))
                    .add(20, "minutes")
                    .format("YYYY-MM-DDTHH:mm:00.000") && (
                  <Tooltip title={t("messages.20_minutes_consult")}>
                    <InfoCircleFilled
                      style={{ marginLeft: 5, paddingRight: 5 }}
                    />
                  </Tooltip>
                )}
              </Typography.Text>
            </Row>

            <Divider type="horizontal" style={{ margin: 8 }} />

            <Typography>
              CNPJ:{" "}
              {OrganizationBankBalance?.cnpj.replace(
                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                "$1.$2.$3/$4-$5"
              )}
            </Typography>
            <Typography>C/C: {OrganizationBankBalance?.cc}</Typography>
          </Card>
        </Col>
      )}
    </>
  );
};
