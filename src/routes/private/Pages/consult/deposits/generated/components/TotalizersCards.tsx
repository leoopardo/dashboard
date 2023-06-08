import React from "react";
import { Grid } from "@mui/material";
import { Button, Card, Statistic } from "antd";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../../../../../../../services/types/generatedDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { ReloadOutlined } from "@ant-design/icons";

interface TotalizersInterface {
  data: generatedDepositTotal | null | undefined;
  query: generatedDepositTotalQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
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
              title={`Pago: ${props?.data?.paid_total || 0}`}
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
      {(props.query.status === "AWAITING_REFUND" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`Devolvido: ${props?.data?.refund_total || 0}`}
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
              title={`Cancelado: ${props?.data?.canceled_total || 0}`}
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
              title={`Expirado: ${props?.data?.expired_total || 0}`}
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
              title={`Pendente: ${props?.data?.waiting_total || 0}`}
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
              title={`Aguardando devolução: ${
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
          type="ghost"
          onClick={props.fetchData}
        >
          {!props.loading && <ReloadOutlined />}
        </Button>
      </Grid>
    </Grid>
  );
};
