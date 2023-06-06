import { Button, Card, Statistic } from "antd";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { generatedDepositTotalQuery } from "../../../../../../services/types/generatedDeposits.interface";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/generatedDeposits/getTotal";
import moment from "moment";
import { ReloadOutlined } from "@ant-design/icons";
import { defaultTheme } from "../../../../../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";

const INITIAL_QUERY: generatedDepositTotalQuery = {
  page: 1,
  limit: 25,
  initial_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const GeneratedDeposits = () => {
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { depositsTotal, error, isTotalFetching, fetchDepositsTotal } =
    useGetTotalGeneratedDeposits(INITIAL_QUERY);

  return (
    <Grid container style={{ padding: "25px" }}>
      {!error && (
        <Grid
          container
          spacing={1}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Pago: ${depositsTotal?.paid_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.paid_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.success,
                  fontSize: "18px",
                }}
                suffix=""
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Devolvido: ${depositsTotal?.refund_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.awaiting_refund_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.success,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Cancelado: ${depositsTotal?.canceled_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.canceled_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.error,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Expirado: ${depositsTotal?.expired_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.expired_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.error,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Pendente: ${depositsTotal?.waiting_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.waiting_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.warnning,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Aguardando devolução: ${
                  depositsTotal?.awaiting_refund_total || 0
                }`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.awaiting_refund_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.warnning,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={"auto"}
            minWidth={!isMobile ? 180 : undefined}
          >
            <Card bordered={false}>
              <Statistic
                loading={isTotalFetching}
                title={`Total: ${depositsTotal?.transactions_total || 0}`}
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(depositsTotal?.transaction_value || 0)}
                precision={2}
                valueStyle={{
                  color: defaultTheme.colors.dark,
                  fontSize: "18px",
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={2} md={2} lg={1}>
            <Button
              loading={isTotalFetching}
              type="ghost"
              onClick={fetchDepositsTotal}
            >
              {!isTotalFetching && <ReloadOutlined />}
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
