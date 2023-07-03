import React from "react";
import { Grid } from "@mui/material";
import { Button, Card, Descriptions, Divider, Spin, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { defaultTheme } from "@src/styles/defaultTheme";
import { useGetOrganizationBalance } from "@src/services/consult/organization/balance/getPerBank";
import { useMediaQuery } from "react-responsive";
import { OrganizationBalanceChart } from "./components/TotalChart";

export const OrganizationBalance = () => {
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const {
    OrganizationBalance,
    isOrganizationBalanceFetching,
    refetchOrganizationBalance,
  } = useGetOrganizationBalance();
  const { t } = useTranslation();
  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        spacing={1}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid
          item
          xs={12}
          md={1}
          style={{
            minWidth: "120px",
            minHeight: "120px",
            marginRight: !isMobile ? "15px" : 0,
          }}
        >
          <OrganizationBalanceChart items={OrganizationBalance} />
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isOrganizationBalanceFetching}
              title={t("table.balance_to_transactions")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(OrganizationBalance?.balance_to_transactions || 0)}
              precision={0}
              valueStyle={{ color: "#006086", fontSize: "16px" }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isOrganizationBalanceFetching}
              title={t("table.balance_to_payment")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(OrganizationBalance?.balance_to_payment || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isOrganizationBalanceFetching}
              title={t("table.balance_reserved")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(OrganizationBalance?.balance_reserved || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isOrganizationBalanceFetching}
              title={t("table.balance_total")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(OrganizationBalance?.balance_total || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.paid,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md="auto"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isOrganizationBalanceFetching}
            onClickCapture={() => {
              refetchOrganizationBalance();
            }}
          >
            {t("buttons.refresh")}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid
        container
        item
        xs={12}
        spacing={2}
        style={{ display: "flex", alignItems: "center" }}
      >
        {isOrganizationBalanceFetching && (
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              height: "50px",
            }}
          >
            <Spin />
          </Grid>
        )}

        <Grid item xs={12}>
          <Descriptions
            bordered
            style={{ margin: 0, padding: 0 }}
            column={isMobile ? 1 : 2}
          >
            {OrganizationBalance &&
              Object.keys(OrganizationBalance).map((key: string, index) => {
                switch (key) {
                  case "createdAt":
                  case "updatedAt":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {`${new Date(
                          OrganizationBalance[key] ?? ""
                        ).toLocaleDateString()} ${new Date(
                          OrganizationBalance[key] ?? ""
                        ).toLocaleTimeString()}`}
                      </Descriptions.Item>
                    );

                  case "in":
                  case "out":
                  case "pix_amount_fee":
                  case "refund_amount_fee":
                  case "refund_transactions_total":
                  case "withdraw_amount_fee":
                  case "withdraw_transactions_total":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(OrganizationBalance[key] || 0)}
                      </Descriptions.Item>
                    );

                  case "balance_reserved":
                  case "balance_to_payment":
                  case "balance_to_transactions":
                  case "balance_total":
                  case "_id":
                  case "organization_id":
                    return;
                  default:
                    return (
                      <Descriptions.Item
                        key={index}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {(OrganizationBalance as any)[key] ?? "-"}
                      </Descriptions.Item>
                    );
                }
              })}
          </Descriptions>
        </Grid>
      </Grid>
    </Grid>
  );
};
