import React from "react";
import { Grid } from "@mui/material";
import { Button, Card, Statistic } from "antd";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsTotal,
} from "../../../../../../../services/types/generatedWithdrawals.interface";

interface TotalizersInterface {
  data: generatedWithdrawalsTotal | null | undefined;
  query: generatedWithdrawalsRowsQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });

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
      {(props.query.status === "REFUNDED_WITHDRAW" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.refunded")}: ${
                props?.data?.withdraw_refunded_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.withdraw_refunded_value || 0)}
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

      {(props.query.status === "PROCESSING" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.processing")}: ${
                props?.data?.processing_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.processing_value || 0)}
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
      {(props.query.status === "PENDING" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.pending")}: ${
                props?.data?.pending_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.pending_value || 0)}
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

      {(props.query.status === "IN_ANALYSIS" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.in_analysis")}: ${
                props?.data?.in_analysis_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.in_analysis_value || 0)}
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
      {(props.query.status === "CREATED" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.created")}: ${
                props?.data?.created_total || 0
              }`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.created_value || 0)}
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

      <Grid item xs={6} md={4} lg={"auto"} >
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
      <Grid item xs={2} md={1} lg={1}>
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
