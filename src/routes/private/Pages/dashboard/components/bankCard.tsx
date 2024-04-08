/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetBankBalance } from "@src/services/consult/organization/bankBalance/getBankBalance";
import { BankItem } from "@src/services/types/banks.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import {
  Avatar,
  Col,
  List,
  Row,
  Spin,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface BankcardInterface {
  bank?: BankItem;
}

export const BankCard = ({ bank }: BankcardInterface) => {
  const { theme } = useTheme();
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
    <List.Item
      style={{
        backgroundColor: theme === "dark" ? "#222222" : "#ffffff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 8,
        cursor: "pointer",
      }}
      onClick={() => refetchOrganizationBankBalance()}
    >
      <Tooltip title={bank?.label_name}>
        <Row gutter={[8, 8]}>
          <Col
            span={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            {isOrganizationBankBalanceFetching ? (
              <Spin />
            ) : (
              <Avatar src={bank?.icon_url} size="large" />
            )}
          </Col>
          <Col span={11}>
            <Statistic
              title="Total:"
              value={moneyFormatter(OrganizationBankBalance?.value || 0)}
              precision={2}
              valueStyle={{
                fontSize: "16px",
                
              }}
            />
          </Col>
          <Col span={9}>
            {" "}
            <Statistic
              title={`${t("table.blocked_value")}:`}
              value={moneyFormatter(
                OrganizationBankBalance?.value_blocked || 0
              )}
              precision={2}
              valueStyle={{
                fontSize: "14px",
                color: defaultTheme.colors.error,
                
              }}
            />
          </Col>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div style={{ width: "36%" }}>
              <Tooltip
                title={
                  moment(new Date()).format("YYYY-MM-DDTHH:mm:00.000") >
                  moment(new Date(OrganizationBankBalance?.date_checked))
                    .add(20, "minutes")
                    .format("YYYY-MM-DDTHH:mm:00.000")
                    ? t("messages.20_minutes_consult")
                    : undefined
                }
              >
                <Typography.Text
                  mark={
                    moment(new Date()).format("YYYY-MM-DDTHH:mm:00.000") >
                    moment(new Date(OrganizationBankBalance?.date_checked))
                      .add(20, "minutes")
                      .format("YYYY-MM-DDTHH:mm:00.000")
                  }
                  style={{ color: "#d6d6d6", fontSize: "11px" }}
                >
                  {moment(
                    new Date(OrganizationBankBalance?.date_checked)
                  ).format(
                    navigator.language === "pt-BR"
                      ? "DD/MM/YYYY HH:mm"
                      : "YYYY/MM/DD HH:mm"
                  )}
                </Typography.Text>{" "}
              </Tooltip>
            </div>
          </Col>
        </Row>
      </Tooltip>
    </List.Item>
  ) : (
    <></>
  );
};
