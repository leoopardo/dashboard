import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { Button, Card, Statistic } from "antd";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface TotalizersInterface {
  data: generatedDepositTotal | null | undefined;
  query: generatedDepositTotalQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={1}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {(props.query.status === "PAID" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.paid")}: ${props?.data?.paid_total || 0}`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.paid_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
              suffix=""
            />
          </Card>
        </Grid>
      )}
      {(props.query.status === "REFUNDED" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.refunded")}: ${
                props?.data?.refund_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.awaiting_refund_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Grid>
      )}

      {(props.query.status === "CANCELED" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.canceled")}: ${
                props?.data?.canceled_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.canceled_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Grid>
      )}

      {(props.query.status === "EXPIRED" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.expired")}: ${
                props?.data?.expired_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.expired_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Grid>
      )}
      {(props.query.status === "WAITING" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.waiting")}: ${
                props?.data?.waiting_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.waiting_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Grid>
      )}

      {(props.query.status === "AWAITING_REFUND" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.waiting_refund")}: ${
                props?.data?.awaiting_refund_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.awaiting_refund_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Grid>
      )}

      <Grid item xs={6} md={4} lg={"auto"} height="100%">
        <Card bordered={false}>
          <Statistic
            loading={props.loading}
            title={`Total: ${props?.data?.transactions_total || 0}`}
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.dark,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={6} md={1} lg={1}>
        <Button
          shape="circle"
          style={{ width: "50px", height: "50px" }}
          loading={props.loading}
          type="dashed"
          onClick={props.fetchData}
        >
          {!props.loading && <ReloadOutlined />}
        </Button>
      </Grid>
    </Grid>
  );
};
