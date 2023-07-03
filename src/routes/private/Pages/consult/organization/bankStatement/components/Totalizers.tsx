import { useGetOrganizationBankStatementTotals } from "@src/services/consult/organization/bankStatement/getTotals";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { Divider, Statistic } from "antd";
import { defaultTheme } from "@src/styles/defaultTheme";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface TotalizersInterface {
  query: OrganizationBankStatementTotalsQuery;
}

export const Totalizers = ({ query }: TotalizersInterface) => {
  const { t } = useTranslation();
  const {
    OrganizationBankStatementTotals,
    isOrganizationBankStatementTotalsFetching,
    refetchOrganizationBankStatementTotalsTotal,
  } = useGetOrganizationBankStatementTotals(query);

  useEffect(() => {
    refetchOrganizationBankStatementTotalsTotal();
  }, [query]);

  return (
    <Grid container>
      <Grid container>
        <Grid
          container
          item
          xs={12}
          style={{ height: "5px", marginBottom: "50px" }}
        >
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "center" }}
        >
          Entrada
        </Grid>
        {Object.keys(OrganizationBankStatementTotals).map((key) => {
          switch (key) {
            case "number_in":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t("table.number_in")}
                    value={OrganizationBankStatementTotals[key]}
                    precision={0}
                    valueStyle={{
                      color: defaultTheme.colors.paid,
                      fontSize: "16px",
                    }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Grid>
              );
            case "value_in":
            case "bank_fee_in":
            case "fee_in":
            case "result_in":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t(`table.${key}`)}
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(OrganizationBankStatementTotals[key] || 0)}
                    precision={2}
                    valueStyle={{
                      color: defaultTheme.colors.paid,
                      fontSize: "16px",
                    }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Grid>
              );

            default:
              return;
          }
        })}
      </Grid>
      <Grid container>
        <Grid container item xs={12} style={{ height: "5px" }}>
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "25px",
        }}
      >
        <Grid
          item
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "center" }}
        >
          Saída
        </Grid>
        {Object.keys(OrganizationBankStatementTotals).map((key) => {
          switch (key) {
            case "number_out":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t("table.number_in")}
                    value={OrganizationBankStatementTotals[key]}
                    precision={0}
                    valueStyle={{
                      color: defaultTheme.colors.error,
                      fontSize: "16px",
                    }}
                    prefix={<ArrowDownOutlined />}
                  />
                </Grid>
              );
            case "value_out":
            case "bank_fee_out":
            case "fee_out":
            case "result_out":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t(`table.${key}`)}
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(OrganizationBankStatementTotals[key] || 0)}
                    precision={2}
                    valueStyle={{
                      color: defaultTheme.colors.error,
                      fontSize: "16px",
                    }}
                    prefix={<ArrowDownOutlined />}
                  />
                </Grid>
              );

            default:
              return;
          }
        })}
      </Grid>
      <Grid container>
        <Grid container item xs={12} style={{ height: "5px" }}>
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "25px",
        }}
      >
        <Grid
          item
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "center" }}
        >
          Saída
        </Grid>
        {Object.keys(OrganizationBankStatementTotals).map((key) => {
          switch (key) {
            case "number_out":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t("table.number_in")}
                    value={OrganizationBankStatementTotals[key]}
                    precision={0}
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Grid>
              );
            case "value_out":
            case "bank_fee_out":
            case "fee_out":
            case "result_out":
              return (
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    loading={isOrganizationBankStatementTotalsFetching}
                    title={t(`table.${key}`)}
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(OrganizationBankStatementTotals[key] || 0)}
                    precision={2}
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Grid>
              );

            default:
              return;
          }
        })}
      </Grid>
      <Grid container>
        <Grid container item xs={12} style={{ height: "5px" }}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
};
