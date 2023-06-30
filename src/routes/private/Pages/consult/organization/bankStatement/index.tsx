import { useGetOrganizationBankStatementTotals } from "@src/services/consult/organization/bankStatement/getTotals";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { Grid } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { Card, Divider, Statistic } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: OrganizationBankStatementTotalsQuery = {
  start_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const OrganizationBankStatement = () => {
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<OrganizationBankStatementTotalsQuery>(INITIAL_QUERY);
  const { OrganizationBankStatementTotals } =
    useGetOrganizationBankStatementTotals(query);

  return (
    <Grid container style={{ padding: "25px" }}>
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
        {OrganizationBankStatementTotals &&
          Object.keys(OrganizationBankStatementTotals).map((key) => {
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
                      title={t("table.number_in")}
                      value={OrganizationBankStatementTotals[key]}
                      precision={0}
                      valueStyle={{ color: "#3f8600", fontSize: "16px" }}
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
                      title={t(`table.${key}`)}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(OrganizationBankStatementTotals[key] || 0)}
                      precision={2}
                      valueStyle={{ color: "#3f8600", fontSize: "16px" }}
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
          {" "}
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
        {OrganizationBankStatementTotals &&
          Object.keys(OrganizationBankStatementTotals).map((key) => {
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
                      title={t("table.number_in")}
                      value={OrganizationBankStatementTotals[key]}
                      precision={0}
                      valueStyle={{ color: "#cf1322", fontSize: "16px" }}
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
                      title={t(`table.${key}`)}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(OrganizationBankStatementTotals[key] || 0)}
                      precision={2}
                      valueStyle={{ color: "#cf1322", fontSize: "16px" }}
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
          {" "}
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
};
