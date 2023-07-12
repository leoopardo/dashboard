/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Icon, { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Grid } from "@mui/material";
import { useGetOrganizationBankStatementTotals } from "@src/services/consult/organization/bankStatement/getTotals";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Divider, Statistic } from "antd";
import { useEffect } from "react";
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

  const MoneyIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={() => <AttachMoneyIcon />} {...props} />
  );

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
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowUpOutlined style={{ marginRight: "-5px" }} />
          <MoneyIcon /> {t("table.in")}
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
                    valueRender={(node: any) => <>{node.props.value}</>}
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
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowDownOutlined style={{ marginRight: "-5px" }} />
          <MoneyIcon />
          {t("table.out")}
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
                    title={t("table.number_out")}
                    value={OrganizationBankStatementTotals[key]}
                    precision={0}
                    valueStyle={{
                      color: defaultTheme.colors.error,
                      fontSize: "16px",
                    }}
                    prefix={<ArrowDownOutlined />}
                    valueRender={(node: any) => <>{node.props.value}</>}
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
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoneyIcon /> Total
        </Grid>
        {Object.keys(OrganizationBankStatementTotals).map((key) => {
          switch (key) {
            case "number_total":
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
                    title={t("table.number_total")}
                    value={OrganizationBankStatementTotals[key]}
                    precision={0}
                    valueRender={(node: any) => <>{node.props.value}</>}
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Grid>
              );
            case "value_total":
            case "bank_fee_total":
            case "fee_total":
            case "result_total":
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
