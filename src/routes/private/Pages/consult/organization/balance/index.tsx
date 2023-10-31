/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useGetOrganizationBalance } from "@src/services/consult/organization/balance/getPerBank";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Card, Descriptions, Divider, Spin, Statistic } from "antd";
import { useTranslation } from "react-i18next";
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
            type="primary"
            style={{ width: "100%" }}
            loading={isOrganizationBalanceFetching}
            onClickCapture={() => {
              refetchOrganizationBalance();
            }}
          >
            <ReloadOutlined /> {t("buttons.refresh")}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item xs={12} spacing={2} style={{ display: "flex" }}>
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
        <Grid item xs={12} md={4}>
          <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
            <Descriptions.Item
              key={"in"}
              label={t(`table.in`)}
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
              }).format(OrganizationBalance?.in || 0)}
            </Descriptions.Item>
            <Descriptions.Item
              key={"out"}
              label={t(`table.out`)}
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
              }).format(OrganizationBalance?.out || 0)}
            </Descriptions.Item>
     
            <Descriptions.Item
              key={"updatedAt"}
              label={t(`table.updatedAt`)}
              labelStyle={{
                maxWidth: "120px !important",
                margin: 0,
                padding: 0,
                textAlign: "center",
              }}
            >
              {`${new Date(
                OrganizationBalance?.updatedAt ?? ""
              ).toLocaleDateString()} ${new Date(
                OrganizationBalance?.updatedAt ?? ""
              ).toLocaleTimeString()}`}
            </Descriptions.Item>
          </Descriptions>
        </Grid>
        <Grid item xs={12} md={4}>
          <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
            <Descriptions.Item
              key={"pix_transactions_total"}
              label={t(`table.pix_transactions_total`)}
              labelStyle={{
                maxWidth: "120px !important",
                margin: 0,
                padding: 0,
                textAlign: "center",
              }}
            >
              {OrganizationBalance?.pix_transactions_total || 0}
            </Descriptions.Item>
            <Descriptions.Item
              key={"withdraw_transactions_total"}
              label={t(`table.withdraw_transactions_total`)}
              labelStyle={{
                maxWidth: "120px !important",
                margin: 0,
                padding: 0,
                textAlign: "center",
              }}
            >
              {OrganizationBalance?.withdraw_transactions_total || 0}
            </Descriptions.Item>
            <Descriptions.Item
              key={"refund_transactions_total"}
              label={t(`table.refund_transactions_total`)}
              labelStyle={{
                maxWidth: "120px !important",
                margin: 0,
                padding: 0,
                textAlign: "center",
              }}
            >
              {OrganizationBalance?.refund_transactions_total || 0}
            </Descriptions.Item>
          </Descriptions>
        </Grid>
        <Grid item xs={12} md={4}>
          <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
            <Descriptions.Item
              key={"pix_amount_fee"}
              label={t(`table.pix_amount_fee`)}
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
              }).format(OrganizationBalance?.pix_amount_fee || 0)}
            </Descriptions.Item>
            <Descriptions.Item
              key={"withdraw_amount_fee"}
              label={t(`table.withdraw_amount_fee`)}
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
              }).format(OrganizationBalance?.withdraw_amount_fee || 0)}
            </Descriptions.Item>
            <Descriptions.Item
              key={"refund_amount_fee"}
              label={t(`table.refund_amount_fee`)}
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
              }).format(OrganizationBalance?.refund_amount_fee || 0)}
            </Descriptions.Item>
          </Descriptions>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
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
        </Grid> */}
      </Grid>
    </Grid>
  );
};
