/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfoCircleFilled, ReloadOutlined } from "@ant-design/icons";
import { useGetBankBalance } from "@src/services/consult/organization/bankBalance/getBankBalance";
import { BankItem } from "@src/services/types/banks.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import BanksBanners from "@src/utils/BankBanners";
import { Card, Spin, Statistic, Tooltip, Typography } from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface BankcardInterface {
  bank?: BankItem;
}

export const BankCard = ({ bank }: BankcardInterface) => {
  const {
    OrganizationBankBalance,
    isOrganizationBankBalanceFetching,
    OrganizationBankBalanceError,
    refetchOrganizationBankBalance,
  } = useGetBankBalance({ bank: bank?.bank?.toLocaleLowerCase() });
  const { t } = useTranslation();

  if (!OrganizationBankBalance || OrganizationBankBalanceError) {
    return null;
  }

  return OrganizationBankBalance && !OrganizationBankBalanceError ? (
    <div className="swiper-slide">
      <Card
        loading={isOrganizationBankBalanceFetching}
        headStyle={{ padding: 0 }}
        bordered={false}
        title={
          <Tooltip title={bank?.label_name}>
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
                height: "80px",
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}></div>
              </div>
            </motion.div>
          </Tooltip>
        }
      >
        <Statistic
          title="Total:"
          value={OrganizationBankBalance?.value}
          precision={2}
          prefix="R$"
          valueStyle={{
            fontSize: "16px",
          }}
        />
        <Statistic
          title={`${t("table.blocked_value")}:`}
          value={OrganizationBankBalance?.value_blocked}
          precision={2}
          prefix="R$"
          valueStyle={{
            fontSize: "14px",
            color: defaultTheme.colors.error,
          }}
        />
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
              <InfoCircleFilled style={{ marginLeft: 5, paddingRight: 5 }} />
            </Tooltip>
          )}
        </Typography.Text>
      </Card>
    </div>
  ) : (
    <></>
  );
};
